import * as moment from 'moment';
import * as React from 'react';
import * as Icon from 'react-fontawesome';

import { Activity } from '../../../modules/activities';
import { Branch } from '../../../modules/branches';
import { Commit } from '../../../modules/commits';
import { Deployment } from '../../../modules/deployments';
import { FetchError, isError } from '../../../modules/errors';
import { Project } from '../../../modules/projects';

import Avatar from '../avatar';
import MinardLink from '../minard-link';

const styles = require('./deployment-activity.scss');

interface Props {
  activity: Activity;
  branch: Branch;
  showProjectName: boolean;
  deployment: Deployment;
  project: Project | FetchError;
  commit?: Commit | FetchError;
}

const getCommitMetadata = (activity: Activity, commit?: Commit | FetchError): JSX.Element => {
  if (!commit || isError(commit)) {
    return null;
  }

  const { author } = commit;

  return (
    <span>
      <span className={styles.author}>{author.name || author.email}</span>
      {' · '}
      <span className={styles.timestamp}>{moment(author.timestamp).fromNow()}</span>
      {' · '}
      <span className={styles.hash}>{commit.hash.slice(0, 8)}</span>
    </span>
  );
};

const getCommitBody = (activity: Activity, commit?: Commit | FetchError): JSX.Element => {
  if (!commit) {
    return <span>'Loading...'</span>;
  }

  if (isError(commit)) {
    return <span>`Error: ${commit.prettyError}`</span>;
  }

  return <span className={styles.commit}>{commit.message}</span>;
};

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
  const { creator } = deployment;

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
        <div className={styles['activity-content']}>
          <div className={styles.avatar}>
            <Avatar title={creator.name || creator.email} size="40" email={creator.email} />
          </div>
          <div>
            <div className={styles['activity-metadata']}>
              {getCommitMetadata(activity, commit)}
            </div>
            <div className={styles['activity-body']}>
              {getCommitBody(activity, commit)}
            </div>
          </div>
        </div>
      </MinardLink>
    </div>
  );
};

export default DeploymentActivity;
