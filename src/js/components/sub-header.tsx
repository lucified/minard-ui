import * as classNames from 'classnames';
import * as React from 'react';
import * as Icon from 'react-fontawesome';
import { connect } from 'react-redux';

import { FetchError, isFetchError } from '../modules/errors';
import Projects, { Project } from '../modules/projects';
import Selected from '../modules/selected';
import { StateTree } from '../reducers';
import MinardLink from './common/minard-link';

const styles = require('./sub-header.scss');

enum PageType {
  TeamProjectsView,
  ProjectsList,
  ProjectView,
  BranchView,
};

interface GeneratedProps {
  openPageType: PageType;
  teamName?: string;
  project?: Project | FetchError;
}

class SubHeader extends React.Component<GeneratedProps, any> {
  public render() {
    const { openPageType, project, teamName } = this.props;
    let leftContent: JSX.Element | null = null;
    let centerContent: JSX.Element | null = null;
    let rightContent: JSX.Element | null = null;

    if (openPageType === PageType.BranchView && project && !isFetchError(project)) {
      leftContent = <MinardLink className={styles['sub-header-link']} project={project}>‹ {project.name}</MinardLink>;
    } else if (teamName && (openPageType === PageType.ProjectView || openPageType === PageType.ProjectsList)) {
      leftContent = <MinardLink className={styles['sub-header-link']} homepage>‹ {teamName}</MinardLink>;
    }

    if (openPageType === PageType.TeamProjectsView || openPageType === PageType.ProjectsList) {
      centerContent = (
        <span>
          Sort projects by
          <a className={styles['sorting-dropdown']} href="#">Recent <Icon name="caret-down" /></a>
        </span>
      );
    }

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
};

const mapStateToProps = (state: StateTree): GeneratedProps => {
  const selectedBranch = Selected.selectors.getSelectedBranch(state);
  const selectedProject = Selected.selectors.getSelectedProject(state);
  const isShowingAll = Selected.selectors.isShowingAll(state);
  let openPageType: PageType;
  let project: Project | FetchError | undefined;

  if (selectedProject !== null) {
    if (selectedBranch !== null) {
      openPageType = PageType.BranchView;
      project = Projects.selectors.getProject(state, selectedProject);
    } else {
      openPageType = PageType.ProjectView;
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
    teamName: 'Team Lucify', // TODO: use actual team name
  };
};

export default connect<GeneratedProps, {}, {}>(mapStateToProps)(SubHeader);
