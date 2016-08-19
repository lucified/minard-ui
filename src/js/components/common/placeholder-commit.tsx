import * as classNames from 'classnames';
import * as React from 'react';

const styles = require('./placeholder-commit.scss');

// Based on http://cloudcannon.com/deconstructions/2014/11/15/facebook-content-placeholder-deconstruction.html

interface Props {
  className: string;
}

const PlaceholderCommit = ({ className }: Props) => (
  <div className={classNames(styles['commit-container'], className)}>
    <div className={styles['animated-background']}>
      <div className={classNames(styles.mask, styles.avatar)} />
      <div className={classNames(styles.mask, styles['top-right'])} />
      <div className={classNames(styles.mask, styles['bottom-right'])} />
      <div className={classNames(styles.mask, styles.between)} />
    </div>
  </div>
);

export default PlaceholderCommit;
