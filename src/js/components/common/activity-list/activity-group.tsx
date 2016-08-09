import * as classNames from 'classnames';
import * as React from 'react';
import { connect } from 'react-redux';

import { Activity } from '../../../modules/activities';
import Branches, { Branch } from '../../../modules/branches';
import Commits, { Commit } from '../../../modules/commits';
import Deployments, { Deployment } from '../../../modules/deployments';
import { FetchError, isError } from '../../../modules/errors';
import Projects, { Project } from '../../../modules/projects';
import { StateTree } from '../../../reducers';

import MinardLink from '../minard-link';
import SingleActivity from './single-activity';

const styles = require('./activity-group.scss');
const screenshot = require('../../../../images/screenshot.png');

interface PassedProps {
  activities: Activity[];
  showProjectName: boolean;
}

interface GeneratedProps {
  branch?: Branch | FetchError;
  deployment?: Deployment | FetchError;
  project?: Project | FetchError;
  commit?: Commit | FetchError;
}

const getLoadingContent = () => (
  <div><h3>Loading...</h3></div>
);

const getErrorContent = (branch: FetchError) => (
  <div>
    <h1>Oh no, errors. :(</h1>
    <p>{branch.prettyError}</p>
  </div>
);

const ActivityGroup = (props: PassedProps & GeneratedProps) => {
  const { activities, branch, commit, deployment, project, showProjectName } = props;

  if (!deployment || !project || !branch) {
    return getLoadingContent();
  }

  if (isError(branch)) {
    return getErrorContent(branch);
  }

  if (isError(deployment)) {
    return getErrorContent(deployment);
  }

  // Seems this is needed due to a bug in TypeScript?
  let realBranch = branch;

  return (
    <div className={classNames('columns', styles.activityGroup)}>
      <div className={classNames('column', 'col-3', styles.activityScreenshot)}>
        <MinardLink deployment={deployment}><img src={screenshot} className="img-responsive" /></MinardLink>
      </div>
      <div className={classNames('column', 'col-9', styles.activityContent)}>
        {activities.map(activity =>
          <SingleActivity
            activity={activity}
            deployment={deployment}
            commit={commit}
            branch={realBranch}
            key={activity.id}
            project={project}
            showProjectName={showProjectName}
          />
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state: StateTree, ownProps: PassedProps): GeneratedProps => {
  const activity = ownProps.activities[0];

  if (!activity) {
    return {};
  }

  const deployment = Deployments.selectors.getDeployment(state, activity.deployment);
  const branch = Branches.selectors.getBranch(state, activity.branch);
  let project: Project | FetchError;
  let commit: Commit | FetchError;

  if (branch && !isError(branch)) {
    project = Projects.selectors.getProject(state, branch.project);
  }

  if (deployment && !isError(deployment)) {
    commit = Commits.selectors.getCommit(state, deployment.commit);
  }

  return {
    project,
    deployment,
    commit,
    branch,
  };
};

export default connect<GeneratedProps, {}, PassedProps>(mapStateToProps)(ActivityGroup);
