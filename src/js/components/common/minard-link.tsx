import * as classNames from 'classnames';
import * as React from 'react';
import { Link } from 'react-router';

import { Branch } from '../../modules/branches';
import { Deployment } from '../../modules/deployments';
import { Project } from '../../modules/projects';

interface Props {
  deployment?: Deployment;
  branch?: Branch;
  project?: Project;
  openInNewWindow?: boolean;
  homepage?: boolean;
  className?: string;
  showAll?: boolean;
}

class MinardLink extends React.Component<Props, any> {
  public render() {
    const { children, deployment, branch, homepage, project, showAll, openInNewWindow } = this.props;
    const target = openInNewWindow ? '_blank' : undefined;
    let path: string;

    if (deployment) {
      // path = `/deployment/${deployment.id}`;

      // TODO: link to deployment view instead of actual deployment
      path = deployment.url || '';

      if (path) {
        return (
          <a className={classNames(this.props.className)} href={path} target={target}>
            {children}
          </a>
        );
      }

      return (
        <span>{children}</span>
      );
    } else if (branch) {
      path = `/project/${branch.project}/branch/${branch.id}`;
    } else if (project) {
      if (showAll) {
        path = `/project/${project.id}/all`;
      } else {
        path = `/project/${project.id}`;
      }
    } else if (homepage) {
      if (showAll) {
        path = '/projects/all';
      } else {
        path = '/projects';
      }
    } else {
      console.log('Error: no link handler found'); // tslint:disable-line:no-console
      return <span>{children}</span>;
    }

    return (
      <Link className={classNames(this.props.className)} target={target} to={path}>
        {children}
      </Link>
    );
  }
}

export default MinardLink;
