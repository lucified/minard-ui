import * as classNames from 'classnames';
import * as React from 'react';
import * as Icon from 'react-fontawesome';

import { Deployment } from '../../modules/deployments';
import { FetchError, isError } from '../../modules/errors';

const styles = require('./screenshot-pile.scss');
const screenshot = [
  require('../../../images/screenshot-1.png'),
  require('../../../images/screenshot-2.png'),
];

interface Props {
  deployments: (Deployment | FetchError | undefined)[];
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
      src={screenshot[Math.round(Math.random())] /* TODO: deployment.screenshot */}
    />
  );
};

const ScreenshotPile = ({ deployments }: Props) => {
  return (
    <div className={styles.pile}>
    {(deployments.length > 0) ?
      deployments.slice(0, 4).map((deployment, i) => getScreenshot(deployment, i)) : (
        <div className={classNames(styles.screenshot, styles['screenshot-0'], styles.empty)}>
          <Icon name="times" size="3x" />
        </div>
      )
    }
    </div>
  );
};

export default ScreenshotPile;
