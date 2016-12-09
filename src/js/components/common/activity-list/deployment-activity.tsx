import * as classNames from 'classnames';
import * as React from 'react';

import { Activity } from '../../../modules/activities';
import { isSuccessful } from '../../../modules/deployments';

import MinardLink from '../minard-link';
import SingleCommit from '../single-commit';

const styles = require('./activity.scss');

interface Props {
  activity: Activity;
}

const DeploymentActivity = (props: Props) => {
  const { activity } = props;

  return (
    <MinardLink openInNewWindow deployment={activity.deployment}>
      <SingleCommit
        className={classNames({ [styles.hover]: isSuccessful(activity.deployment) })}
        commit={activity.commit}
      />
    </MinardLink>
  );
};

export default DeploymentActivity;
