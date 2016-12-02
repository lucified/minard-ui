import * as classNames from 'classnames';
import * as Raven from 'raven-js';
import * as React from 'react';
import * as ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import * as Icon from 'react-fontawesome';

import { Deployment, DeploymentStatus } from '../../modules/deployments';
import { FetchError, isFetchError } from '../../modules/errors';

const getBuildLogURL = process.env.CHARLES ?
  require('../../api').getBuildLogURL :
  require('../../api/static-json').getBuildLogURL;

const styles = require('./build-status.scss');

interface PassedProps {
  deployment?: Deployment | FetchError;
  className?: string;
  latest?: boolean;
}

const BuildStatus = ({ className, deployment, latest }: PassedProps) => {
  let content: JSX.Element | null = null;

  // TODO: Link to build tab of Deployment View instead

  if (deployment && !isFetchError(deployment)) {
    switch (deployment.status) {
      case DeploymentStatus.Success:
        content = null;
        break;
      case DeploymentStatus.Canceled:
        content = (
          <a href={getBuildLogURL(deployment.id)} target="_blank">
            <span key="canceled" className={classNames(styles.box, styles.error)}>
              <Icon name="times" className={styles.icon} />
              {latest ? <span>Latest build canceled</span> : <span>Build canceled</span>}
            </span>
          </a>
        );
        break;
      case DeploymentStatus.Failed:
        content = (
          <a href={getBuildLogURL(deployment.id)} target="_blank">
            <span key="failed" className={classNames(styles.box, styles.error)}>
              <Icon name="times" className={styles.icon} />
              {latest ? <span>Latest build failed</span> : <span>Build failed</span>}
            </span>
          </a>
        );
        break;
      case DeploymentStatus.Pending:
      case DeploymentStatus.Running:
        content = (
          <a href={getBuildLogURL(deployment.id)} target="_blank">
            <span key="running" className={classNames(styles.box, styles.building)}>
              <Icon name="circle-o-notch" spin className={styles.icon} />
              Generating preview
            </span>
          </a>
        );
        break;
      default:
        console.error('Unknown deployment status:', deployment);

        if (Raven.isSetup()) {
          Raven.captureMessage('Unknown deployment status', { extra: { deployment } });
        }
    }
  }

  return (
    <ReactCSSTransitionGroup
      transitionName="build-status"
      transitionEnterTimeout={150}
      transitionLeaveTimeout={150}
      className={className}
    >
      {content}
    </ReactCSSTransitionGroup>
  );
};

export default BuildStatus;
