import * as React from 'react';
import { Link } from 'react-router-dom';

import { Branch } from '../../modules/branches';
import { Comment } from '../../modules/comments';
import { Deployment } from '../../modules/deployments';
import { Project } from '../../modules/projects';

interface Props {
  rawDeployment?: {
    deployment: Deployment;
  };
  preview?: {
    deployment?: Deployment;
    project?: Project;
    branch?: Branch;
    buildLog?: boolean;
  };
  comment?: {
    comment: Comment;
    deployment: Deployment;
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

class MinardLink extends React.Component<Props> {
  public render() {
    const {
      branch,
      children,
      className,
      comment,
      homepage,
      openInNewWindow,
      preview,
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
        <span className={className}>
          {children}
        </span>
      );
    } else if (preview) {
      const {
        deployment,
        project: previewProject,
        branch: previewBranch,
        buildLog,
      } = preview;

      if (previewProject) {
        path = `/preview/project/${previewProject.id}/${previewProject.token}${buildLog
          ? '/log'
          : ''}`;
      } else if (previewBranch) {
        path = `/preview/branch/${previewBranch.id}/${previewBranch.token}${buildLog
          ? '/log'
          : ''}`;
      } else if (deployment) {
        // Link to build log if deployment is not ready
        path =
          deployment.url && !buildLog
            ? `/preview/deployment/${deployment.id}/${deployment.token}`
            : `/preview/deployment/${deployment.id}/${deployment.token}/log`;
      } else {
        console.error('Insufficient data for preview!', preview);
        return (
          <span className={className}>
            {children}
          </span>
        );
      }
    } else if (comment) {
      const { deployment } = comment;
      if (!deployment) {
        console.error(
          'Missing deployment information for comment link!',
          comment,
        );
        return (
          <span className={className}>
            {children}
          </span>
        );
      }

      path = `/preview/deployment/${deployment.id}/${deployment.token}/comment/${comment
        .comment.id}`;
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
      const projectId =
        typeof project.project === 'string'
          ? project.project as string
          : project.project.id;
      path = `/project/${projectId}${showAll ? '/all' : ''}`;
    } else if (homepage) {
      path = `/projects${showAll ? '/all' : ''}`;
    } else {
      return (
        <span className={className}>
          {children}
        </span>
      );
    }

    return (
      <Link className={className} target={target} to={path}>
        {children}
      </Link>
    );
  }
}

export default MinardLink;
