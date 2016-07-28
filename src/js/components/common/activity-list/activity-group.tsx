import * as classNames from 'classnames';
import * as React from 'react';
import { connect } from 'react-redux';

import { Activity } from '../../../modules/activity';
import branches, { Branch } from '../../../modules/branches';
import { StateTree } from '../../../reducers';

import SingleActivity from './single-activity';

const styles = require('./activity-group.scss');
const screenshot = require('../../../../images/screenshot.png');

interface PassedProps {
  activities: Activity[];
  showProjectName: boolean;
}

interface GeneratedProps {
  branch: Branch;
}

class ActivityGroup extends React.Component<PassedProps & GeneratedProps, any> {
  public render() {
    const { activities, branch, showProjectName } = this.props;

    return (
      <div className={classNames('columns', styles.activityGroup)}>
        <div className={classNames('column', 'col-3', styles.activityScreenshot)}>
          <img src={screenshot} className="img-responsive" />
        </div>
        <div className={classNames('column', 'col-9', styles.activityContent)}>
          {activities.map(activity =>
            <SingleActivity
              activity={activity}
              branch={branch}
              key={activity.id}
              showProjectName={showProjectName}
            />
          )}
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state: StateTree, ownProps: PassedProps) => ({
  branch: branches.selectors.getBranch(state, ownProps.activities[0].branch),
});

export default connect<GeneratedProps, {}, PassedProps>(mapStateToProps)(ActivityGroup);
