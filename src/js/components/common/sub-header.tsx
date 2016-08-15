import * as classNames from 'classnames';
import * as React from 'react';

const styles = require('./sub-header.scss');

interface Props {
  align: 'left' | 'center' | 'right';
}

class SubHeader extends React.Component<Props, any> {
  public render() {
    return (
      <section className={styles['sub-header-background']}>
        <section className={classNames('container', 'grid-1200')}>
          <section className={classNames(styles['sub-header'], styles[this.props.align])}>
            {this.props.children}
          </section>
        </section>
      </section>
    );
  }
};

export default SubHeader;
