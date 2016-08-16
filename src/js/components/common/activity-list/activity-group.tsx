import * as classNames from 'classnames';
import * as moment from 'moment';
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

  return (
    <div className={classNames('columns', styles['activity-group'])}>
      <div className={classNames('column', 'col-1', styles.timestamp)}>
        {moment(activities[0].timestamp).fromNow()}
      </div>
      <div className={classNames('column', 'col-2', styles.screenshot)}>
        <MinardLink deployment={deployment} openInNewWindow>
          <img src={screenshot} className="img-responsive" />
        </MinardLink>
      </div>
      <div className={classNames('column', 'col-9', styles['activity-content'])}>
        <div>
          <SingleActivity
            activity={activities[0]}
            deployment={deployment}
            commit={commit}
            branch={branch}
            project={project}
            showProjectName={showProjectName}
          />
        </div>
        {activities.slice(1).map(activity =>
          <div key={activity.id}>
            <hr className={styles.line} />
            <SingleActivity
              activity={activity}
              deployment={deployment}
              commit={commit}
              branch={branch}
              project={project}
              showProjectName={showProjectName}
            />
          </div>
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
  let project: Project | FetchError | undefined;
  let commit: Commit | FetchError | undefined;

  if (branch && !isError(branch)) {
    project = Projects.selectors.getProject(state, branch.project);
  }

  if (deployment && !isError(deployment)) {
    commit = Commits.selectors.getCommit(state, deployment.commit);
  }

  return {
    deployment,
    branch,
    commit,
    project,
  };
};

export default connect<GeneratedProps, {}, PassedProps>(mapStateToProps)(ActivityGroup);
