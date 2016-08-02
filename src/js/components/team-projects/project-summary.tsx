import * as classNames from 'classnames';
import { compact, flatMap } from 'lodash';
import * as moment from 'moment';
import * as React from 'react';
import * as Icon from 'react-fontawesome';
import * as Gravatar from 'react-gravatar';
import { connect } from 'react-redux';

import Branches from '../../modules/branches';
import Deployments, { Deployment } from '../../modules/deployments';
import { Project } from '../../modules/projects';
import { StateTree } from '../../reducers';

import MinardLink from '../common/minard-link';
import ScreenshotPile from '../common/screenshot-pile';

const styles = require('./project-summary.scss');

interface PassedProps {
  project: Project;
}

interface GeneratedProps {
  deployments: Deployment[];
  latestDeployment: Deployment;
}

const ProjectSummary = ({ project, deployments, latestDeployment }: PassedProps & GeneratedProps) => (
  <div className="columns">
    <div className={classNames('column', 'col-3', styles.screenshot)}>
      <MinardLink project={project}>
        <ScreenshotPile deployments={deployments} />
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
            <figure key={`avatar-${user}`} className={classNames('avatar', styles.avatar)}>
              <Gravatar email={user} https />
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

const mapStateToProps = (state: StateTree, ownProps: PassedProps) => {
  // TODO: Make this more efficient
  const projectDeployments = flatMap(ownProps.project.branches, branchId => {
    const branch = Branches.selectors.getBranch(state, branchId);

    if (branch) {
      return branch.deployments.map(deploymentId =>
        Deployments.selectors.getDeployment(state, deploymentId)
      );
    }

    return undefined;
  });

  const latestDeployment = compact(projectDeployments).length > 0 && projectDeployments[0];

  return {
    deployments: projectDeployments,
    latestDeployment,
  };
};

export default connect<GeneratedProps, {}, PassedProps>(mapStateToProps)(ProjectSummary);
