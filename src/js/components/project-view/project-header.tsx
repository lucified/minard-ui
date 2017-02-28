import * as classNames from 'classnames';
import * as React from 'react';
import Icon = require('react-fontawesome');
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import Modal, { ModalType } from '../../modules/modal';
import { Project } from '../../modules/projects';

import Avatar from '../common/avatar';

const styles = require('./project-header.scss');

interface PassedProps {
  project: Project;
}

interface GeneratedDispatchProps {
  openProjectSettingsDialog: (e: React.MouseEvent<HTMLElement>) => void;
}

const ProjectHeader = ({ project, openProjectSettingsDialog }: PassedProps & GeneratedDispatchProps) => (
  <section className="container">
    <div className={classNames(styles.avatars, 'row', 'top-xs')}>
      <div className="col-xs-12 center-xs">
        {project.activeUsers.map(user => (
          <Avatar
            key={user.email}
            className={styles.avatar}
            email={user.email}
            title={user.name || user.email}
            shadow
          />
        ))}
      </div>
    </div>
    <div className="row top-xs">
      <div className="col-xs-12 col-sm-offset-2 col-sm-8 center-xs">
        <h1 className={styles.title}>{project.name}</h1>
        <p className={styles.description}>{project.description}</p>
      </div>
      <div className="col-sm-2 col-xs-12 end-sm center-xs">
        <a onClick={openProjectSettingsDialog} className={styles.settings}>
          <Icon className={styles.icon} name="gear" /> Project settings
        </a>
      </div>
    </div>
  </section>
);

const mapDispatchToProps = (dispatch: Dispatch<any>): GeneratedDispatchProps => ({
  openProjectSettingsDialog: (_e: React.MouseEvent<HTMLElement>) => {
    dispatch(Modal.actions.openModal(ModalType.ProjectSettings));
  },
});

export default connect<{}, GeneratedDispatchProps, PassedProps>(
  () => ({}),
  mapDispatchToProps,
)(ProjectHeader);
