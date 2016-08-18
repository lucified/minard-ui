import * as moment from 'moment';
import * as React from 'react';
import * as Icon from 'react-fontawesome';

import { Activity } from '../../../modules/activities';
import { Branch } from '../../../modules/branches';
import { Commit } from '../../../modules/commits';
import { Deployment } from '../../../modules/deployments';
import { FetchError, isError } from '../../../modules/errors';
import { Project } from '../../../modules/projects';

import MinardLink from '../minard-link';
import SingleCommit from '../single-commit';

const styles = require('./deployment-activity.scss');

interface Props {
  activity: Activity;
  branch: Branch;
  showProjectName: boolean;
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

const DeploymentActivity = (props: Props) => {
  const { activity, branch, commit, deployment, showProjectName, project } = props;

  return (
    <div className={styles.activity}>
      <div className={styles['deployment-metadata']}>
        <div className={styles.action}>
          <Icon className={styles['preview-icon']} name="eye" />
          <span>
            <span className={styles['deployment-metadata-author']}>
              {deployment.creator.name || deployment.creator.email}
            </span>
            {` generated a preview in `}
            <MinardLink className={styles['deployment-metadata-branch']} branch={branch}>
              {branch.name}
            </MinardLink>
          </span>
          {showProjectName && getProjectLabel(project)}
        </div>
        <div className={styles.share}>
          Share
        </div>
      </div>
      <MinardLink deployment={deployment}>
        <SingleCommit commit={commit} />
      </MinardLink>
    </div>
  );
};

export default DeploymentActivity;
