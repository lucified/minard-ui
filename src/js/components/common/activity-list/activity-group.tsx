import * as classNames from 'classnames';
import * as React from 'react';
import { connect } from 'react-redux';

import { Activity } from '../../../modules/activities';
import Branches, { Branch } from '../../../modules/branches';
import { FetchError, isError } from '../../../modules/errors';
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
}

const getLoadingContent = () => (
  <div><h1>Loading...</h1></div>
);

const getErrorContent = (branch: FetchError) => (
  <div>
    <h1>Oh no, errors. :(</h1>
    <p>{branch.prettyError}</p>
  </div>
);

const ActivityGroup = ({ activities, branch, showProjectName }: PassedProps & GeneratedProps) => {
  if (!branch) {
    return getLoadingContent();
  }

  if (isError(branch)) {
    return getErrorContent(branch);
  }

  // Seems this is needed due to a bug in TypeScript?
  let realBranch = branch;

  return (
    <div className={classNames('columns', styles.activityGroup)}>
      <div className={classNames('column', 'col-3', styles.activityScreenshot)}>
        <MinardLink><img src={screenshot} className="img-responsive" /></MinardLink>
      </div>
      <div className={classNames('column', 'col-9', styles.activityContent)}>
        {activities.map(activity =>
          <SingleActivity
            activity={activity}
            branch={realBranch}
            key={activity.id}
            showProjectName={showProjectName}
          />
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state: StateTree, ownProps: PassedProps): GeneratedProps => ({
  branch: ownProps.activities[0] && Branches.selectors.getBranch(state, ownProps.activities[0].branch),
});

export default connect<GeneratedProps, {}, PassedProps>(mapStateToProps)(ActivityGroup);
