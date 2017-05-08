import * as React from 'react';
import { Link } from 'react-router';

import { Branch } from '../../modules/branches';
import { Comment } from '../../modules/comments';
import { Commit } from '../../modules/commits';
import { Deployment } from '../../modules/deployments';
import { Project } from '../../modules/projects';

interface Props {
  rawDeployment?: {
    deployment: Deployment;
  };
  deployment?: {
    deployment: Deployment;
    commit?: Commit;
    buildLog?: boolean;
  };
  comment?: {
    comment: Comment;
    commit: Commit;
  };
  branch?: {
    branch: Branch | string;
    project?: string;
  };
  project?: {
    project: Project | string;
  };
  homepage?: boolean;
  /* showAll can be used for project or homepage. */
  showAll?: boolean;
  openInNewWindow?: boolean;
  className?: string;
}

class MinardLink extends React.Component<Props, void> {
  public render() {
    const {
      branch,
      children,
      className,
      comment,
      deployment,
      homepage,
      openInNewWindow,
      project,
      rawDeployment,
      showAll,
    } = this.props;
    const target = openInNewWindow ? '_blank' : undefined;
    let path: string;

    if (rawDeployment) {
      path = rawDeployment.deployment.url || '';

      if (path) {
        return (
          <a className={className} href={path} target={target}>
            {children}
          </a>
        );
      }

      return (
        <span className={className}>{children}</span>
      );
    } else if (deployment) {
      const { commit, buildLog } = deployment;
      if (!commit || !deployment.deployment) {
        console.error('Missing commit information for preview link!', deployment);
        return <span className={className}>{children}</span>;
      }

      // Link to build log if preview is not ready
      path = (deployment.deployment.url && !buildLog) ?
        `/preview/${commit.hash}/${deployment.deployment.id}` :
        `/preview/${commit.hash}/${deployment.deployment.id}/log`;
    } else if (comment) {
      const { commit } = comment;
      if (!commit) {
        console.error('Missing commit information for comment link!', comment);
        return <span className={className}>{children}</span>;
      }

      path = `/preview/${commit.hash}/${comment.comment.deployment}/comment/${comment.comment.id}`;
    } else if (branch) {
      let projectId: string;
      let branchId: string;

      if (typeof branch.branch === 'string') {
        branchId = branch.branch;
        projectId = branch.project as string;
      } else {
        branchId = branch.branch.id;
        projectId = branch.branch.project;
      }

      path = `/project/${projectId}/branch/${branchId}`;
    } else if (project) {
      let projectId: string;

      if (typeof project.project === 'string') {
        projectId = project.project as string;
      } else {
        projectId = project.project.id;
      }

      if (showAll) {
        path = `/project/${projectId}/all`;
      } else {
        path = `/project/${projectId}`;
      }
    } else if (homepage) {
      if (showAll) {
        path = '/projects/all';
      } else {
        path = '/projects';
      }
    } else {
      return <span className={className}>{children}</span>;
    }

    return (
      <Link className={className} target={target} to={path}>
        {children}
      </Link>
    );
  }
}

export default MinardLink;
