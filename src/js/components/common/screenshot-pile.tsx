import * as classNames from 'classnames';
import * as React from 'react';
import * as Icon from 'react-fontawesome';

import { Deployment } from '../../modules/deployments';
import { FetchError, isError } from '../../modules/errors';

const styles = require('./screenshot-pile.scss');
const screenshot = require('../../../images/screenshot.png');

interface Props {
  deployments: (Deployment | FetchError)[];
}

const getScreenshot = (deployment: Deployment | FetchError, i: number) => {
  if (!deployment) {
    return (
      <div
        key={i}
        className={classNames('img-responsive', styles.screenshot, styles[`screenshot-${i}`], styles.empty)}
      >
        <Icon name="circle-o-notch" spin fixedWidth size="3x" />
      </div>
    );
  }

  if (isError(deployment)) {
    return (
      <div
        key={i}
        className={classNames('img-responsive', styles.screenshot, styles[`screenshot-${i}`], styles.empty)}
      >
        <Icon name="exclamation" fixedWidth size="3x" />
      </div>
    );
  }

  return (
    <img
      key={i}
      className={classNames('img-responsive', styles.screenshot, styles[`screenshot-${i}`])}
      src={screenshot /* TODO: deployment.screenshot */}
    />
  );
};

const ScreenshotPile = ({ deployments }: Props) => {
  if (deployments.length === 0) {
    return (
      <div className={styles.pile}>
        <div className={classNames('img-responsive', styles.screenshot, styles['screenshot-0'], styles.empty)}>
          <Icon name="times" size="3x" />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pile}>
      {deployments.slice(0, 4).map((deployment, i) => getScreenshot(deployment, i))}
    </div>
  );
};

export default ScreenshotPile;
