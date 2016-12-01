import * as classNames from 'classnames';
import * as React from 'react';
import * as Icon from 'react-fontawesome';

const styles = require('./header.scss');

interface Props {
  onToggleOpen: (e: any) => boolean;
  isOpen: boolean;
  className?: string;
}

const Header = ({ className, isOpen, onToggleOpen }: Props) => (
  <div className={classNames(styles.header, className)}>
    <a className={styles['toggle-open']} onClick={onToggleOpen}>
      {isOpen ? (
        <span><Icon name="times" className={styles.icon} /> Close</span>
      ) : (
        <span><Icon name="plus" className={styles.icon} /> Open</span>
      )}
    </a>
  </div>
);

export default Header;
