import * as React from 'react';

import { Project } from '../../modules/projects';

const defaultStyles: Styles = require('./setup-instructions.scss');

interface Styles {
  instructions: string;
  section: string;
  label: string;
  text: string;
  'smaller-text': string;
  code: string;
  url: string;
}

interface Props {
  project: Project;
  styles?: Styles;
  hideLabels?: boolean;
  showClone?: boolean;
}

const selectText = (e: React.MouseEvent<HTMLElement>) => {
  const node = e.target;
  const doc = document as any;

  if (doc.selection) {
    const range = doc.body.createTextRange();
    range.moveToElementText(node);
    range.select();
  } else if (window.getSelection) {
    const range = document.createRange();
    range.selectNodeContents(node as Node);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
  }
};

const SetupInstructions = ({ project, hideLabels, showClone, styles: passedInStyles }: Props) => {
  const styles = passedInStyles || defaultStyles;
  return (
    <div className={styles.instructions}>
      <div className={styles.section}>
        {!hideLabels && (
          <div className={styles.label}>
            Git repository
          </div>
        )}
        <div className={styles.text}>
          The URL for this project's Git repository is
          <div className={styles.url}>{project.repoUrl}</div>
        </div>
        {showClone && (
          <div>
            <div className={styles.text}>
              Clone the repo with
            </div>
            <div className={styles.code}>
              <pre onClick={selectText}>git clone -o minard {project.repoUrl}</pre>
            </div>
          </div>
        )}
        <div className={styles.text}>
          {showClone ?
            'Or you can add it as a remote to your existing repository with the following command.' :
            'Add it as a remote to your existing repository with the following command and start pushing some code.'
          }
        </div>
        <div className={styles.code}>
          <pre onClick={selectText}>git remote add minard {project.repoUrl}</pre>
        </div>
        <div className={styles.text}>
          If you use another repository (such as GitHub) as your origin, set up Git to automatically
          also push to Minard with the following command.
        </div>
        <div className={styles.code}>
          <pre onClick={selectText}>git remote set-url --add origin {project.repoUrl}</pre>
        </div>
      </div>
      <div className={styles.section}>
        {!hideLabels && (
          <div className={styles.label}>
            Building &amp; deployments
          </div>
        )}
        <div className={styles['smaller-text']}>
          By default, Minard will not build your project and will deploy
          a preview using the root of your Git repository. You can enable
          builds and change the root folder of what should be deployed by
          including a <strong>minard.json</strong> file in your
          repository. It has the following format:
        </div>
        <div className={styles.code}>
          <pre>
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
