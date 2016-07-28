import * as moment from 'moment';
import * as React from 'react';
import * as Gravatar from 'react-gravatar';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { Activity, ActivityType } from '../../../modules/activity';
import { Branch } from '../../../modules/branches';
import projects, { Project } from '../../../modules/projects';
import { StateTree } from '../../../reducers';

import MinardLink from '../minard-link';

const styles = require('../../../../scss/single-activity.scss');

interface PassedProps {
  activity: Activity;
  branch: Branch;
  showProjectName: boolean;
}

interface GeneratedProps {
  project: Project;
}

class SingleActivity extends React.Component<PassedProps & GeneratedProps, any> {
  private getAction(activity: Activity) {
    switch (activity.type) {
      case ActivityType.Comment:
        return 'commented on';
      case ActivityType.Deployment:
        return 'generated preview';
      default:
        return 'did an unknown action';
    }
  }

  private getActivityBody(activity: Activity) {
    switch (activity.type) {
      case ActivityType.Comment:
        return activity.comment;
      case ActivityType.Deployment:
        return activity.commitMessage;
      default:
        return 'Unknown action type';
    }
  }

  private getBranchAction(activity: Activity, branch: Branch) {
    return (
      <span>
        {`${activity.author} ${this.getAction(activity)} `}
        <Link to="#">{activity.deployment}</Link>
        {' in '}
        <MinardLink branch={branch}>{branch.name}</MinardLink>
      </span>
    );
  }

  private getProjectLabel(project: Project) {
    return (
      <span> in <MinardLink project={project}>{project.name}</MinardLink></span>
    );
  }

  public render() {
    const { activity, branch, showProjectName, project } = this.props;

    return (
      <div className={styles.activity}>
        <div className={styles.metadata}>
          <div className={styles.action}>
            {this.getBranchAction(activity, branch)}
            {showProjectName && this.getProjectLabel(project)}
          </div>
          <div className={styles.timestamp}>
            {moment(activity.timestamp).fromNow()}
          </div>
        </div>
        <div className="columns">
          <div className="column col-1">
            <figure className="avatar avatar-lg">
              <Gravatar email={activity.author} https />
            </figure>
          </div>
          <div className="column col-11">
            {this.getActivityBody(activity)}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: StateTree, ownProps: PassedProps) => ({
  project: projects.selectors.getProject(state, ownProps.branch.project),
});

export default connect<GeneratedProps, {}, PassedProps>(mapStateToProps)(SingleActivity);
