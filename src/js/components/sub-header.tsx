import * as classNames from 'classnames';
import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import Icon = require('react-fontawesome');

import { FetchError, isFetchError } from '../modules/errors';
import Modal, { ModalType } from '../modules/modal';
import Projects, { Project } from '../modules/projects';
import Selected from '../modules/selected';
import User, { Team } from '../modules/user';
import { StateTree } from '../reducers';

import Avatar from './common/avatar';
import MinardLink from './common/minard-link';

const styles = require('./sub-header.scss');

enum PageType {
  TeamProjectsView,
  ProjectsList,
  ProjectView,
  BranchesList,
  BranchView,
}

interface GeneratedProps {
  openPageType: PageType;
  team?: Team;
  project?: Project | FetchError;
  branch: string | null;
}

interface GeneratedDispatchProps {
  openProjectSettingsDialog: (e: React.MouseEvent<HTMLElement>) => void;
}

type Props = GeneratedProps & GeneratedDispatchProps;

class SubHeader extends React.Component<Props, void> {

  private getLeftContent() {
    const { openPageType, project, branch, team } = this.props;
    const items: JSX.Element[] = [
      <MinardLink key="team" className={styles['sub-header-link']} homepage>{team!.name}</MinardLink>,
    ];

    if (openPageType === PageType.ProjectsList) {
      items.push(
        <span key="all-projects">
          {' '}/ all projects
        </span>,
      );
    }

    if (project && !isFetchError(project)) {
      items.push(
        <span key="project-name">
          {' '}/{' '}
          <MinardLink
            className={styles['sub-header-link']}
            project={project}
          >
            {project.name}
          </MinardLink>
        </span>,
      );

      if (openPageType === PageType.BranchView && branch) {
        items.push(
          <span key="branch">
            {' '}/{' '}
            <MinardLink
              className={styles['sub-header-link']}
              project={project}
              branch={branch}
            >
              {branch}
            </MinardLink>
          </span>,
        );
      }
    }
    return <span>{items}</span>;
  }

  private getRightContent() {
    const { project, openProjectSettingsDialog, openPageType } = this.props;
    if (project && !isFetchError(project)) {
      return (
        <div className={styles['project-right']}>
          {openPageType === PageType.ProjectView && project.activeUsers.map(user => (
            <div className={styles.avatar} key={user.email}>
              <Avatar email={user.email} size="m" title={user.name} shadow />
            </div>
          ))}
          <div className={styles['project-settings']}>
            <Icon className={styles.icon} name="gear" />
            <div className={styles['project-settings-text']}>
              <a onClick={openProjectSettingsDialog}>
                Project settings
              </a>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  public render() {
    const { openPageType } = this.props;
    if (openPageType === PageType.TeamProjectsView) {
      return <span />;
    }

    // TODO: what if we don't have team?
    const leftContent = this.getLeftContent();
    const rightContent = this.getRightContent();

    return (
      <section className={classNames(styles['sub-header-background'])}>
        <div className="container-fluid">
          <div className={styles.main}>
            <div className={classNames(styles['sub-header-left'], styles['sub-header'])}>
              {leftContent}
            </div>
            <div className={styles['sub-header']}>
              {rightContent}
            </div>
          </div>
        </div>
      </section>
    );
  }
}

const mapStateToProps = (state: StateTree): GeneratedProps => {
  const selectedBranch = Selected.selectors.getSelectedBranch(state);
  const selectedProject = Selected.selectors.getSelectedProject(state);
  const isShowingAll = Selected.selectors.isShowingAll(state);
  let openPageType: PageType;
  let project: Project | FetchError | undefined;

  if (selectedProject !== null) {
    project = Projects.selectors.getProject(state, selectedProject);
    if (selectedBranch !== null) {
      openPageType = PageType.BranchView;
    } else {
      if (isShowingAll) {
        openPageType = PageType.BranchesList;
      } else {
        openPageType = PageType.ProjectView;
      }
    }
  } else {
    if (isShowingAll) {
      openPageType = PageType.ProjectsList;
    } else {
      openPageType = PageType.TeamProjectsView;
    }
  }

  return {
    openPageType,
    project,
    branch: selectedBranch,
    team: User.selectors.getTeam(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): GeneratedDispatchProps => ({
  openProjectSettingsDialog: (_e: React.MouseEvent<HTMLElement>) => {
    dispatch(Modal.actions.openModal(ModalType.ProjectSettings));
  },
});

export default connect<GeneratedProps, {}, {}>(mapStateToProps, mapDispatchToProps)(SubHeader);
