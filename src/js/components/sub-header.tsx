import * as classNames from 'classnames';
import * as React from 'react';
import * as Icon from 'react-fontawesome';
import { connect } from 'react-redux';

import { FetchError, isError } from '../modules/errors';
import Projects, { Project } from '../modules/projects';
import { StateTree } from '../reducers';
import MinardLink from './common/minard-link';

const styles = require('./sub-header.scss');

interface PassedProps {
  params: any;
}

interface GeneratedProps {
  teamName?: string;
  project?: Project | FetchError;
}

const classForType = (type: string): string => {
  switch (type) {
    case 'branch':
    case 'project':
      return 'start-xs';
    case 'projects':
      return 'center-xs';
    default:
      return 'start-xs';
  }
};

const getHeaderType = (params: any) => {
  if (params.projectId !== undefined) {
    if (params.branchId !== undefined) {
      return 'branch';
    }

    return 'project';
  }

  return 'projects';
};

class SubHeader extends React.Component<PassedProps & GeneratedProps, any> {
  public render() {
    const { params, project, teamName } = this.props;
    const headerType = getHeaderType(params);
    let content: JSX.Element | null = null;

    if (headerType === 'branch' && project && !isError(project)) {
      content = <MinardLink className={styles['sub-header-link']} project={project}>‹ {project.name}</MinardLink>;
    } else if (headerType === 'project' && teamName) {
      content = <MinardLink className={styles['sub-header-link']} homepage>‹ {teamName}</MinardLink>;
    } else if (headerType === 'projects') {
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
            <div className={classNames(styles['sub-header'], classForType(headerType), 'col-xs-12')}>
              {content}
            </div>
          </div>
        </div>
      </section>
    );
  }
};

const mapStateToProps = (state: StateTree, ownProps: PassedProps): GeneratedProps => {
  const { projectId } = ownProps.params;
  const headerType = getHeaderType(ownProps.params);
  if (headerType === 'branch') {
    return { project: Projects.selectors.getProject(state, projectId) };
  }

  return { teamName: 'Team Lucify' }; // TODO: use actual team name
};

export default connect<GeneratedProps, {}, PassedProps>(mapStateToProps)(SubHeader);
