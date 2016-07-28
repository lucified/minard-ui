import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import branches, { Branch } from '../../modules/branches';
import { Commit } from '../../modules/commits';
import { Project } from '../../modules/projects';
import { StateTree } from '../../reducers';

interface PassedProps {
  commit?: Commit;
  branch?: Branch;
  project?: Project;
  openInNewWindow?: boolean;
}

interface GeneratedProps {
  commitBranch?: Branch;
}

class MinardLink extends React.Component<PassedProps & GeneratedProps, any> {
  public render() {
    const { children, commit, commitBranch, branch, project, openInNewWindow } = this.props;
    const target = openInNewWindow ? '_blank' : '_self';
    let path = '/';

    if (commit) {
      path = `/project/${commitBranch.project}/${commitBranch.name}/${commit.hash}`;
    } else if (branch) {
      path = `/project/${branch.project}/${branch.name}`;
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
  if (ownProps.commit) {
    return {
      commitBranch: branches.selectors.getBranch(state, ownProps.commit.branch),
    };
  }

  return {};
};

export default connect<GeneratedProps, {}, PassedProps>(mapStateToProps)(MinardLink);
