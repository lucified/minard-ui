import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { push } from 'react-router-redux';

import Commits, { Commit } from '../../modules/commits';
import Deployments, { Deployment } from '../../modules/deployments';
import { FetchError, isFetchError } from '../../modules/errors';
import Previews, { Preview } from '../../modules/previews';
import User from '../../modules/user';
import { StateTree } from '../../reducers';

import ErrorDialog from '../common/error-dialog';
import Spinner from '../common/spinner';
import Header from '../header';
import BuildLog from './build-log';
import PreviewDialog from './preview-dialog';

const styles = require('./index.scss');

interface Params {
  commitHash: string;
  deploymentId: string;
  commentId?: string;
  view?: string;
}

interface GeneratedStateProps {
  preview?: Preview | FetchError;
  commit?: Commit | FetchError;
  deployment?: Deployment | FetchError;
  isUserLoggedIn: boolean;
  userEmail?: string;
}

interface GeneratedDispatchProps {
  loadPreviewAndComments: (deploymentId: string, commitHash: string, isUserLoggedIn: boolean) => void;
  redirectToApp: () => void;
}

type Props = RouteComponentProps<Params, {}> & GeneratedStateProps & GeneratedDispatchProps;

class DeploymentView extends React.Component<Props, void> {
  constructor(props: Props) {
    super(props);

    this.redirectToApp = this.redirectToApp.bind(this);
  }

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

  private redirectToApp() {
    this.props.redirectToApp();
  }

  public render() {
    const { commit, deployment, preview, params, isUserLoggedIn, userEmail } = this.props;

    if (!preview) {
      return (
        <div>
          <Header />
          <Spinner />
        </div>
      );
    }

    if (isFetchError(preview)) {
      return (
        <div>
          <Header />
          <ErrorDialog
            title="Error"
            actionText={isUserLoggedIn ? 'Back to Minard' : undefined}
            action={isUserLoggedIn ? this.redirectToApp : undefined}
          >
            <p>
              {preview.unauthorized ? 'You do not have access to this preview.' : 'Unable to load preview.'}
            </p>
          </ErrorDialog>
        </div>
      );
    }

    if (!commit || isFetchError(commit) || !deployment || isFetchError(deployment)) {
      return (
        <div>
          <Header />
          <ErrorDialog
            title="Error"
            actionText={isUserLoggedIn ? 'Back to Minard' : undefined}
            action={isUserLoggedIn ? this.redirectToApp : undefined}
          >
            <p>
              Unable to load preview details.
            </p>
          </ErrorDialog>
        </div>
      );
    }

    const showPreview = deployment.url && params.view !== 'log';

    return (
      <div className={styles['preview-container']}>
        <PreviewDialog
          className={styles.dialog}
          commit={commit}
          deployment={deployment}
          preview={preview}
          buildLogSelected={!showPreview}
          highlightComment={params.commentId}
          isAuthenticatedUser={isUserLoggedIn}
          userEmail={userEmail}
        />
        {showPreview ?
          <iframe className={styles.preview} src={deployment.url} /> :
          <BuildLog deployment={deployment} />
        }
      </div>
    );
  }
}

const mapStateToProps = (state: StateTree, ownProps: RouteComponentProps<Params, {}>): GeneratedStateProps => {
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
    userEmail: User.selectors.getUserEmail(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): GeneratedDispatchProps => ({
  loadPreviewAndComments: (id, commitHash, isUserLoggedIn) => {
    dispatch(Previews.actions.loadPreviewAndComments(id, commitHash, isUserLoggedIn));
  },
  redirectToApp: () => { dispatch(push('/')); },
});

export default connect<GeneratedStateProps, GeneratedDispatchProps, RouteComponentProps<Params, {}>>(
  mapStateToProps,
  mapDispatchToProps,
)(DeploymentView);
