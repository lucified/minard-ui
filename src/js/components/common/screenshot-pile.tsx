import * as classNames from 'classnames';
import { isNil, some } from 'lodash';
import * as React from 'react';
import * as Icon from 'react-fontawesome';

import { Deployment } from '../../modules/deployments';

const styles = require('./screenshot-pile.scss');

interface Props {
  deployments: Deployment[];
}

class ScreenshotPile extends React.Component<Props, any> {
  public render() {
    const { deployments } = this.props;

    if (deployments.length === 0) {
      return (
        <div className={classNames(styles.pile, styles.empty)}>
          <Icon name="times" size="3x" />
        </div>
      );
    }

    if (some(deployments, isNil)) {
      return (
        <div className={classNames(styles.pile, styles.empty)}>
           <Icon name="circle-o-notch" spin fixedWidth size="3x" />
        </div>
      );
    }

    const latestDeployments = deployments.sort((a, b) => a.creator.timestamp - b.creator.timestamp);

    return (
      <div className={styles.pile}>
        {latestDeployments.slice(0, 4).map((deployment, i) =>
          <img
            key={deployment.id}
            className={classNames('img-responsive', styles.screenshot, styles[`screenshot-${i}`])}
            src={deployment.screenshot}
          />
        )}
      </div>
    );
  }
}

export default ScreenshotPile;
