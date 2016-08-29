import * as classNames from 'classnames';
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { FetchError } from '../../modules/errors';
import Modal, { ModalType } from '../../modules/modal';
import { Project } from '../../modules/projects';
import { StateTree } from '../../reducers';

import LoadingIcon from '../common/loading-icon';
import SectionTitle from '../common/section-title';
import NewProjectDialog from './new-project-dialog';
import ProjectCard from './project-card';

const styles = require('./projects-section.scss');

interface PassedProps {
  projects: (Project | FetchError)[];
  isLoading: boolean;
}

interface GeneratedStateProps {
  isCreateNewProjectOpen: boolean;
}

interface GeneratedDispatchProps {
  openCreateNewProjectDialog: () => void;
}

type Props = PassedProps & GeneratedDispatchProps & GeneratedStateProps;

const ProjectsSection = ({ projects, isLoading, openCreateNewProjectDialog, isCreateNewProjectOpen }: Props) => (
  <section className="container">
    <NewProjectDialog isOpen={isCreateNewProjectOpen} />
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
      {projects.map(project => (
        <div key={project.id!} className={classNames('col-xs-12', 'col-sm-6', 'col-md-4', styles['project-card'])}>
          <ProjectCard project={project} />
        </div>
      ))}
      {isLoading && (
        <div className={classNames('col-xs-12', 'col-sm-6', 'col-md-4', styles['project-card'])}>
          <LoadingIcon className={styles.loading} center />
        </div>
      )}
    </div>
  </section>
);

const mapStateToProps = (state: StateTree): GeneratedStateProps => ({
  isCreateNewProjectOpen: Modal.selectors.isModalOpenOfType(state, ModalType.NewProject),
});

const mapDispatchToProps = (dispatch: Dispatch<any>): GeneratedDispatchProps => ({
  openCreateNewProjectDialog: () => dispatch(Modal.actions.openModal(ModalType.NewProject)),
});

export default connect<GeneratedStateProps, GeneratedDispatchProps, PassedProps>(
  mapStateToProps,
  mapDispatchToProps
)(ProjectsSection);
