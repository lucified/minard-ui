import * as classNames from 'classnames';
import * as React from 'react';
import Icon = require('react-fontawesome');
import { connect, Dispatch } from 'react-redux';

import Errors from '../../modules/errors';
import Notifications, {
  GitHubProjectNotificationConfiguration,
  GitHubTeamNotificationConfiguration,
  isGitHubProjectNotificationConfiguration,
} from '../../modules/notifications';
import { Project } from '../../modules/projects';
import { StateTree } from '../../reducers';

const styles = require('./github-notifications.scss');

interface PassedProps {
  project: Project;
}

interface GeneratedStateProps {
  teamGitHubNotifications?: GitHubTeamNotificationConfiguration[];
  projectGitHubNotifications?: GitHubProjectNotificationConfiguration[];
  error?: string;
}

interface GeneratedDispatchProps {
  setGitHubRepo: (owner: string, repo: string) => void;
  removeNotificationConfiguration: (id: string) => void;
}

type Props = PassedProps & GeneratedStateProps & GeneratedDispatchProps;

interface State {
  owner: string;
  repo: string;
  validationError?: string;
}

class GitHubNotifications extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const configuration =
      props.projectGitHubNotifications &&
      props.projectGitHubNotifications.length > 0 &&
      props.projectGitHubNotifications[0];

    this.state = {
      owner: configuration ? configuration.githubOwner : '',
      repo: configuration ? configuration.githubRepo : '',
    };
  }

  public componentWillReceiveProps(nextProps: Props) {
    const existingConfiguration = this.getExistingConfiguration();
    const newConfiguration =
      nextProps.projectGitHubNotifications &&
      nextProps.projectGitHubNotifications[0];
    if (
      (existingConfiguration && !newConfiguration) ||
      (!existingConfiguration && newConfiguration) ||
      (existingConfiguration &&
        newConfiguration &&
        (existingConfiguration.githubOwner !== newConfiguration.githubOwner ||
          existingConfiguration.githubRepo !== newConfiguration.githubRepo))
    ) {
      const owner = newConfiguration ? newConfiguration.githubOwner : '';
      const repo = newConfiguration ? newConfiguration.githubRepo : '';
      this.setState({
        repo,
        owner,
        validationError: this.validateInput(owner, repo),
      });
    }
  }

  /**
   * Returns undefined if no errors found.
   */
  private validateInput(owner: string, repo: string): string | undefined {
    const validator = /^[A-Za-z0-9_.-]*$/;
    if (!validator.test(repo) || !validator.test(owner)) {
      return 'Only alphanumeric characters, dashes, underscores, and dots allowed.';
    }

    return undefined;
  }

  private handleOwnerChange = (e: React.FormEvent<HTMLInputElement>) => {
    const owner = e.currentTarget.value.replace(' ', '-');
    this.setState({
      owner,
      validationError: this.validateInput(owner, this.state.repo),
    });
  };

  private handleRepoChange = (e: React.FormEvent<HTMLInputElement>) => {
    const repo = e.currentTarget.value.replace(' ', '-');
    this.setState({
      repo,
      validationError: this.validateInput(this.state.owner, repo),
    });
  };

  private handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const { repo, owner, validationError } = this.state;
    if (!validationError) {
      this.props.setGitHubRepo(owner, repo);
    }
  };

  private getExistingConfiguration() {
    const { projectGitHubNotifications } = this.props;
    // A project should only have one GitHub notification configuration
    return projectGitHubNotifications && projectGitHubNotifications[0];
  }

  private handleUnlink = () => {
    const existingConfiguration = this.getExistingConfiguration();

    if (existingConfiguration) {
      this.props.removeNotificationConfiguration(existingConfiguration.id);
    }
  };

  public render() {
    const { owner, repo, validationError } = this.state;
    const { error, teamGitHubNotifications } = this.props;
    const existingSettings = this.getExistingConfiguration();

    return (
      <div className={styles.field}>
        <div className={styles['label-row']}>
          <label className={styles.label}>Link to GitHub repo</label>
          {(error || validationError) &&
            <span className={styles.error}>
              {error || validationError}
            </span>}
        </div>
        {!teamGitHubNotifications || teamGitHubNotifications.length === 0
          ? <div className={styles.instructions}>
              The GitHub integration needs to be set up for your team before
              this project can be linked to a GitHub repo.
            </div>
          : <div>
              <div className={styles.inputs}>
                <div>
                  <div>Organization</div>
                  <div className={styles.input}>
                    <Icon name="pencil" className={styles.icon} />
                    <input
                      type="text"
                      value={owner}
                      name="owner"
                      onChange={this.handleOwnerChange}
                    />
                  </div>
                </div>
                <div>
                  <div>Repo</div>
                  <div className={styles.input}>
                    <span className={classNames(styles.icon, styles.slash)}>
                      /
                    </span>
                    <input
                      type="text"
                      value={repo}
                      name="repo"
                      onChange={this.handleRepoChange}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.actions}>
                {existingSettings &&
                  <a className={styles.unlink} onClick={this.handleUnlink}>
                    Unlink
                  </a>}
                <button
                  type="submit"
                  className={styles.submit}
                  disabled={
                    !owner ||
                    !repo ||
                    !!validationError ||
                    (existingSettings &&
                      existingSettings.githubOwner === owner &&
                      existingSettings.githubRepo === repo)
                  }
                  onClick={this.handleSubmit}
                >
                  Link
                </button>
              </div>
            </div>}
      </div>
    );
  }
}

const mapStateToProps = (
  state: StateTree,
  ownProps: PassedProps,
): GeneratedStateProps => {
  const projectNotifications = Notifications.selectors.getProjectNotificationConfigurations(
    state,
    ownProps.project.id,
  );
  const errorObject = Errors.selectors.getCreateProjectNotificationError(
    state,
    // TODO: Refactor so that this isn't manually declared here in addition to notifications/sagas
    `github-${ownProps.project.id}`,
  );

  return {
    teamGitHubNotifications: Notifications.selectors.getTeamGitHubNotificationConfiguration(
      state,
    ),
    projectGitHubNotifications:
      projectNotifications &&
      projectNotifications.filter(isGitHubProjectNotificationConfiguration),
    error: errorObject && errorObject.error,
  };
};

const dispatchToProps = (
  dispatch: Dispatch<any>,
  ownProps: PassedProps,
): GeneratedDispatchProps => ({
  setGitHubRepo: (owner: string, repo: string) => {
    dispatch(
      Notifications.actions.setProjectGitHubNotifications(
        ownProps.project.id,
        owner,
        repo,
      ),
    );
  },
  removeNotificationConfiguration: (notificationId: string) => {
    dispatch(Notifications.actions.deleteNotification(notificationId));
  },
});

export default connect<
  GeneratedStateProps,
  GeneratedDispatchProps,
  PassedProps
>(mapStateToProps, dispatchToProps)(GitHubNotifications);
