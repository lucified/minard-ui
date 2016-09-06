import * as classNames from 'classnames';
import * as React from 'react';

import { Deployment } from '../../modules/deployments';
import { FetchError, isFetchError } from '../../modules/errors';

const styles = require('./deployment-screenshot.scss');
const noScreenshot = require('../../../images/no-screenshot.png');

interface Props {
  deployment?: Deployment | FetchError;
  className?: string;
}

// TODO: handle FetchErrors somehow differently?
const DeploymentScreenshot = ({ deployment, className }: Props) => (
  <img
    src={(deployment && !isFetchError(deployment) && deployment.screenshot) || noScreenshot}
    className={classNames(styles.image, className)}
  />
);

export default DeploymentScreenshot;
