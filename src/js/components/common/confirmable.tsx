import * as classNames from 'classnames';
import * as React from 'react';
import { findDOMNode } from 'react-dom';

const styles = require('./confirmable.scss');

interface Props {
  title: string;
  message: string;
  action: string;
  onConfirm?: (e?: any) => void;
}

// Must be passed (only) one child component
class Confirmable extends React.Component<Props, any> {
  constructor(props: any) {
    super(props);
    this.showPopup = this.showPopup.bind(this);
    this.hidePopup = this.hidePopup.bind(this);
    this.confirm = this.confirm.bind(this);
    this.closePopupIfNotClickingSelf = this.closePopupIfNotClickingSelf.bind(this);

    this.state = {
      open: false,
    };
  }

  private closePopupIfNotClickingSelf(e: any) {
    console.log('closepopupifnot');
    if (e.target !== findDOMNode(this)) {
      this.hidePopup();
    }
  }

  public componentWillUnmount() {
    if (this.state.open) {
      console.log('cleaning up')
      window.removeEventListener('click', this.closePopupIfNotClickingSelf, false);
    }
  }

  private showPopup(e?: any) {
    console.log('showPopup')
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    window.addEventListener('click', this.closePopupIfNotClickingSelf, false);

    this.setState({ open: true });
  }

  private hidePopup(e?: any) {
    console.log('hidePopup')
    if (e) {
      e.preventDefault();
    }

    window.removeEventListener('click', this.closePopupIfNotClickingSelf, false);

    this.setState({ open: false });
  }

  private confirm(e?: any) {
    if (e) {
      e.preventDefault();
    }
    this.hidePopup();
    if (this.props.onConfirm) {
      this.props.onConfirm();
    }
  }

  public render() {
    const { title, message, action, children } = this.props;
    return (
      <div className={styles.confirmable}>
        {this.state.open && (
          <div className={classNames(styles.popup, styles['arrow-box'])}>
            <div className={styles.content}>
              <div className={styles.title}>{title}</div>
              <div className={styles.message}>{message}</div>
            </div>
            <div className={styles.actions}>
              <button className={styles.confirm} onClick={this.confirm}>{action}</button>
              <a className={styles.cancel} onClick={this.hidePopup}>Cancel</a>
            </div>
          </div>
        )}
        {React.cloneElement(React.Children.only(children!), { onClick: this.showPopup })}
      </div>
    );
  }
};

export default Confirmable;
