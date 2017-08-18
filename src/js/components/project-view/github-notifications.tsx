import * as classNames from 'classnames';
import * as React from 'react';
import Icon = require('react-fontawesome');
import { connect, Dispatch } from 'react-redux';

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
      this.setState({
        repo: newConfiguration ? newConfiguration.githubRepo : '',
        owner: newConfiguration ? newConfiguration.githubOwner : '',
      });
    }
  }

  private handleOwnerChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({ owner: e.currentTarget.value });
  };

  private handleRepoChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({ repo: e.currentTarget.value });
  };

  private handleSubmit = () => {
    // TODO: validate input
    const { repo, owner } = this.state;
    this.props.setGitHubRepo(owner, repo);
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
    const { owner, repo } = this.state;
    const { error, teamGitHubNotifications } = this.props;
    const existingSettings = this.getExistingConfiguration();

    return (
      <div className={styles.field}>
        <div className={styles['label-row']}>
          <label className={styles.label}>Link to GitHub repo</label>
          {error &&
            <span className={styles.error}>
              {error}
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

  return {
    teamGitHubNotifications: Notifications.selectors.getTeamGitHubNotificationConfiguration(
      state,
    ),
    projectGitHubNotifications:
      projectNotifications &&
      projectNotifications.filter(isGitHubProjectNotificationConfiguration),
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
