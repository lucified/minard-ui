import * as React from 'react';

import { Project } from '../../modules/projects';
import { selectText } from './helpers';

const styles: Styles = require('./setup-instructions.scss');

interface Styles {
  instructions: string;
  section: string;
  label: string;
  heading: string;
  text: string;
  code: string;
  url: string;
}

interface Props {
  project: Project;
}

const SetupInstructions = ({ project }: Props) => {
  return (
    <div className={styles.instructions}>
      <div className={styles.section}>
        <div className={styles.label}>
          Code repository
        </div>
        <div className={styles.text}>
          The URL for this project's Git repository is
          <div className={styles.url}>{project.repoUrl}</div>
        </div>

        <div className={styles.text}>
          Connect the repository on the command line in your project folder:
        </div>
        <div className={styles.code}>
          <pre onClick={selectText}>
            git remote add origin {project.repoUrl}<br />
          </pre>
        </div>

        <div className={styles.text}>
          Or, if you already use Git in your project, add Minard as a new remote:
        </div>
        <div className={styles.code}>
          <pre onClick={selectText}>
            git remote set-url ––add origin {project.repoUrl}
          </pre>
        </div>

        <div className={styles.label}>
          Building the project
        </div>

        <div className={styles.text}>
          By default, Minard will not build your project and will deploy a
          preview using the root of your git repository. You can enable
          builds and change the deployment root folder by including a
          minard.json file in your repository. It has the following format:
        </div>
        <div className={styles.code}>
          <pre onClick={selectText}>
{`{
  "publicRoot": "dist",
  "build": {
    "commands": ["npm install", "npm run build"],
    "cache": {
      "key": "%CI_PROJECT_PATH%",
      "paths": ["node_modules/"]
    }
  }
}`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default SetupInstructions;
