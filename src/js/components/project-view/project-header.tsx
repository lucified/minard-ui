import * as classNames from 'classnames';
import * as React from 'react';
import * as Icon from 'react-fontawesome';

import { Project } from '../../modules/projects';

import Avatar from '../common/avatar';

const styles = require('./project-header.scss');

interface Props {
  project: Project;
}

class ProjectHeader extends React.Component<Props, any> {
  public render() {
    const { project } = this.props;

    return (
      <section className="container">
        <div className={classNames(styles.avatars, 'row', 'top-xs')}>
          <div className="col-xs-12 center-xs">
            {project.activeUsers.map(user =>
              <Avatar
                key={user.email}
                className={styles.avatar}
                email={user.email}
                title={user.name || user.email}
                shadow
              />
            )}
          </div>
        </div>
        <div className="row top-xs">
          <div className="col-xs-12 col-sm-offset-2 col-sm-8 center-xs">
            <h1 className={styles.title}>{project.name}</h1>
            <p className={styles.description}>{project.description}</p>
          </div>
          <div className="col-sm-2 col-xs-12 end-sm center-xs">
            <a className={styles.settings} href="#">
              <Icon className={styles.icon} name="gear" /> Project settings
            </a>
          </div>
        </div>
      </section>
    );
  }
}

export default ProjectHeader;
