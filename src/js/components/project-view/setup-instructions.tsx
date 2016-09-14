import * as React from 'react';

import { Project } from '../../modules/projects';

const styles = require('./setup-instructions.scss');

interface Props {
  project: Project;
}

const SetupInstructions = ({ project }: Props) => (
  <div>
    <div className={styles.field}>
      <div className={styles.label}>
        Git repository
      </div>
      <div className={styles.instructions}>
        The URL for this project's repository is
        <div className={styles.url}>{project.repoUrl}</div>
      </div>
      <div className={styles.instructions}>
        Add it as a remote to your local repository with the following command:
      </div>
      <div className={styles.console}>
        <pre>git remote add {project.repoUrl}</pre>
      </div>
    </div>
    <div className={styles.field}>
      <div className={styles.label}>
        Building &amp; deployments
      </div>
      <div className={styles.instructions}>
        By default, Minard will simply use the root of your Git repository
        as the preview. You can change this behavior by including
        a <strong>minard.json</strong> file in your repository. It has the
        following format:
      </div>
      <div className={styles.console}>
        <pre>
{`{
  "publicRoot": "dist/",
  "build": {...}
}`}
        </pre>
      </div>
    </div>
  </div>
);

export default SetupInstructions;
