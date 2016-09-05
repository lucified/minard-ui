import * as classNames from 'classnames';
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { FetchError } from '../../modules/errors';
import Modal, { ModalType } from '../../modules/modal';
import { Project } from '../../modules/projects';

import LoadingIcon from '../common/loading-icon';
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

const ProjectsSection = ({ projects, isLoading, openCreateNewProjectDialog, showAll, count = 6 }: Props) => {
  const projectsToShow = showAll ? projects : projects.slice(0, count);
  // If we're only showing some of the projects, don't show the loading indicator if we have enough to show
  const showLoadingIcon = isLoading && (showAll || (projects.length < count));

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
          Projects for <span className={styles.team}>Team Lucify</span>
        </span>
      </SectionTitle>
      <div className="row center-xs start-sm">
        {projectsToShow.map(project => (
          <div key={project.id} className={classNames('col-xs-12', 'col-sm-6', 'col-md-4', styles['project-card'])}>
            <ProjectCard project={project} />
          </div>
        ))}
        {showLoadingIcon && (
          <div className={classNames('col-xs-12', 'col-sm-6', 'col-md-4', styles['project-card'])}>
            <LoadingIcon className={styles.loading} center />
          </div>
        )}
      </div>
    </section>
  );
};

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
