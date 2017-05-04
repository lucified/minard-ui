import * as React from 'react';
import Icon = require('react-fontawesome');
import { connect } from 'react-redux';
import TimeAgo from 'react-timeago';
import * as Truncate from 'react-truncate';

import Commits, { Commit } from '../../modules/commits';
import Deployments, { Deployment } from '../../modules/deployments';
import { FetchError, isFetchError } from '../../modules/errors';
import { Project } from '../../modules/projects';
import { StateTree } from '../../reducers';

import Avatar from '../common/avatar';
import MinardLink from '../common/minard-link';

const styles = require('./project-card.scss');

interface PassedProps {
  project: Project;
}

interface GeneratedProps {
  latestDeployment?: Deployment;
  latestDeployedCommit?: Commit;
}

const getBottom = (project: Project, deployment?: Deployment) => {
  return (
    <div className={styles.links}>
      {deployment && (
        <div className={styles.link}>
          <Icon className={styles.icon} name="eye" />
          <span className={styles['link-text']}>
            Latest preview
          </span>
        </div>
      )}
      <div className={styles.link}>
        <MinardLink project={project}>
          <Icon className={styles.icon} name="chevron-right" />
          <span className={styles['link-text']}>
            Open project
          </span>
        </MinardLink>
      </div>
    </div>
  );
};

const ProjectCard = ({ project, latestDeployment }: PassedProps & GeneratedProps) => {
  const screenshot = (latestDeployment && latestDeployment.screenshot);
  const bottom = getBottom(project, latestDeployment);
  const maxAvatarCount = 8;

  return (
    <div className={styles.card}>
        <div className={styles['card-top']}>
          {screenshot ? (
            <img src={screenshot} className={styles.screenshot} />
          ) : (
            <div className={styles['no-screenshot']}>
              <div className={styles['no-screenshot-inner']}>
                No screenshot is available
                for this project
              </div>
            </div>
          )}
        </div>
        <div className={styles['card-middle']}>
          <div className={styles.avatars}>
            {project.activeUsers.slice(0, maxAvatarCount).map(user => (
              <Avatar
                key={`avatar-${user.email}`}
                className={styles.avatar}
                title={user.name || user.email}
                email={user.email}
                shadow
              />
            ))}
          </div>
          <MinardLink project={project}>
            <h3 className={styles.title}>{project.name}</h3>
          </MinardLink>
          { latestDeployment ? (
            <div className={styles['time-ago']}>
              <TimeAgo minPeriod={10} date={latestDeployment.creator.timestamp} />
            </div>
          ) : (
            <div className={styles['no-previews-yet']}>
              No previews yet
            </div>
          )}
          { project.description && (
            <div className={styles.description}>
              <Truncate lines={1}>
                {project.description}
              </Truncate>
            </div>
          )}
        </div>
        <div className={styles['card-bottom']}>
          <div className={styles['card-bottom-inner']}>
            {bottom}
          </div>
        </div>
    </div>
  );
};

const mapStateToProps = (state: StateTree, ownProps: PassedProps): GeneratedProps => {
  const { project } = ownProps;
  const latestSuccessfullyDeployedCommitId = project.latestSuccessfullyDeployedCommit;
  const latestDeployedCommit = latestSuccessfullyDeployedCommitId ?
    Commits.selectors.getCommit(state, latestSuccessfullyDeployedCommitId) : undefined;
  let latestDeployment: Deployment | FetchError | undefined;

  if (latestDeployedCommit && !isFetchError(latestDeployedCommit) && latestDeployedCommit.deployment) {
    latestDeployment = Deployments.selectors.getDeployment(state, latestDeployedCommit.deployment);
  }

  // TODO: Don't convert error state to loading state?
  return {
    latestDeployment: isFetchError(latestDeployment) ? undefined : latestDeployment,
    latestDeployedCommit: isFetchError(latestDeployedCommit) ? undefined : latestDeployedCommit,
  };
};

export default connect<GeneratedProps, {}, PassedProps>(mapStateToProps)(ProjectCard);
