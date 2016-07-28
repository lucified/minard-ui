import * as classNames from 'classnames';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as React from 'react';
import * as Icon from 'react-fontawesome';
import * as Gravatar from 'react-gravatar';
import { connect } from 'react-redux';

import branches from '../../modules/branches';
import commits, { Commit } from '../../modules/commits';
import { Project } from '../../modules/projects';
import { StateTree } from '../../reducers';

import MinardLink from '../common/minard-link';
import ScreenshotPile from '../common/screenshot-pile';

const styles = require('./project-summary.scss');

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
      <MinardLink project={project}>
        <ScreenshotPile commits={projectCommits} />
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
        {latestDeployedCommit && (
          <div className={styles.latestActivity}>
            {latestDeployedCommit.author} deployed a new preview {moment(latestDeployedCommit.timestamp).fromNow()}
            <br />
            <MinardLink openInNewWindow commit={latestDeployedCommit}>
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
