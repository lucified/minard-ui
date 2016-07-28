import * as classNames from 'classnames';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as React from 'react';
import * as Icon from 'react-fontawesome';
import * as Gravatar from 'react-gravatar';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import branches from '../../modules/branches';
import commits, { Commit } from '../../modules/commits';
import { Project } from '../../modules/projects';
import { StateTree } from '../../reducers';

import ScreenshotPile from '../common/screenshot-pile';

const styles = require('../../../scss/project-summary.scss');

interface PassedProps {
  project: Project;
}

interface GeneratedProps {
  projectCommits: Commit[];
  latestDeployedCommit: Commit;
}

const ProjectSummary = ({ project, projectCommits, latestDeployedCommit }: PassedProps & GeneratedProps) => (
  <div className="columns">
    <div className={classNames('column', 'col-3', styles.screenshot)}>
      <Link to={`/project/${project.id}`}>
        <ScreenshotPile commits={projectCommits} />
      </Link>
    </div>
    <div className="column col-9">
      <Link to={`/project/${project.id}`}>
        <h3 className={styles.title}>{project.name}</h3>
        <p>{project.description}</p>
      </Link>
      <div className="flex">
        <div className={styles.activeUsers}>
          {project.activeUsers.map(user => // TODO: have an upper range for this
            <figure key={`avatar-${user}`} className={classNames('avatar', styles.avatar)}>
              <Gravatar email={user} />
            </figure>
          )}
        </div>
        {latestDeployedCommit && (
          <div className={styles.latestActivity}>
            {latestDeployedCommit.author} deployed a new preview {moment(latestDeployedCommit.timestamp).fromNow()}
            <br />
            <Link to={`/project/${project.id}/${latestDeployedCommit.branchId}/${latestDeployedCommit.hash}`}>
              Open latest preview <Icon name="external-link" />
            </Link>
          </div>
        )}
      </div>
    </div>
  </div>
);

const mapStateToProps = (state: StateTree, ownProps: PassedProps) => {
  // TODO: Make this more efficient
  const projectCommits = _.flatMap(ownProps.project.branches, branchId =>
    branches.selectors.getBranch(state, branchId).commits.map(commitId =>
      commits.selectors.getCommit(state, commitId)
    )
  );
  const latestDeployedCommit = _.maxBy(
    projectCommits.filter(commit => commit.hasDeployment),
    commit => commit.timestamp
  );

  return {
    projectCommits,
    latestDeployedCommit,
  };
};

export default connect<GeneratedProps, {}, PassedProps>(mapStateToProps)(ProjectSummary);
