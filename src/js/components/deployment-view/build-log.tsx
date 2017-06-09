import * as classNames from 'classnames';
import * as React from 'react';
const Convert = require('ansi-to-html');

import { Api } from '../../api/types';
const API: Api = process.env.USE_MOCK
  ? require('../../api/static-json').default
  : require('../../api').default;
import { Deployment } from '../../modules/deployments';
import Spinner from '../common/spinner';

const styles = require('./build-log.scss');

const convert = new Convert({
  fg: '#000',
  bg: '#fff',
  newline: true,
  escapeXML: true,
});

interface PassedProps {
  deployment: Deployment;
}

interface State {
  log?: string;
  error?: string;
}

type Props = PassedProps;

interface ErrorResponse {
  error: string;
  details?: string | undefined;
  unauthorized?: boolean | undefined;
}

function isError(response: any): response is ErrorResponse {
  return (response as ErrorResponse).error !== undefined;
}

class BuildLog extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      log: undefined,
      error: undefined,
    };

    this.updateLog = this.updateLog.bind(this);
  }

  private intervalID?: any;
  private refreshCadenceInMs = 5000;

  public componentWillMount() {
    const { deployment } = this.props;

    this.updateLog(deployment.id);
    this.intervalID = setInterval(
      this.updateLog,
      this.refreshCadenceInMs,
      deployment.id,
    );
  }

  public componentWillReceiveProps(nextProps: Props) {
    const { deployment } = this.props;

    if (deployment.id !== nextProps.deployment.id) {
      if (this.intervalID) {
        clearInterval(this.intervalID);
      }

      this.updateLog(nextProps.deployment.id);
      this.intervalID = setInterval(
        this.updateLog,
        this.refreshCadenceInMs,
        nextProps.deployment.id,
      );
    }
  }

  public componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  private updateLog(deploymentId: string) {
    API.Deployment.fetchBuildLog(deploymentId).then(result => {
      if (isError(result)) {
        if (this.intervalID) {
          clearInterval(this.intervalID);
        }

        this.setState({ error: result.error });
      } else {
        this.setState({ log: result.response, error: undefined });
      }
    });
  }

  public render() {
    const { log, error } = this.state;

    if (!log && !error) {
      return <Spinner />;
    }

    if (error) {
      return (
        <div className={classNames(styles.frame, styles.error)}>
          Error: {error}
        </div>
      );
    }

    return (
      <div
        className={classNames(styles.frame, styles['build-log'])}
        dangerouslySetInnerHTML={{ __html: convert.toHtml(log) }}
      />
    );
  }
}

export default BuildLog;
