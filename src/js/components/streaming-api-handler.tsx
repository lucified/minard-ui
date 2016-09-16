import * as React from 'react';
import { connect } from 'react-redux';

require('event-source-polyfill');

import Projects, { Project } from '../modules/projects';
import Streaming, { ConnectionState } from '../modules/streaming';
import { toProjects } from '../api/convert';

declare var EventSource: any;

let streamingAPIUrl: string = process.env.STREAMING_API || process.env.CHARLES;
// Remove trailing /
streamingAPIUrl = streamingAPIUrl.replace(/\/$/, '');
streamingAPIUrl = `${streamingAPIUrl}/events/1`; // TODO: add actual team ID

const toConnectionState = (state: any): ConnectionState => {
  switch (state) {
    case EventSource.CONNECTING:
      return ConnectionState.CONNECTING;
    case EventSource.CLOSED:
      return ConnectionState.CLOSED;
    case EventSource.OPEN:
      return ConnectionState.OPEN;
    default:
      throw new Error('Unknown connection state!');
  }
}

interface GeneratedDispatchProps {
  storeProjects: (projects: Project[]) => void;
  setConnectionState: (state: ConnectionState, error?: string) => void;
}

class StreamingAPIHandler extends React.Component<GeneratedDispatchProps, any> {
  private _source: any; // tslint:disable-line

  constructor(props: GeneratedDispatchProps) {
    super(props);

    this.restartConnection = this.restartConnection.bind(this);
  }

  private restartConnection() {
    console.log('opening new streaming connection to', streamingAPIUrl);
    this._source = new EventSource(streamingAPIUrl, { withCredentials: false });
    this._source.addEventListener('error', (e: any) => {
      console.log('onerror:', e);
      const source = e.target;
      this.props.setConnectionState(toConnectionState(source.readyState));

      if (source.readyState === EventSource.CLOSED) {
        console.log('triggering connection restart');
        this._source.close();
        this._source = null;

        setTimeout(this.restartConnection, 5000); // TODO: smarter retry logic?
      }
    }, false);
    this._source.addEventListener('open', () => {
      console.log('onopen');
      this.props.setConnectionState(ConnectionState.OPEN);
    }, false);
    this._source.addEventListener('message', (e: any) => {
      console.log('received message:', e.data);
    }, false);
    this.props.setConnectionState(toConnectionState(this._source.readyState));
  }

  public componentWillMount() {
    if (streamingAPIUrl) {
      this.restartConnection();
    }
  }

  public componentWillUnmount() {
    if (this._source) {
      console.log('closing');
      this._source.close();
    }
  }

  public render() {
    return <span />;
  }
};

export default connect<{}, GeneratedDispatchProps, {}>(
  () => ({}),
  {
    storeProjects: Projects.actions.storeProjects,
    setConnectionState: Streaming.actions.setConnectionState,
  }
)(StreamingAPIHandler);
