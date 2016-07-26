import * as moment from 'moment';
import * as React from 'react';
import { Link } from 'react-router';

import { Activity, ActivityType } from '../modules/activity';
import { Branch } from '../modules/branches';

const styles = require('../../scss/single-activity.scss');
const avatar = require('../../images/avatar.png');

interface Props {
  activity: Activity;
  branch: Branch;
}

class SingleActivity extends React.Component<Props, any> {
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

  public render() {
    const { activity, branch } = this.props;

    return (
      <div className={styles.activity}>
        <div className={styles.metadata}>
          <div className={styles.action}>
            {`${activity.author} ${this.getAction(activity)} `}
            <Link to="#">{activity.deployment}</Link> in {branch.name}
          </div>
          <div className={styles.timestamp}>
            {moment(activity.timestamp).fromNow()}
          </div>
        </div>
        <div className="columns">
          <div className="column col-1">
            <figure className="avatar avatar-lg">
              <img src={avatar} />
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

export default SingleActivity;
