import * as classNames from 'classnames';
import * as React from 'react';
import * as Icon from 'react-fontawesome';

import { Activity } from '../../../modules/activities';
import { Branch } from '../../../modules/branches';
import { Commit } from '../../../modules/commits';
import { Deployment, isSuccessful } from '../../../modules/deployments';
import { FetchError, isError } from '../../../modules/errors';
import { Project } from '../../../modules/projects';

import MinardLink from '../minard-link';
import SingleCommit from '../single-commit';

const styles = require('./deployment-activity.scss');

interface Props {
  activity: Activity;
  branch: Branch;
  showProjectName?: boolean;
  deployment: Deployment;
  project: Project | FetchError;
  commit?: Commit | FetchError;
}

const getProjectLabel = (project?: Project | FetchError) => {
  if (!project || isError(project)) {
    return null;
  }

  return (
    <span>
      {' in '}
      <MinardLink className={styles['deployment-metadata-project']} project={project}>
        {project.name}
      </MinardLink>
    </span>
  );
};

const getMetadata = (deployment: Deployment, branch: Branch) => {
  if (isSuccessful(deployment)) {
    return (
      <span>
        <span className={styles['deployment-metadata-author']}>
          {deployment.creator.name || deployment.creator.email}
        </span>
        {` generated a preview in `}
        <MinardLink className={styles['deployment-metadata-branch']} branch={branch}>
          {branch.name}
        </MinardLink>
      </span>
    );
  }

  return (
    <span>
      {`Preview generation failed in `}
      <MinardLink className={styles['deployment-metadata-branch']} branch={branch}>
        {branch.name}
      </MinardLink>
    </span>
  );
};

const getMetadataIcon = (deployment: Deployment) => {
  if (isSuccessful(deployment)) {
    return <Icon className={styles.icon} name="eye" />;
  }

  return <Icon className={styles.icon} name="times" />;
};

const DeploymentActivity = (props: Props) => {
  const { activity, branch, commit, deployment, showProjectName, project } = props;

  return (
    <div className={styles.activity}>
      <div className={styles['deployment-metadata']}>
        <div className={styles.action}>
          {getMetadataIcon(deployment)}
          {getMetadata(deployment, branch)}
          {showProjectName && getProjectLabel(project)}
        </div>
        <div className={styles.share}>
          {'' /* TODO: add share link */}
        </div>
      </div>
      <MinardLink deployment={deployment}>
        <SingleCommit className={classNames({ [styles.hover]: isSuccessful(deployment) })} commit={commit} />
      </MinardLink>
    </div>
  );
};

export default DeploymentActivity;
