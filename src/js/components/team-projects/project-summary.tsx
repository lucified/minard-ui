import * as classNames from 'classnames';
import { compact, flatMap, maxBy } from 'lodash';
import * as moment from 'moment';
import * as React from 'react';
import * as Icon from 'react-fontawesome';
import * as Gravatar from 'react-gravatar';
import { connect } from 'react-redux';

import Branches from '../../modules/branches';
import Deployments, { Deployment } from '../../modules/deployments';
import { FetchError, isError } from '../../modules/errors';
import { Project } from '../../modules/projects';
import { StateTree } from '../../reducers';

import MinardLink from '../common/minard-link';
import ScreenshotPile from '../common/screenshot-pile';

const styles = require('./project-summary.scss');

interface PassedProps {
  project: Project | FetchError;
}

interface GeneratedProps {
  deployments?: (Deployment | FetchError | undefined)[];
  latestDeployment?: Deployment;
}

const ProjectSummary = ({ project, deployments, latestDeployment }: PassedProps & GeneratedProps) => {
  if (isError(project)) {
    return (
      <div key={project.id!} className="empty">
        <Icon name="exclamation" fixedWidth size="3x" />
        <p className="empty-title">Error fetching project</p>
        <p className="empty-meta">{project.prettyError}</p>
      </div>
    );
  }

  return (
    <div className="columns">
      <div className={classNames('column', 'col-3', styles.screenshot)}>
        <MinardLink project={project}>
          <ScreenshotPile deployments={deployments!} />
        </MinardLink>
      </div>
      <div className="column col-9">
        <MinardLink project={project}>
          <h3 className={styles.title}>{project.name}</h3>
          <p>{project.description}</p>
        </MinardLink>
        <div className="flex">
          <div className={styles.activeUsers}>
            {project.activeUsers.map(user => // TODO: have an upper range for this
              <figure
                key={`avatar-${user.email}`}
                title={user.name || user.email}
                className={classNames('avatar', styles.avatar)}
              >
                <Gravatar rating="pg" email={user.email} https />
              </figure>
            )}
          </div>
          {latestDeployment && (
            <div className={styles.latestActivity}>
              {latestDeployment.creator.name ? latestDeployment.creator.name : latestDeployment.creator.email} deployed
              a new preview {moment(latestDeployment.creator.timestamp).fromNow()}
              <br />
              <MinardLink openInNewWindow deployment={latestDeployment}>
                Open latest preview <Icon name="external-link" />
              </MinardLink>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: StateTree, ownProps: PassedProps): GeneratedProps => {
  const { project } = ownProps;

  if (isError(project)) {
    return {};
  }

  // TODO: Make this more efficient
  const deployments = flatMap<Deployment | FetchError | undefined>(project.branches, branchId => {
    const branch = Branches.selectors.getBranch(state, branchId);

    if (!branch || isError(branch)) {
      return undefined;
    }

    return branch.deployments.map(deploymentId => Deployments.selectors.getDeployment(state, deploymentId));
  });

  let latestDeployment: Deployment | undefined;
  const loadedDeployments = compact(
    deployments.map(deploymentOrError => isError(deploymentOrError) ? undefined : deploymentOrError)
  ) as Deployment[];
  if (loadedDeployments.length > 0) {
    latestDeployment = maxBy(loadedDeployments, deployment => deployment.creator.timestamp);
  }

  return {
    deployments,
    latestDeployment,
  };
};

export default connect<GeneratedProps, {}, PassedProps>(mapStateToProps)(ProjectSummary);
