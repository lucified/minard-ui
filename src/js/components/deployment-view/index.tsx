import * as React from 'react';
import { connect } from 'react-redux';

import Commits, { Commit } from '../../modules/commits';
import Deployments, { Deployment } from '../../modules/deployments';
import { FetchError, isFetchError } from '../../modules/errors';
import Previews, { Preview } from '../../modules/previews';
import { StateTree } from '../../reducers';

interface PassedProps {
  location: any;
  route: any;
  params: any;
}

interface GeneratedStateProps {
  preview?: Preview | FetchError;
  commit?: Commit | FetchError;
  deployment?: Deployment | FetchError;
}

interface GeneratedDispatchProps {
  loadPreview: (deploymentId: string) => void;
}

type Props = PassedProps & GeneratedStateProps & GeneratedDispatchProps;

class ProjectsFrame extends React.Component<Props, any> {
  public componentWillMount() {
    const { loadPreview } = this.props;
    const { deploymentId } = this.props.params;

    loadPreview(deploymentId);
  }

  public componentWillReceiveProps(nextProps: Props) {
    const { loadPreview } = nextProps;
    const { deploymentId } = nextProps.params;

    if (deploymentId !== this.props.params.deploymentId) {
      loadPreview(deploymentId);
    }
  }

  public render() {
    const { commit, deployment, preview } = this.props;

    return preview && !isFetchError(preview) ? (
      <div>
        Deployment: {deployment ? deployment.id : 'Deployment not fetched'}<br />
        Commit: {commit ? commit.id : 'Commit not fetched'}<br />
        Project: {preview.project.name}<br />
        Branch: {preview.branch.name}
      </div>
    ) : <div>Loading...</div>;
  }
};

const mapStateToProps = (state: StateTree, ownProps: PassedProps): GeneratedStateProps => {
  const { deploymentId } = ownProps.params;
  const preview = Previews.selectors.getPreview(state, deploymentId);
  let commit: Commit | FetchError | undefined;
  let deployment: Deployment | FetchError | undefined;

  if (preview && !isFetchError(preview)) {
    commit = Commits.selectors.getCommit(state, preview.commit);
    deployment = Deployments.selectors.getDeployment(state, preview.deployment);
  }

  return {
    preview,
    commit,
    deployment,
  };
};

export default connect<GeneratedStateProps, GeneratedDispatchProps, PassedProps>(
  mapStateToProps,
  { loadPreview: Previews.actions.loadPreview },
)(ProjectsFrame);
