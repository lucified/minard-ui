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
}

class MinardLink extends React.Component<Props, any> {
  public render() {
    const { children, deployment, branch, project, openInNewWindow } = this.props;
    const target = openInNewWindow ? '_blank' : '_self';
    let path = '/';

    if (deployment) {
      // path = `/deployment/${deployment.id}`;

      // TODO: link to deployment view instead of actual deployment
      path = deployment.url;

      if (path) {
        return (
          <a href={path} target={target}>
            {children}
          </a>
        );
      }

      return (
        <span>{children}</span>
      );
    } else if (branch) {
      path = `/project/${branch.project}/${branch.id}`;
    } else if (project) {
      path = `/project/${project.id}`;
    } else {
      console.log('Error: no link handler found');
    }

    return (
      <Link target={target} to={path}>
        {children}
      </Link>
    );
  }
}

export default MinardLink;
