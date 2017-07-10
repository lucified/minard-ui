import * as React from 'react';

const spinner = require('../../../images/spinner.svg');

const styles = require('./spinner.scss');

export default function Spinner() {
  return (
    <div className={styles.spinner}>
      <img src={spinner} />
    </div>
  );
}
