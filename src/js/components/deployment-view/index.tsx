import * as React from 'react';
import { connect, Dispatch } from 'react-redux';

import Commits, { Commit } from '../../modules/commits';
import Deployments, { Deployment } from '../../modules/deployments';
import { FetchError, isFetchError } from '../../modules/errors';
import Previews, { Preview } from '../../modules/previews';
import User from '../../modules/user';
import { StateTree } from '../../reducers';

import PreviewDialog from './preview-dialog';

const getBuildLogURL = process.env.CHARLES ?
  require('../../api').getBuildLogURL :
  require('../../api/static-json').getBuildLogURL;

const styles = require('./index.scss');

interface PassedProps {
  location: any;
  route: any;
  params: {
    commitHash: string;
    deploymentId: string;
    commentId?: string;
    view?: string;
  };
}

interface GeneratedStateProps {
  preview?: Preview | FetchError;
  commit?: Commit | FetchError;
  deployment?: Deployment | FetchError;
  isUserLoggedIn: boolean;
}

interface GeneratedDispatchProps {
  loadPreviewAndComments: (deploymentId: string, commitHash: string, isUserLoggedIn: boolean) => void;
}

type Props = PassedProps & GeneratedStateProps & GeneratedDispatchProps;

class ProjectsFrame extends React.Component<Props, void> {
  public componentWillMount() {
    const { loadPreviewAndComments, isUserLoggedIn } = this.props;
    const { deploymentId, commitHash } = this.props.params;

    loadPreviewAndComments(deploymentId, commitHash, isUserLoggedIn);
  }

  public componentWillReceiveProps(nextProps: Props) {
    const { loadPreviewAndComments, isUserLoggedIn } = nextProps;
    const { commitHash, deploymentId } = nextProps.params;

    if (deploymentId !== this.props.params.deploymentId) {
      loadPreviewAndComments(deploymentId, commitHash, isUserLoggedIn);
    }
  }

  public render() {
    const { commit, deployment, preview, params, isUserLoggedIn } = this.props;

    if (!preview) {
      return <div>Loading...</div>;
    }

    if (isFetchError(preview)) {
      return (
        <div>
          <strong>Error!</strong>
          <p>{preview.unauthorized ? 'Unauthorized.' : 'Unable to load preview.'}</p>
        </div>
      );
    }

    if (!commit || isFetchError(commit) || !deployment || isFetchError(deployment)) {
      return (
        <div>
          <strong>Error!</strong>
          <p>Unable to load commit and deployment information.</p>
        </div>
      );
    }

    const showPreview = deployment.url && params.view !== 'log';

    // TODO: check that isUserLoggedIn is enough authentication
    return (
      <div className={styles['preview-container']}>
        <PreviewDialog
          className={styles.dialog}
          commit={commit}
          deployment={deployment}
          preview={preview}
          buildLogSelected={!showPreview}
          highlightComment={params.commentId}
          authenticatedUser={isUserLoggedIn}
        />
        <iframe className={styles.preview} src={showPreview ? deployment.url : getBuildLogURL(deployment.id)} />
      </div>
    );
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
    isUserLoggedIn: User.selectors.isUserLoggedIn(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): GeneratedDispatchProps => ({
  loadPreviewAndComments: (id, commitHash, isUserLoggedIn) => {
    dispatch(Previews.actions.loadPreviewAndComments(id, commitHash, isUserLoggedIn));
  },
});

export default connect<GeneratedStateProps, GeneratedDispatchProps, PassedProps>(
  mapStateToProps,
  mapDispatchToProps,
)(ProjectsFrame);
