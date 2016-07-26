import * as classNames from 'classnames';
import * as React from 'react';
import { connect } from 'react-redux';

import { Activity } from '../modules/activity';
import branches, { Branch } from '../modules/branches';
import { StateTree } from '../reducers';

import SingleActivity from './single-activity';

const styles = require('../../scss/activity-group.scss');
const screenshot = require('../../images/screenshot.png');

interface PassedProps {
  activities: Activity[];
}

interface GeneratedProps {
  branch: Branch;
}

class ActivityGroup extends React.Component<PassedProps & GeneratedProps, any> {
  public render() {
    const { activities, branch } = this.props;

    return (
      <div className={classNames('columns', styles.activityGroup)}>
        <div className={classNames('column', 'col-3', styles.activityScreenshot)}>
          <img src={screenshot} className="img-responsive" />
        </div>
        <div className={classNames('column', 'col-9', styles.activityContent)}>
          {activities.map(activity =>
            <SingleActivity activity={activity} branch={branch} key={activity.id} />)}
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state: StateTree, ownProps: PassedProps) => ({
  branch: branches.selectors.getBranch(state, ownProps.activities[0].branch),
});

export default connect<GeneratedProps, {}, PassedProps>(mapStateToProps)(ActivityGroup);
