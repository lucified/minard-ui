import * as React from 'react';

import Icon = require('react-fontawesome');

import { Project } from '../../modules/projects';
import { selectText } from './helpers';

const styles: Styles = require('./setup-instructions.scss');

interface Styles {
  instructions: string;
  section: string;
  label: string;
  heading: string;
  'heading-icon': string;
  text: string;
  code: string;
  url: string;
}

interface Props {
  project: Project;
}

const CloneInstructions = ({ project }: Props) => {
  return (
    <div className={styles.instructions}>
      <div className={styles.section}>
        <div className={styles.heading}>
          <Icon className={styles['heading-icon']} name="clone" />
          Cloning the project
        </div>
        <div className={styles.text}>
          The URL for this project's Git repository is
          <div className={styles.url}>{project.repoUrl}</div>
        </div>

        <div>
          <div className={styles.text}>
            Clone the repository with
          </div>
          <div className={styles.code}>
            <pre onClick={selectText}>git clone -o minard {project.repoUrl}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CloneInstructions;
