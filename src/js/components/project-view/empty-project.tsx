import * as React from 'react';

import { Project } from '../../modules/projects';

import SectionTitle from '../common/section-title';
import SetupInstructions from './setup-instructions';

const styles = require('./empty-project.scss');

interface Props {
  project: Project;
}

const EmptyProject = ({ project }: Props) => {
  return (
    <section className="container">
      <SectionTitle><span>Get started</span></SectionTitle>
      <div className="row center-xs">
        <div className="col-xs-12 col-md-8 col-lg-6">
          <SetupInstructions project={project} styles={styles} hideLabels={true} />
        </div>
      </div>
    </section>
  );
};

export default EmptyProject;
