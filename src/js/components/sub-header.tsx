import * as classNames from 'classnames';
import * as React from 'react';
import * as Icon from 'react-fontawesome';
import { connect } from 'react-redux';

import { FetchError, isError } from '../modules/errors';
import Projects, { Project } from '../modules/projects';
import Selected from '../modules/selected';
import { StateTree } from '../reducers';
import MinardLink from './common/minard-link';

const styles = require('./sub-header.scss');

enum PageType {
  TeamProjectsView,
  ProjectView,
  BranchView,
};

interface GeneratedProps {
  openPageType: PageType;
  teamName?: string;
  project?: Project | FetchError;
}

const classForType = (type: PageType): string => {
  switch (type) {
    case PageType.BranchView:
    case PageType.ProjectView:
      return 'start-xs';
    case PageType.TeamProjectsView:
      return 'center-xs';
    default:
      return 'start-xs';
  }
};

class SubHeader extends React.Component<GeneratedProps, any> {
  public render() {
    const { openPageType, project, teamName } = this.props;
    let content: JSX.Element | null = null;

    if (openPageType === PageType.BranchView && project && !isError(project)) {
      content = <MinardLink className={styles['sub-header-link']} project={project}>‹ {project.name}</MinardLink>;
    } else if (openPageType === PageType.ProjectView && teamName) {
      content = <MinardLink className={styles['sub-header-link']} homepage>‹ {teamName}</MinardLink>;
    } else if (openPageType === PageType.TeamProjectsView) {
      content = (
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
            <div className={classNames(styles['sub-header'], classForType(openPageType), 'col-xs-12')}>
              {content}
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
    openPageType = PageType.TeamProjectsView;
  }

  return {
    openPageType,
    project,
    teamName: 'Team Lucify', // TODO: use actual team name
  };
};

export default connect<GeneratedProps, {}, {}>(mapStateToProps)(SubHeader);
