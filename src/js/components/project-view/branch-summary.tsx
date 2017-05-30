import * as classNames from 'classnames';
import * as React from 'react';
import { connect } from 'react-redux';
import TimeAgo from 'react-timeago';
import Icon = require('react-fontawesome');

import { Branch } from '../../modules/branches';
import Commits, { Commit } from '../../modules/commits';
import Deployments, { Deployment } from '../../modules/deployments';
import { FetchError, isFetchError } from '../../modules/errors';
import { StateTree } from '../../reducers';
import Avatar from '../common/avatar';

import BuildStatus from '../common/build-status';
import MinardLink from '../common/minard-link';

const styles = require('./branch-summary.scss');

interface PassedProps {
  branch: Branch;
}

interface GeneratedProps {
  latestSuccessfulDeployment?: Deployment | FetchError;
  latestSuccessfullyDeployedCommit?: Commit | FetchError;
  deploymentForLatestCommit?: Deployment | FetchError;
  latestCommit?: Commit | FetchError;
}

type Props = PassedProps & GeneratedProps;

const BranchSummary = (props: Props) => {
  const {
    branch,
    latestSuccessfulDeployment,
    latestSuccessfullyDeployedCommit,
    deploymentForLatestCommit,
    latestCommit,
  } = props;
  let commitContent: JSX.Element | undefined;

  if (latestSuccessfullyDeployedCommit) {
    if (isFetchError(latestSuccessfulDeployment)) {
      commitContent = (
        <div className={styles['commit-content']}>
          <div className={styles.error}>
            <p>Error loading deployment</p>
            <small>{latestSuccessfulDeployment.prettyError}</small>
          </div>
        </div>
      );
    } else if (isFetchError(latestSuccessfullyDeployedCommit)) {
      commitContent = (
        <div className={styles['commit-content']}>
          <div className={styles.error}>
            <p>Error loading commit</p>
            <small>{latestSuccessfullyDeployedCommit.prettyError}</small>
          </div>
        </div>
      );
    } else {
      const { author, committer } = latestSuccessfullyDeployedCommit;
      const otherAuthorEmail = author.email !== committer.email ? committer.email : undefined;
      commitContent = (
        <div className={styles['commit-content']}>
          <div className={styles.avatar}>
            <Avatar title={author.name || author.email} size="sm" email={author.email} iconEmail={otherAuthorEmail} />
          </div>
          <div>
            <div className={styles['commit-metadata']}>
              <span>
                <span className={styles.author}>{author.name || author.email}</span>
                {' · '}
                <span className={styles.timestamp}>
                  <TimeAgo minPeriod={10} date={author.timestamp} />
                </span>
              </span>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className={classNames(styles.branch)}>
      <div className={classNames(styles.main)}>
        <MinardLink branch={{ branch }} className={classNames(styles.content)}>
          <div className={styles.header}>
            <div className={styles.title}>{branch.name}</div>
          </div>
        </MinardLink>
        <BuildStatus
          className={styles['build-status']}
          deployment={isFetchError(deploymentForLatestCommit) ? undefined : deploymentForLatestCommit}
          commit={isFetchError(latestCommit) ? undefined : latestCommit}
          latest={true}
        />
      </div>
      {commitContent}




      <div className={styles.links}>
        {latestSuccessfulDeployment && !isFetchError(latestSuccessfulDeployment) ? (
          <MinardLink preview={{ branch }}>
            <div className={styles.link}>
              <Icon name="eye" />
              <div className={styles['link-text']}>
                Latest preview
              </div>
            </div>
          </MinardLink>
        ) : (
          <div className={classNames(styles.link, styles['link-disabled'])}>
            No preview available
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state: StateTree, ownProps: PassedProps): GeneratedProps => {
  const { branch } = ownProps;

  let latestSuccessfullyDeployedCommit: FetchError | Commit | undefined;

  if (branch.latestSuccessfullyDeployedCommit) {
    latestSuccessfullyDeployedCommit = Commits.selectors.getCommit(state, branch.latestSuccessfullyDeployedCommit);
  }

  let latestSuccessfulDeployment: FetchError | Deployment | undefined;
  if (latestSuccessfullyDeployedCommit &&
    !isFetchError(latestSuccessfullyDeployedCommit) &&
    latestSuccessfullyDeployedCommit.deployment
  ) {
    latestSuccessfulDeployment =
      Deployments.selectors.getDeployment(state, latestSuccessfullyDeployedCommit.deployment);
  }

  let deploymentForLatestCommit: Deployment | FetchError | undefined;
  let latestCommit: Commit | FetchError | undefined;
  if (branch.latestCommit) {
    latestCommit = Commits.selectors.getCommit(state, branch.latestCommit);
    if (latestCommit && !isFetchError(latestCommit) && latestCommit.deployment) {
      deploymentForLatestCommit = Deployments.selectors.getDeployment(state, latestCommit.deployment);
    }
  }

  return {
    latestSuccessfulDeployment,
    latestSuccessfullyDeployedCommit,
    deploymentForLatestCommit,
    latestCommit,
  };
};

export default connect<GeneratedProps, {}, PassedProps>(mapStateToProps)(BranchSummary);
