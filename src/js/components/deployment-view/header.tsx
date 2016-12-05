import * as classNames from 'classnames';
import * as React from 'react';
import * as Icon from 'react-fontawesome';

import { Deployment } from '../../modules/deployments';

import MinardLink from '../common/minard-link';

const styles = require('./header.scss');

interface Props {
  buildLogSelected: boolean;
  deployment: Deployment;
  onToggleOpen: (e: any) => boolean;
  isOpen: boolean;
  className?: string;
}

const Header = ({ buildLogSelected, className, deployment, isOpen, onToggleOpen }: Props) => (
  <div className={classNames(styles.header, className)}>
    {buildLogSelected ? (
      <span>
        {deployment.url ? (
          <MinardLink preview={deployment} className={styles.tab}>
            Preview
          </MinardLink>
        ) : (
          <span className={classNames(styles.tab, styles.disabled)}>
            Preview
          </span>
        )}
        <span className={classNames(styles.tab, styles.selected)}>
          Build log
        </span>
      </span>
    ) : (
      <span>
        <span className={classNames(styles.tab, styles.selected)}>
          Preview
        </span>
        <MinardLink preview={deployment} buildLog className={styles.tab}>
          Build log
        </MinardLink>
      </span>
    )}
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