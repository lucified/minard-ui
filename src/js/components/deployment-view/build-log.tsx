import * as React from 'react';

import API from '../../api';
import { Deployment } from '../../modules/deployments';

import Spinner from '../common/spinner';

const styles = require('./build-log.scss');

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
    this.intervalID = setInterval(this.updateLog, this.refreshCadenceInMs, deployment.id);
  }

  private updateLog(deploymentId: string) {
    API.Deployment.fetchBuildLog(deploymentId)
      .then(result => {
        if (isError(result)) {
          if (this.intervalID) {
            clearInterval(this.intervalID);
          }

          this.setState({ error: result.error });
        } else {
          this.setState({ log: result.response });
        }
      });
  }

  public componentWillReceiveProps(nextProps: Props) {
    const { deployment } = this.props;

    if (deployment.id !== nextProps.deployment.id) {
      if (this.intervalID) {
        clearInterval(this.intervalID);
      }

      this.updateLog(nextProps.deployment.id);
      this.intervalID = setInterval(this.updateLog, this.refreshCadenceInMs, nextProps.deployment.id);
    }
  }

  public render() {
    const { log, error } = this.state;

    if (!log && !error) {
      return <Spinner />;
    }

    return (
      <div className={styles['build-log']}>
        {error ? `Error: ${error}` : <pre>{log}</pre>}
      </div>
    );
  }
}

export default BuildLog;
