import * as React from 'react';

import { selectText } from '../../helpers';
import { Project } from '../../modules/projects';

const styles = require('./setup-instructions.scss');

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
        </div>
        <div className={styles.code}>
          <pre onClick={selectText}>{project.repoUrl}</pre>
        </div>

        <div>
          <div className={styles.text}>
            Clone the repository with
          </div>
          <div className={styles.code}>
            <pre onClick={selectText}>git clone -o minard {project.repoUrl}</pre>
          </div>
        </div>

        <div className={styles.text}>
          …Or connect your existing project folder with
        </div>
        <div className={styles.code}>
          <pre>
            git init<br />
            git add .<br />
            git commit -m “First commit”<br />
            git remote add origin {project.repoUrl}<br />
            git push -u origin master
          </pre>
        </div>

        <div className={styles.text}>
          …Or, if you already use GitHub or another remote repository in your project, add Minard as a new remote with
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
