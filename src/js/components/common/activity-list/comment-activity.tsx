import * as moment from 'moment';
import * as React from 'react';
import * as Icon from 'react-fontawesome';

import { Activity } from '../../../modules/activities';
import { Branch } from '../../../modules/branches';
import { Deployment } from '../../../modules/deployments';
import { FetchError, isFetchError } from '../../../modules/errors';
import { Project } from '../../../modules/projects';

import Avatar from '../avatar';
import MinardLink from '../minard-link';

const styles = require('./comment-activity.scss');

interface Props {
  activity: Activity;
  branch: Branch;
  showProjectName?: boolean;
  deployment: Deployment;
  project: Project | FetchError;
  comment?: any; // TODO
}

const getCommentMetadata = (activity: Activity, comment?: any): JSX.Element | null => {
  if (!comment || isFetchError(comment)) {
    return null;
  }

  const { author } = comment;

  // TODO once we add comments
  return (
    <span>
      <span className={styles.author}>{author.name || author.email}</span>
      {' · '}
      <span className={styles.timestamp}>{moment(author.timestamp).fromNow()}</span>
    </span>
  );
};

const getCommentBody = (activity: Activity, comment?: any): JSX.Element | null => {
  if (!comment) {
    return <span>'Loading...'</span>;
  }

  if (isFetchError(comment)) {
    return <span>`Error: ${comment.prettyError}`</span>;
  }

  return null; // TODO
};

const getProjectLabel = (project?: Project | FetchError) => {
  if (!project || isFetchError(project)) {
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

const CommentActivity = (props: Props) => {
  const { activity, branch, comment, deployment, showProjectName, project } = props;
  const { creator } = deployment;

  return (
    <div className={styles.activity}>
      <div className={styles['deployment-metadata']}>
        <div className={styles.action}>
          <Icon className={styles.icon} name="comment-o" />
          <span>
            <span className={styles['deployment-metadata-author']}>
              {'Foo bar' /* TODO */}
            </span>
            {` commented on a preview in `}
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
      <MinardLink openInNewWindow deployment={deployment}>
        <div className={styles['activity-content']}>
          <div className={styles.avatar}>
            <Avatar title={creator.name || creator.email} size="40" email={creator.email} />
          </div>
          <div>
            <div className={styles['activity-metadata']}>
              {getCommentMetadata(activity, comment)}
            </div>
            <div className={styles['activity-body']}>
              {getCommentBody(activity, comment)}
            </div>
          </div>
        </div>
      </MinardLink>
    </div>
  );
};

export default CommentActivity;
