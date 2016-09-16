import * as classNames from 'classnames';
import * as React from 'react';
import * as Icon from 'react-fontawesome';

import { Deployment, DeploymentStatus } from '../../modules/deployments';
import { FetchError, isFetchError } from '../../modules/errors';

const styles = require('./build-status.scss');

interface PassedProps {
  deployment?: Deployment | FetchError;
  className?: string;
}

const BuildStatus = ({ className, deployment }: PassedProps) => {
  if (!deployment || isFetchError(deployment) || deployment.status === DeploymentStatus.Success) {
    return <span />;
  }

  switch (deployment.status) {
    case DeploymentStatus.Canceled:
      return (
        <span className={classNames(styles.box, styles.error, className)}>
          <Icon name="times" className={styles.icon} />
          Latest build canceled
        </span>
      );
    case DeploymentStatus.Failed:
      return (
        <span className={classNames(styles.box, styles.error, className)}>
          <Icon name="times" className={styles.icon} />
          Latest build failed
        </span>
      );
    case DeploymentStatus.Pending:
    case DeploymentStatus.Running:
      return (
        <span className={classNames(styles.box, styles.building, className)}>
          <Icon name="circle-o-notch" spin className={styles.icon} />
          Generating preview
        </span>
      );
    default:
      console.log('Error: unknown deployment status:', deployment); // tslint:disable-line
      return <span />;
  }
};

export default BuildStatus;
