import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { push } from 'react-router-redux';

import { update as updateIntercom } from '../../intercom';
import Commits, { Commit } from '../../modules/commits';
import Deployments, { Deployment } from '../../modules/deployments';
import { FetchError, isFetchError } from '../../modules/errors';
import Previews, {
  EntityType,
  isEntityType,
  Preview,
} from '../../modules/previews';
import User from '../../modules/user';
import { StateTree } from '../../reducers';

import ErrorDialog from '../common/error-dialog';
import Header from '../header';
import BuildLog from './build-log';
import PreviewDialog from './preview-dialog';

const styles = require('./index.scss');

interface Params {
  token: string;
  entityType: EntityType;
  id: string;
  commentId?: string;
  view?: string;
}

type PassedProps = RouteComponentProps<Params>;

interface GeneratedStateProps {
  preview?: Preview | FetchError;
  commit?: Commit | FetchError;
  deployment?: Deployment | FetchError;
  isUserLoggedIn: boolean;
  userEmail?: string;
}

interface GeneratedDispatchProps {
  loadPreviewAndComments: (
    id: string,
    entityType: EntityType,
    token: string,
    isUserLoggedIn: boolean,
  ) => void;
  redirectToApp: () => void;
}

type Props = PassedProps & GeneratedStateProps & GeneratedDispatchProps;

class DeploymentView extends React.Component<Props, void> {
  constructor(props: Props) {
    super(props);

    this.redirectToApp = this.redirectToApp.bind(this);
  }

  public componentDidMount() {
    const {
      loadPreviewAndComments,
      isUserLoggedIn,
      match: { params: { entityType, token, id } },
    } = this.props;

    if (!isEntityType(entityType)) {
      console.error('Unknown preview type!');
      return;
    }

    loadPreviewAndComments(id, entityType, token, isUserLoggedIn);

    // Don't show Intercom chat launcher when previews are open
    updateIntercom({ hide_default_launcher: true });
  }

  public componentWillReceiveProps(nextProps: Props) {
    const {
      loadPreviewAndComments,
      isUserLoggedIn,
      match: { params: { entityType, token, id } },
    } = nextProps;

    if (
      isUserLoggedIn !== !this.props.isUserLoggedIn || // User logged in/out
      id !== this.props.match.params.id || // Switched to another deployment
      entityType !== this.props.match.params.entityType
    ) {
      if (!isEntityType(entityType)) {
        console.error('Unknown preview type!');
        return;
      }

      loadPreviewAndComments(id, entityType, token, isUserLoggedIn);
    }
  }

  public componentWillUnmount() {
    updateIntercom({ hide_default_launcher: false });
  }

  private redirectToApp() {
    this.props.redirectToApp();
  }

  public render() {
    const {
      commit,
      deployment,
      preview,
      isUserLoggedIn,
      userEmail,
      match: { params: { entityType, id, token, view, commentId } },
    } = this.props;

    if (!preview) {
      return <div className={styles.blank} />;
    }

    if (
      !commit ||
      isFetchError(commit) ||
      !deployment ||
      isFetchError(deployment) ||
      isFetchError(preview)
    ) {
      let errorMessage;

      if (isFetchError(preview)) {
        // tslint:disable-line:prefer-conditional-expression
        errorMessage = preview.unauthorized
          ? 'Unauthorized'
          : 'Unable to load preview.';
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

    const showPreview = deployment.url && view !== 'log';

    return (
      <div className={styles['preview-container']}>
        <PreviewDialog
          className={styles.dialog}
          commit={commit}
          deployment={deployment}
          preview={preview}
          buildLogSelected={!showPreview}
          highlightComment={commentId}
          isAuthenticatedUser={isUserLoggedIn} // TODO: This should check whether the preview belongs to the user's team
          userEmail={userEmail}
          linkDetails={{ entityType, id, token }}
        />
        {showPreview
          ? <iframe className={styles.preview} src={deployment.url} />
          : <BuildLog deployment={deployment} />}
      </div>
    );
  }
}

const mapStateToProps = (
  state: StateTree,
  ownProps: PassedProps,
): GeneratedStateProps => {
  const { id, entityType } = ownProps.match.params;
  let commit: Commit | FetchError | undefined;
  let deployment: Deployment | FetchError | undefined;

  const preview = Previews.selectors.getPreview(state, id, entityType);

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

const mapDispatchToProps = (
  dispatch: Dispatch<any>,
): GeneratedDispatchProps => ({
  loadPreviewAndComments: (id, entityType, token, isUserLoggedIn) => {
    dispatch(
      Previews.actions.loadPreviewAndComments(
        id,
        entityType,
        token,
        isUserLoggedIn,
      ),
    );
  },
  redirectToApp: () => {
    dispatch(push('/'));
  },
});

export default connect<
  GeneratedStateProps,
  GeneratedDispatchProps,
  PassedProps
>(mapStateToProps, mapDispatchToProps)(DeploymentView);
