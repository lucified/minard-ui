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

import LoadingIcon from '../loading-icon';
import MinardLink from '../minard-link';
import SingleActivity from './single-activity';

const styles = require('./activity-group.scss');
const noScreenshot = require('../../../../images/no-screenshot.png');

interface PassedProps {
  activities: Activity[];
  showProjectName?: boolean;
}

interface GeneratedProps {
  branch?: Branch | FetchError;
  deployment?: Deployment | FetchError;
  project?: Project | FetchError;
  commit?: Commit | FetchError;
}

const getLoadingContent = () => (
  <div className={styles.loading}>
    Loading...
  </div>
);

const getErrorContent = (branch: FetchError) => (
  <div className={styles.error}>
    <h2>Unable to load activity</h2>
    <p>Refresh to retry</p>
    <small>{branch.prettyError}</small>
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
    <div className={classNames('row', styles['activity-group'])}>
      <div className={classNames('col-xs-1', styles.timestamp)}>
        {moment(activities[0].timestamp).fromNow()}
      </div>
      <div className={classNames('col-xs-2', styles.screenshot)}>
        {(deployment.status === 'success') && (
          <MinardLink deployment={deployment} openInNewWindow>
            <img src={deployment.screenshot || noScreenshot} className={styles.image} />
          </MinardLink>
        )}
      </div>
      <div className={classNames('col-xs-9', styles['activity-content'])}>
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

export const LoadingActivityGroup = () => (
  <div className={classNames('row', 'middle-xs', 'between-xs', styles['activity-group'], styles.loading)}>
    <div className={classNames('col-xs-12')}>
      <LoadingIcon center />
    </div>
  </div>
);
