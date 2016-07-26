import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import projects from '../modules/projects';

interface PassedProps {
  id: string;
}

interface GeneratedProps {
  name: string;
}

const Project = ({ id, name }: PassedProps & GeneratedProps) => (
  <div>
    <Link to={`/project/${id}`}>{name}</Link>
  </div>
);

const mapStateToProps = (state: any, ownProps: PassedProps) => ({
  name: projects.selectors.getName(state, ownProps.id)
});

export default connect<GeneratedProps, {}, PassedProps>(mapStateToProps)(Project);
