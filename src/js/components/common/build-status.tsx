import * as classNames from 'classnames';
import * as React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import Icon = require('react-fontawesome');

import { logMessage } from '../../logger';
import { Commit } from '../../modules/commits';
import { Deployment, DeploymentStatus } from '../../modules/deployments';
import MinardLink from './minard-link';

const styles = require('./build-status.scss');

interface PassedProps {
  deployment?: Deployment;
  commit?: Commit;
  className?: string;
  latest?: boolean;
}

const BuildStatus = ({ className, commit, deployment, latest }: PassedProps) => {
  let content: JSX.Element | null = null;

  if (deployment && commit) {
    switch (deployment.status) {
      case DeploymentStatus.Success:
        content = null;
        break;
      case DeploymentStatus.Canceled:
        content = (
          <MinardLink preview={{ deployment, buildLog: true }} openInNewWindow>
            <div key="canceled" className={classNames(styles.box, styles.error)}>
              <Icon name="times" className={styles.icon} />
              {latest ? <span>Latest build canceled</span> : <span>Build canceled</span>}
            </div>
          </MinardLink>
        );
        break;
      case DeploymentStatus.Failed:
        content = (
          <MinardLink preview={{ deployment, buildLog: true }} openInNewWindow>
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
          <MinardLink preview={{ deployment, buildLog: true }} openInNewWindow>
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
    <CSSTransitionGroup
      transitionName="build-status"
      transitionEnterTimeout={150}
      transitionLeaveTimeout={150}
      className={className}
    >
      {content}
    </CSSTransitionGroup>
  );
};

export default BuildStatus;
