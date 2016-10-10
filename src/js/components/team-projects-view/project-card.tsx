import * as classNames from 'classnames';
import * as React from 'react';
import * as Icon from 'react-fontawesome';
import { connect } from 'react-redux';
import TimeAgo from 'react-timeago';

import Commits from '../../modules/commits';
import Deployments, { Deployment } from '../../modules/deployments';
import { FetchError, isFetchError } from '../../modules/errors';
import { Project } from '../../modules/projects';
import { StateTree } from '../../reducers';

import Avatar from '../common/avatar';
import MinardLink from '../common/minard-link';

const styles = require('./project-card.scss');
const noScreenshot = require('../../../images/no-screenshot.png');

interface PassedProps {
  project: Project;
}

interface GeneratedProps {
  latestDeployment?: Deployment;
}

const getDeploymentSummary = (deployment?: Deployment) => {
  if (!deployment) {
    return null;
  }

  const { creator } = deployment;

  return (
    <div className={styles.spread}>
      <div className="flex">
        <div className={styles['preview-icon']}>
          <Icon name="eye" />
        </div>
        <div>
          <div className={styles.action}>
            <span className={styles.author}>
              {creator.name || creator.email}
            </span>
            {' '}generated a{' '}
            <span className={styles.target}>
              new preview
            </span>
          </div>
          <div className={styles.timestamp}>
            <TimeAgo minPeriod={10} date={creator.timestamp} />
          </div>
        </div>
      </div>
      <div className={styles.open}>
        Open <Icon className={styles['open-icon']} name="external-link" />
      </div>
    </div>
  );
};

const ProjectCard = ({ project, latestDeployment }: PassedProps & GeneratedProps) => {
  const screenshot = (latestDeployment && latestDeployment.screenshot) || noScreenshot;
  const deploymentSummary = getDeploymentSummary(latestDeployment);

  return (
    <div className={styles.card}>
      <MinardLink project={project}>
        <div className={styles['card-top']}>
          <img src={screenshot} className={styles.screenshot} />
        </div>
        <div className={styles['card-middle']}>
          <div className={styles.avatars}>
            {project.activeUsers.map(user => // TODO: have an upper range for this
              <Avatar
                key={`avatar-${user.email}`}
                className={styles.avatar}
                title={user.name || user.email}
                email={user.email}
                shadow
              />
            )}
          </div>
          <h3 className={styles.title}>{project.name}</h3>
          <p className={styles.description}>{project.description}</p>
        </div>
      </MinardLink>
      {deploymentSummary ? (
        <MinardLink openInNewWindow deployment={latestDeployment}>
          <div className={classNames(styles['card-bottom'], styles['hover-effect'])}>
            {deploymentSummary}
          </div>
        </MinardLink>
      ) : (
        <MinardLink project={project}>
          <div className={styles['card-bottom']} />
        </MinardLink>
      )}
    </div>
  );
};

const mapStateToProps = (state: StateTree, ownProps: PassedProps): GeneratedProps => {
  const { project } = ownProps;

  const latestSuccessfullyDeployedCommitId = project.latestSuccessfullyDeployedCommit;
  const latestDeployedCommit = latestSuccessfullyDeployedCommitId &&
    Commits.selectors.getCommit(state, latestSuccessfullyDeployedCommitId);
  let latestDeployment: Deployment | FetchError | undefined;

  if (latestDeployedCommit && !isFetchError(latestDeployedCommit) && latestDeployedCommit.deployment) {
    latestDeployment = Deployments.selectors.getDeployment(state, latestDeployedCommit.deployment);
  }

  // TODO: Don't convert error state to loading state?
  return {
    latestDeployment: isFetchError(latestDeployment) ? undefined : latestDeployment,
  };
};

export default connect<GeneratedProps, {}, PassedProps>(mapStateToProps)(ProjectCard);
