import * as React from 'react';

const spinner = require('../../../images/spinner.svg');

const styles = require('./spinner.scss');

interface Props {
}

export default class Spinner extends React.Component<Props, void> {
  public render() {
    return (
      <div className={styles.spinner}>
        <img src={spinner} />
      </div>
    );
  }
}
