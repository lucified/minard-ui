import * as classNames from 'classnames';
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
    const latestDeployments = deployments.sort((a, b) => a.creator.timestamp - b.creator.timestamp);

    if (latestDeployments.length === 0) {
      return (
        <div className={styles.pile}>
          <Icon className={styles.empty} name="times" size="4x" />
        </div>
      );
    }

    debugger;

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
