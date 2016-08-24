import * as classNames from 'classnames';
import * as range from 'lodash/range';
import * as React from 'react';
import * as Icon from 'react-fontawesome';

import { Deployment } from '../../modules/deployments';
import { FetchError, isError } from '../../modules/errors';

const styles = require('./screenshot-pile.scss');

interface Props {
  deployment?: Deployment | FetchError;
  count: number;
}

const getScreenshot = (deployment: Deployment | FetchError | undefined, i: number) => {
  if (!deployment) {
    return (
      <div key={i} className={classNames(styles.screenshot, styles[`screenshot-${i}`], styles.empty)}>
        <Icon name="circle-o-notch" spin fixedWidth size="3x" />
      </div>
    );
  }

  if (isError(deployment) || deployment.status === 'failed') {
    return (
      <div key={i} className={classNames(styles.screenshot, styles[`screenshot-${i}`], styles.empty)}>
        <Icon name="exclamation" fixedWidth size="3x" />
      </div>
    );
  }

  return (
    <img
      key={i}
      className={classNames(styles.screenshot, styles[`screenshot-${i}`])}
      src={deployment.screenshot}
    />
  );
};

const ScreenshotPile = ({ deployment, count }: Props) => {
  if (count === 0) {
    return (
      <div className={classNames(styles.screenshot, styles['screenshot-0'], styles.empty)}>
        <Icon name="times" size="3x" />
      </div>
    );
  }

  return (
    <div className={styles.pile}>
      {range(Math.min(count, 4)).map(i => getScreenshot(deployment, i))}
    </div>
  );
};

export default ScreenshotPile;
