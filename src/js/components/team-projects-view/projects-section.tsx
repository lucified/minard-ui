import * as classNames from 'classnames';
import * as React from 'react';
import * as FlipMove from 'react-flip-move';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { FetchError, isFetchError } from '../../modules/errors';
import Modal, { ModalType } from '../../modules/modal';
import { Project } from '../../modules/projects';

import LoadingIcon from '../common/loading-icon';
import MinardLink from '../common/minard-link';
import SectionTitle from '../common/section-title';
import NewProjectDialog from './new-project-dialog';
import ProjectCard from './project-card';

const styles = require('./projects-section.scss');

interface PassedProps {
  projects: (Project | FetchError)[];
  isLoading: boolean;
  count?: number;
  showAll?: boolean;
}

interface GeneratedStateProps {

}

interface GeneratedDispatchProps {
  openCreateNewProjectDialog: (e: any) => void;
}

type Props = PassedProps & GeneratedDispatchProps & GeneratedStateProps;

class ProjectsSection extends React.Component<Props, any> {
  public render() {
    const { projects, isLoading, openCreateNewProjectDialog, showAll, count = 6 } = this.props;
    const filteredProjects = (projects.filter(project => !isFetchError(project)) as Project[])
      .sort((a, b) => b.latestActivityTimestamp - a.latestActivityTimestamp);
    const projectsToShow = showAll ? filteredProjects : filteredProjects.slice(0, count);
    // If we're only showing some of the projects, don't show the loading indicator if we have enough to show
    const showLoadingIcon = isLoading && (showAll || (filteredProjects.length < count));

    return (
      <section className="container">
        <NewProjectDialog />
        <SectionTitle
          rightContent={(
            <a onClick={openCreateNewProjectDialog} className={classNames(styles['add-project-link'])}>
              + Add new project
            </a>
          )}
        >
          <span>
            {showAll ? 'All' : 'Latest'} projects for <span className={styles.team}>Team Lucify</span>
          </span>
        </SectionTitle>
        <FlipMove className="row center-xs start-sm" enterAnimation="elevator" leaveAnimation="elevator">
          {projectsToShow.map(project => (
            <div key={project.id} className={classNames('col-xs-12', 'col-sm-6', 'col-md-4', styles['project-card'])}>
              <ProjectCard project={project} />
            </div>
          ))}
          {showLoadingIcon && (
            <div key="loading" className={classNames('col-xs-12', 'col-sm-6', 'col-md-4', styles['project-card'])}>
              <LoadingIcon className={styles.loading} center />
            </div>
          )}
          {!showLoadingIcon && projectsToShow.length === 0 && (
            <div key="initial" className={classNames('col-xs-12', styles.empty)}>
              <h2>Create a new project to get started</h2>
            </div>
          )}
        </FlipMove>
        {(!showAll && filteredProjects.length > count) && (
          <div className="row end-xs">
            <div className={classNames('col-xs-12', styles['show-all-projects-section'])}>
              <MinardLink className={styles['show-all-projects-link']} showAll homepage>
                Show all projects ({filteredProjects.length})
              </MinardLink>
            </div>
          </div>
        )}
      </section>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>): GeneratedDispatchProps => ({
  openCreateNewProjectDialog: (e: any) => {
    e.preventDefault();
    dispatch(Modal.actions.openModal(ModalType.NewProject));
  },
});

export default connect<GeneratedStateProps, GeneratedDispatchProps, PassedProps>(
  () => ({}),
  mapDispatchToProps
)(ProjectsSection);
