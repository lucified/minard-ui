import * as classNames from 'classnames';
import * as React from 'react';
import { findDOMNode } from 'react-dom';
import Icon = require('react-fontawesome');

const styles = require('./toggle-menu.scss');

interface Props {
  label: string;
  className?: string;
}

interface State {
  isOpen: boolean;
}

class ToggleMenu extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isOpen: false,
    };

    this.toggleMenu = this.toggleMenu.bind(this);
    this.closeMenuIfNotClickingSelf = this.closeMenuIfNotClickingSelf.bind(this);
  }

  public componentWillUnmount() {
    if (this.state.isOpen) {
      window.removeEventListener('click', this.closeMenuIfNotClickingSelf, false);
    }
  }

  private closeMenuIfNotClickingSelf(e: MouseEvent) {
    // Only close it if it's open and the click happens outside the menu
    if (this.state.isOpen && !findDOMNode(this).contains(e.target as any)) {
      this.toggleMenu();
    }
  }

  private toggleMenu() {
    if (this.state.isOpen) {
      window.removeEventListener('click', this.closeMenuIfNotClickingSelf, false);
      this.setState({ isOpen: false });
    } else {
      window.addEventListener('click', this.closeMenuIfNotClickingSelf, false);
      this.setState({ isOpen: true });
    }
  }

  public render() {
    const { isOpen } = this.state;
    const { label, className, children } = this.props;

    return (
      <div className={classNames(styles.menu, className)}>
        <span className={styles.link} onClick={this.toggleMenu}>
          {label}
          <Icon className={styles.caret} name={isOpen ? 'caret-up' : 'caret-down'} />
        </span>
        {isOpen && (
          <div className={styles.options}>
            {React.Children.map(children, child => (
              <div className={styles.option}>{child}</div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default ToggleMenu;
