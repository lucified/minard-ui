import { compact, maxBy } from 'lodash';
import * as moment from 'moment';
import * as React from 'react';
import * as Icon from 'react-fontawesome';
import { connect } from 'react-redux';

import Branches from '../../modules/branches';
import Deployments, { Deployment } from '../../modules/deployments';
import { FetchError, isError } from '../../modules/errors';
import { Project } from '../../modules/projects';
import { StateTree } from '../../reducers';

import Avatar from '../common/avatar';
import MinardLink from '../common/minard-link';

const styles = require('./project-card.scss');
const noScreenshot = require('../../../images/no-screenshot.png');

interface PassedProps {
  project: Project | FetchError;
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
            {moment(creator.timestamp).fromNow()}
          </div>
        </div>
      </div>
      <div className={styles.open}>
        Open <Icon name="external-link" />
      </div>
    </div>
  );
};

const ProjectCard = ({ project, latestDeployment }: PassedProps & GeneratedProps) => {
  if (isError(project)) {
    return (
      <div key={project.id!}>
        <Icon name="exclamation" fixedWidth size="3x" />
        <p>Error fetching project</p>
        <p>{project.prettyError}</p>
      </div>
    );
  }

  const screenshot = (latestDeployment && latestDeployment.screenshot) || noScreenshot;

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
      <MinardLink openInNewWindow deployment={latestDeployment}>
        <div className={styles['card-bottom']}>
          {getDeploymentSummary(latestDeployment)}
        </div>
      </MinardLink>
    </div>
  );
};

const mapStateToProps = (state: StateTree, ownProps: PassedProps): GeneratedProps => {
  const { project } = ownProps;

  if (isError(project)) {
    return {};
  }

  // TODO: Make this more efficient
  const latestDeploymentPerBranch = compact(project.branches.map(branchId => {
    const branch = Branches.selectors.getBranch(state, branchId);

    if (!branch || isError(branch) || !branch.deployments[0]) {
      return undefined;
    }

    const latestDeployment = Deployments.selectors.getDeployment(state, branch.deployments[0]);

    if (isError(latestDeployment)) {
      return undefined;
    }

    return latestDeployment;
  })) as Deployment[];

  let latestDeployment: Deployment | undefined;

  if (latestDeploymentPerBranch.length > 0) {
    latestDeployment = maxBy(latestDeploymentPerBranch, deployment => deployment.creator.timestamp);
  }

  return {
    latestDeployment,
  };
};

export default connect<GeneratedProps, {}, PassedProps>(mapStateToProps)(ProjectCard);
