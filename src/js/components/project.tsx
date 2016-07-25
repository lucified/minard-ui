import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import projects from '../modules/projects';

interface ProjectProps {
  id: string;
  name?: string;
}

const Project = ({ id, name }: ProjectProps) => (
  <div>
    <Link to={`/project/${id}`}>{name}</Link>
  </div>
);

const mapStateToProps = (state: any, ownProps: ProjectProps) => ({
  name: projects.selectors.getName(state, ownProps.id),
  id: ownProps.id, // Needed when using stateless classes: https://github.com/reactjs/react-redux/issues/290
});

export default connect(mapStateToProps)(Project);
