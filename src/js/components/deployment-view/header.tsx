import * as classNames from 'classnames';
import * as React from 'react';
import Icon = require('react-fontawesome');

import { Deployment } from '../../modules/deployments';
import { EntityType } from '../../modules/previews';

import MinardLink from '../common/minard-link';

const styles = require('./header.scss');

interface Props {
  buildLogSelected: boolean;
  deployment: Deployment;
  onToggleOpen: (e: React.MouseEvent<HTMLElement>) => void;
  isOpen: boolean;
  className?: string;
  isAuthenticatedUser: boolean;
  linkDetails: { entityType: EntityType, id: string, token: string };
}

const Header = ({
  isAuthenticatedUser,
  buildLogSelected,
  className,
  deployment,
  isOpen,
  onToggleOpen,
  linkDetails,
}: Props) =>
  <div className={classNames(styles.header, className)}>
    {buildLogSelected
      ? <span>
          {deployment.url  // tslint:disable:jsx-alignment
            ? <MinardLink
                preview={{
                  [linkDetails.entityType]: {
                    id: linkDetails.id,
                    token: linkDetails.token,
                    url: deployment.url,
                  },
                }}
                className={styles.tab}
              >
                Preview
              </MinardLink>
            : <span className={classNames(styles.tab, styles.disabled)}>
                Preview
              </span>}
          <a
            className={classNames(styles.tab, styles.selected)}
            onClick={onToggleOpen}
          >
            Build log
          </a>
        </span>
      : <span>
          <span
            className={classNames(styles.tab, styles.selected)}
            onClick={onToggleOpen}
          >
            Preview
          </span>
          {isAuthenticatedUser &&
            <MinardLink
              preview={{
                [linkDetails.entityType]: {
                  id: linkDetails.id,
                  token: linkDetails.token,
                  url: deployment.url,
                },
                buildLog: true,
              }}
              className={styles.tab}
            >
              Build log
            </MinardLink>}
        </span>}
    <span className={styles['comment-count']}>
      <a onClick={onToggleOpen}>
        {deployment.commentCount !== undefined &&
          deployment.commentCount > 0 &&
          deployment.commentCount}
        <Icon className={styles.icon} name="comment-o" />
      </a>
    </span>
    <a className={styles['toggle-open']} onClick={onToggleOpen}>
      {isOpen
        ? <span className={styles.close}>
            <Icon name="times" className={styles.icon} /> Close
          </span>
        : <span className={styles.open}>
            <Icon name="plus" className={styles.icon} /> Open
          </span>}
    </a>
  </div>;

export default Header;
