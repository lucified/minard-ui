import * as classNames from 'classnames';
import * as React from 'react';
import { connect } from 'react-redux';
import Icon = require('react-fontawesome');

import { FetchError, isFetchError } from '../modules/errors';
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

class SubHeader extends React.Component<GeneratedProps, void> {

  private getLeftContent() {
    const { openPageType, project, branch, team } = this.props;
    const items: JSX.Element[] = [];

    items.push(
      <MinardLink key="team" className={styles['sub-header-link']} homepage>{team!.name}</MinardLink>,
    );

    if (project && !isFetchError(project)) {
      items.push(
        <span>
          {' '}/{' '}
          <MinardLink
            key="project-name"
            className={styles['sub-header-link']}
            project={project}
          >
            {project.name}
          </MinardLink>
        </span>,
      );

      if (openPageType === PageType.BranchView && branch) {
        items.push(
          <span>
            {' '}/{' '}
            <MinardLink
              key="branch"
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
    const { project } = this.props;
    if (project && !isFetchError(project)) {
      return (
        <div className={styles['project-right']}>
          {project.activeUsers.map(user => (
            <div className={styles.avatar}>
              <Avatar email={user.email} size="m" title={user.name} shadow />
            </div>
          ))}
          <div className={styles['project-settings']}>
            <Icon className={styles.icon} name="gear" />
            <div className={styles['project-settings-text']}>
              Project settings
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  public render() {
    const centerContent: JSX.Element | null = null;

    // TODO: what if we don't have team?
    const leftContent = this.getLeftContent();
    const rightContent = this.getRightContent();

    return (
      <section className={classNames(styles['sub-header-background'])}>
        <div className="container">
          <div className="row">
            <div className={classNames(styles['sub-header'], 'start-xs', 'col-xs-4')}>
              {leftContent}
            </div>
            <div className={classNames(styles['sub-header'], 'center-xs', 'col-xs-4')}>
              {centerContent}
            </div>
            <div className={classNames(styles['sub-header'], 'end-xs', 'col-xs-4')}>
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

export default connect<GeneratedProps, {}, {}>(mapStateToProps)(SubHeader);
