import * as classNames from 'classnames';
import * as React from 'react';
import * as Icon from 'react-fontawesome';

import { Commit } from '../../modules/commits';

const styles = require('./screenshot-pile.scss');

interface Props {
  commits: Commit[];
}

class ScreenshotPile extends React.Component<Props, any> {
  public render() {
    const { commits } = this.props;
    const latestDeployedCommits = commits.filter(commit => commit.hasDeployment)
      .sort((a, b) => a.timestamp - b.timestamp);

    if (latestDeployedCommits.length === 0) {
      return (
        <div className={styles.pile}>
          <Icon className={styles.empty} name="times" size="4x" />
        </div>
      );
    }

    return (
      <div className={styles.pile}>
        {latestDeployedCommits.slice(0, 4).map((commit, i) =>
          <img
            key={commit.hash}
            className={classNames('img-responsive', styles.screenshot, styles[`screenshot-${i}`])}
            src={commit.screenshot}
          />
        )}
      </div>
    );
  }
}

export default ScreenshotPile;
