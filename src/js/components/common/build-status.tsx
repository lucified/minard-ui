import * as classNames from 'classnames';
import * as React from 'react';
import * as ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Icon = require('react-fontawesome');

import { logMessage } from '../../logger';
import { Deployment, DeploymentStatus } from '../../modules/deployments';
import { FetchError, isFetchError } from '../../modules/errors';
import MinardLink from './minard-link';

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
          <MinardLink preview={deployment} buildLog openInNewWindow>
            <div key="canceled" className={classNames(styles.box, styles.error)}>
              <Icon name="times" className={styles.icon} />
              {latest ? <span>Latest build canceled</span> : <span>Build canceled</span>}
            </div>
          </MinardLink>
        );
        break;
      case DeploymentStatus.Failed:
        content = (
          <MinardLink preview={deployment} buildLog openInNewWindow>
            <div key="failed" className={classNames(styles.box, styles.error)}>
              <Icon name="times" className={styles.icon} />
              {latest ? <span>Latest build failed</span> : <span>Build failed</span>}
            </div>
          </MinardLink>
        );
        break;
      case DeploymentStatus.Pending:
      case DeploymentStatus.Running:
        content = (
          <MinardLink preview={deployment} buildLog openInNewWindow>
            <div key="running" className={classNames(styles.box, styles.building)}>
              <Icon name="circle-o-notch" spin className={styles.icon} />
              Generating preview
            </div>
          </MinardLink>
        );
        break;
      default:
        logMessage('Unknown deployment status', { deployment });
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
