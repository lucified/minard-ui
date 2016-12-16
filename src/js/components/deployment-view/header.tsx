import * as classNames from 'classnames';
import * as React from 'react';
import * as Icon from 'react-fontawesome';

import { Commit } from '../../modules/commits';
import { Deployment } from '../../modules/deployments';

import MinardLink from '../common/minard-link';

const styles = require('./header.scss');

interface Props {
  buildLogSelected: boolean;
  deployment: Deployment;
  commit: Commit;
  onToggleOpen: (e: React.MouseEvent<HTMLElement>) => void;
  isOpen: boolean;
  className?: string;
  authenticatedUser: boolean;
}

const Header = (
  { authenticatedUser, buildLogSelected, className, commit, deployment, isOpen, onToggleOpen }: Props,
) => (
  <div className={classNames(styles.header, className)}>
    {buildLogSelected ? (
      <span>
        {deployment.url ? (
          <MinardLink preview={deployment} commit={commit} className={styles.tab}>
            Preview
          </MinardLink>
        ) : (
          <span className={classNames(styles.tab, styles.disabled)}>
            Preview
          </span>
        )}
        {isOpen ? (
          <span className={classNames(styles.tab, styles.selected)}>
            Build log
          </span>
        ) : (
          <a className={classNames(styles.tab, styles.selected)} onClick={onToggleOpen}>
            Build log
          </a>
        )}
      </span>
    ) : (
      <span>
        {isOpen ? (
          <span className={classNames(styles.tab, styles.selected)}>
            Preview
          </span>
        ) : (
          <a className={classNames(styles.tab, styles.selected)} onClick={onToggleOpen}>
            Preview
          </a>
        )}
        {authenticatedUser && (
          <MinardLink preview={deployment} commit={commit} buildLog className={styles.tab}>
            Build log
          </MinardLink>
        )}
      </span>
    )}
    <span className={styles['comment-count']}>
      <a onClick={onToggleOpen}>
        {deployment.commentCount !== undefined && deployment.commentCount > 0 && deployment.commentCount}
        <Icon className={styles.icon} name="comment-o" />
      </a>
    </span>
    <a className={styles['toggle-open']} onClick={onToggleOpen}>
      {isOpen ? (
        <span className={styles.close}><Icon name="times" className={styles.icon} /> Close</span>
      ) : (
        <span className={styles.open}><Icon name="plus" className={styles.icon} /> Open</span>
      )}
    </a>
  </div>
);

export default Header;
