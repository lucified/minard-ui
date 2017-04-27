import * as classNames from 'classnames';
import * as React from 'react';
import * as ReactCSSTransitionGroup from 'react-addons-css-transition-group';
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
    this.closeMenuIfClickedAnywhere = this.closeMenuIfClickedAnywhere.bind(this);
    this.storeTitleRef = this.storeTitleRef.bind(this);
  }

  private titleRef: HTMLElement;

  public componentWillUnmount() {
    if (this.state.isOpen) {
      window.removeEventListener('click', this.closeMenuIfClickedAnywhere, false);
    }
  }

  private closeMenuIfClickedAnywhere(e: MouseEvent) {
    if (this.state.isOpen && !this.titleRef.contains(e.target as any)) {
      this.toggleMenu();
    }
  }

  private toggleMenu() {
    if (this.state.isOpen) {
      window.removeEventListener('click', this.closeMenuIfClickedAnywhere, false);
      this.setState({ isOpen: false });
    } else {
      window.addEventListener('click', this.closeMenuIfClickedAnywhere, false);
      this.setState({ isOpen: true });
    }
  }

  private storeTitleRef(ref: HTMLElement) {
    this.titleRef = ref;
  }

  public render() {
    const { isOpen } = this.state;
    const { label, className, children } = this.props;

    return (
      <div className={classNames(styles.menu, className)}>
        <span className={styles.link} onClick={this.toggleMenu} ref={this.storeTitleRef}>
          {label}
          <Icon className={classNames(styles.caret, { [styles.rotate]: isOpen })} name={'caret-down'} />
        </span>
        <ReactCSSTransitionGroup
          transitionName="options"
          transitionEnterTimeout={150}
          transitionLeaveTimeout={150}
        >
          {isOpen && (
            <div key="dropdown-options" className={styles.options}>
              {React.Children.map(children, child => (
                <div className={styles.option}>{child}</div>
              ))}
            </div>
          )}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

export default ToggleMenu;
