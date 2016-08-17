import * as classNames from 'classnames';
import * as React from 'react';

const styles = require('./sub-header.scss');

type AlignOptions = 'left' | 'center' | 'right';

interface Props {
  align: AlignOptions;
}

const classForAlignment: { [align: string]: string } = {
  left: 'start-xs',
  center: 'center-xs',
  right: 'end-xs',
};

class SubHeader extends React.Component<Props, any> {
  public render() {
    const { align, children } = this.props;

    return (
      <section className={classNames(styles['sub-header-background'])}>
        <div className="container">
          <div className="row">
            <div className={classNames(styles['sub-header'], classForAlignment[align], 'col-xs-12')}>
              {children}
            </div>
          </div>
        </div>
      </section>
    );
  }
};

export default SubHeader;
