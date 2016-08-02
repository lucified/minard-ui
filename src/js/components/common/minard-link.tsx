import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import Branches, { Branch } from '../../modules/branches';
import Commits from '../../modules/commits';
import { Deployment } from '../../modules/deployments';
import { Project } from '../../modules/projects';
import { StateTree } from '../../reducers';

interface PassedProps {
  deployment?: Deployment;
  branch?: Branch;
  project?: Project;
  openInNewWindow?: boolean;
}

interface GeneratedProps {
  deploymentBranch?: Branch;
}

class MinardLink extends React.Component<PassedProps & GeneratedProps, any> {
  public render() {
    const { children, deployment, deploymentBranch, branch, project, openInNewWindow } = this.props;
    const target = openInNewWindow ? '_blank' : '_self';
    let path = '/';

    if (deployment) {
      path = `/project/${deploymentBranch.project}/${deploymentBranch.id}/${deployment.id}`;
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

const mapStateToProps = (state: StateTree, ownProps: PassedProps): GeneratedProps => {
  const { deployment } = ownProps;

  if (deployment) {
    const commit = Commits.selectors.getCommit(state, deployment.commit);

    return {
      deploymentBranch: Branches.selectors.getBranch(state, commit.branch),
    };
  }

  return {};
};

export default connect<GeneratedProps, {}, PassedProps>(mapStateToProps)(MinardLink);
