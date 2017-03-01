import * as React from 'react';
import { Link } from 'react-router';

import { Branch } from '../../modules/branches';
import { Comment } from '../../modules/comments';
import { Commit } from '../../modules/commits';
import { Deployment } from '../../modules/deployments';
import { Project } from '../../modules/projects';

interface Props {
  deployment?: Deployment;
  preview?: Deployment;
  commit?: Commit;
  branch?: Branch | string;
  project?: Project | string;
  comment?: Comment;
  openInNewWindow?: boolean;
  homepage?: boolean;
  className?: string;
  showAll?: boolean;
  buildLog?: boolean;
}

class MinardLink extends React.Component<Props, void> {
  public render() {
    const {
      buildLog,
      className,
      comment,
      commit,
      children,
      deployment,
      branch,
      homepage,
      preview,
      project,
      showAll,
      openInNewWindow,
    } = this.props;
    const target = openInNewWindow ? '_blank' : undefined;
    let path: string;

    // Raw deployment
    if (deployment) {
      path = deployment.url || '';

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
    } else if (preview) {
      if (!commit) {
        console.error('Missing commit information for preview link!', preview);
        return <span className={className}>{children}</span>;
      }

      // Link to build log if preview is not ready
      path = (preview.url && !buildLog) ?
        `/preview/${commit.hash}/${preview.id}` : `/preview/${commit.hash}/${preview.id}/log`;
    } else if (comment) {
      if (!commit) {
        console.error('Missing commit information for comment link!', comment);
        return <span className={className}>{children}</span>;
      }

      path = `/preview/${commit.hash}/${comment.deployment}/comment/${comment.id}`;
    } else if (branch) {
      let projectId: string;
      let branchId: string;

      if (typeof branch === 'string') {
        branchId = branch;
        projectId = project as string;
      } else {
        branchId = branch.id;
        projectId = branch.project;
      }

      path = `/project/${projectId}/branch/${branchId}`;
    } else if (project) {
      let projectId: string;

      if (typeof project === 'string') {
        projectId = project as string;
      } else {
        projectId = project.id;
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
