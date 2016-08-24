import * as classNames from 'classnames';
import * as range from 'lodash/range';
import * as React from 'react';
import * as Icon from 'react-fontawesome';

import { Deployment } from '../../modules/deployments';
import { FetchError, isError } from '../../modules/errors';

const noScreenshotURL = require('../../../images/no-screenshot.png');
const styles = require('./screenshot-pile.scss');

interface Props {
  deployment?: Deployment | FetchError;
  count: number;
}

const noScreenshot = (
  <img
    alt="No screenshot available"
    title="No screenshot available"
    className={styles.single}
    src={noScreenshotURL}
  />
);

const loading = (
  <div className={styles.pile}>
    <div className={classNames(styles.screenshot, styles['screenshot-0'], styles.empty)}>
      <Icon name="circle-o-notch" spin fixedWidth size="2x" />
    </div>
  </div>
);

const ScreenshotPile = ({ deployment, count }: Props) => {
  if (count === 0) {
    return noScreenshot;
  }

  if (!deployment) {
    return loading;
  }

  if (isError(deployment) || deployment.status === 'failed' || !deployment.screenshot) {
    return noScreenshot;
  }

  const realDeployment = deployment; // Bug in TypeScript?

  if (count === 1) {
    return <img className={styles.single} src={realDeployment.screenshot} />;
  }

  return (
    <div className={styles.pile}>
      {range(Math.min(count, 4)).map(i =>
        <img
          key={i}
          className={classNames(styles.screenshot, styles[`screenshot-${i}`])}
          src={realDeployment.screenshot}
        />)}
    </div>
  );
};

export default ScreenshotPile;
