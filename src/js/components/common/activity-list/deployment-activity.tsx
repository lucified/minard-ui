import * as classNames from 'classnames';
import * as React from 'react';
import * as Icon from 'react-fontawesome';

import { Activity } from '../../../modules/activities';
import { isSuccessful } from '../../../modules/deployments';

import MinardLink from '../minard-link';
import SingleCommit from '../single-commit';

const styles = require('./activity.scss');

interface Props {
  activity: Activity;
  showProjectName?: boolean;
}

const getProjectLabel = ({ project }: Activity) => {
  return (
    <span>
      {' in '}
      <MinardLink className={styles['deployment-metadata-project']} project={project.id}>
        {project.name}
      </MinardLink>
    </span>
  );
};

const getMetadata = (activity: Activity) => {
  const { deployment, branch, project } = activity;

  if (isSuccessful(deployment)) {
    return (
      <span>
        <span className={styles['deployment-metadata-author']}>
          {deployment.creator.name || deployment.creator.email}
        </span>
        {` generated a preview in `}
        <MinardLink className={styles['deployment-metadata-branch']} branch={branch.id} project={project.id} >
          {branch.name}
        </MinardLink>
      </span>
    );
  }

  return (
    <span>
      {`Preview generation failed in `}
      <MinardLink className={styles['deployment-metadata-branch']} branch={branch.id} project={project.id} >
        {branch.name}
      </MinardLink>
    </span>
  );
};

const getMetadataIcon = ({ deployment }: Activity) => {
  if (isSuccessful(deployment)) {
    return <Icon className={styles.icon} name="eye" />;
  }

  return <Icon className={styles.icon} name="times" />;
};

const DeploymentActivity = (props: Props) => {
  const { activity, showProjectName } = props;

  return (
    <div className={styles.activity}>
      <div className={styles['deployment-metadata']}>
        <div className={styles.action}>
          {getMetadataIcon(activity)}
          {getMetadata(activity)}
          {showProjectName && getProjectLabel(activity)}
        </div>
        <div className={styles.share}>
          {/* TODO: add share link */}
        </div>
      </div>
      <MinardLink openInNewWindow deployment={activity.deployment}>
        <SingleCommit
          className={classNames({ [styles.hover]: isSuccessful(activity.deployment) })}
          commit={activity.commit}
        />
      </MinardLink>
    </div>
  );
};

export default DeploymentActivity;
