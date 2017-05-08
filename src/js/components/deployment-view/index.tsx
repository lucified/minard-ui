import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { push } from 'react-router-redux';

import Commits, { Commit } from '../../modules/commits';
import Deployments, { Deployment } from '../../modules/deployments';
import { FetchError, isFetchError } from '../../modules/errors';
import Previews, { EntityType, Preview } from '../../modules/previews';
import User from '../../modules/user';
import { StateTree } from '../../reducers';

import ErrorDialog from '../common/error-dialog';
import Header from '../header';
import BuildLog from './build-log';
import PreviewDialog from './preview-dialog';

const styles = require('./index.scss');

interface Params {
  token: string;
  deploymentId?: string;
  projectId?: string;
  branchId?: string;
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
  loadPreviewAndComments: (id: string, entityType: EntityType, token: string, isUserLoggedIn: boolean) => void;
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
    const { deploymentId, projectId, branchId, token } = this.props.params;

    if (deploymentId) {
      loadPreviewAndComments(deploymentId, 'deployment', token, isUserLoggedIn);
    } else if (projectId) {
      loadPreviewAndComments(projectId, 'project', token, isUserLoggedIn);
    } else if (branchId) {
      loadPreviewAndComments(branchId, 'branch', token, isUserLoggedIn);
    } else {
      console.error('Unknown preview type!');
    }
  }

  public componentWillReceiveProps(nextProps: Props) {
    const { loadPreviewAndComments, isUserLoggedIn } = nextProps;
    const { token, deploymentId, projectId, branchId } = nextProps.params;

    if (
      deploymentId !== this.props.params.deploymentId ||
      projectId !== this.props.params.projectId ||
      branchId !== this.props.params.branchId
    ) {
      if (deploymentId) {
        loadPreviewAndComments(deploymentId, 'deployment', token, isUserLoggedIn);
      } else if (projectId) {
        loadPreviewAndComments(projectId, 'project', token, isUserLoggedIn);
      } else if (branchId) {
        loadPreviewAndComments(branchId, 'branch', token, isUserLoggedIn);
      } else {
        console.error('Unknown preview type!');
      }
    }
  }

  private redirectToApp() {
    this.props.redirectToApp();
  }

  public render() {
    const { commit, deployment, preview, params, isUserLoggedIn, userEmail } = this.props;

    if (!preview) {
      return <div className={styles.blank} />;
    }

    if (!commit || isFetchError(commit) || !deployment || isFetchError(deployment) || isFetchError(preview)) {
      let errorMessage;

      if (isFetchError(preview)) {
        errorMessage = preview.unauthorized ? 'You do not have access to this preview.' : 'Unable to load preview.';
      } else {
        errorMessage = 'Unable to load preview details.';
      }

      return (
        <div>
          <Header />
          <ErrorDialog
            title="Error"
            actionText={isUserLoggedIn ? 'Back to Minard' : undefined}
            action={isUserLoggedIn ? this.redirectToApp : undefined}
          >
            <p>
              {errorMessage}
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
  const { deploymentId, projectId, branchId } = ownProps.params;
  let preview: Preview | FetchError | undefined;
  let commit: Commit | FetchError | undefined;
  let deployment: Deployment | FetchError | undefined;

  const id = deploymentId || projectId || branchId;

  if (id) {
    preview = Previews.selectors.getPreview(state, id);

    if (preview && !isFetchError(preview)) {
      commit = Commits.selectors.getCommit(state, preview.commit);
      deployment = Deployments.selectors.getDeployment(state, preview.deployment);
    }
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
  loadPreviewAndComments: (id, entityType, token, isUserLoggedIn) => {
    dispatch(Previews.actions.loadPreviewAndComments(id, entityType, token, isUserLoggedIn));
  },
  redirectToApp: () => { dispatch(push('/')); },
});

export default connect<GeneratedStateProps, GeneratedDispatchProps, RouteComponentProps<Params, {}>>(
  mapStateToProps,
  mapDispatchToProps,
)(DeploymentView);
