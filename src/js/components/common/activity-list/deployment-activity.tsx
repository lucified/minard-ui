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
  const { activity: { deployment, commit } } = props;

  return (
    <MinardLink deployment={{ deployment, commit }}>
      <SingleCommit
        className={classNames({ [styles.hover]: isSuccessful(deployment) })}
        commit={commit}
      />
    </MinardLink>
  );
};

export default DeploymentActivity;
