import * as classNames from 'classnames';
import * as React from 'react';

const styles = require('./loading-icon.scss');

// Taken from http://tobiasahlin.com/spinkit/

interface Props {
  className?: string;
  center?: boolean;
}

const LoadingIcon = ({ className, center }: Props) => (
  <div className={classNames(styles.container, { [styles.center]: !!center }, className)}>
    <div className={styles.loading} />
  </div>
);

export default LoadingIcon;
