import * as React from 'react';
import Icon = require('react-fontawesome');

import { selectText } from '../../helpers';
import { Project } from '../../modules/projects';
import SectionTitle from '../common/section-title';

const styles = require('./empty-project.scss');

interface Props {
  project: Project;
}

const EmptyProject = ({ project }: Props) => {
  return (
    <section className="container">
      <SectionTitle><span>Get started</span></SectionTitle>
      <div className="row start-xs">
        <div className="col-xs-12 col-md-8 col-lg-6">
          <div className={styles.instructions}>
            <div className={styles.section}>
              <div className={styles.text}>
                The URL for this project's Git repository is
              </div>
              <div className={styles.code}>
                <pre onClick={selectText}>{project.repoUrl}</pre>
              </div>
              <div className={styles.heading}>
                <Icon className={styles['heading-icon']} name="laptop" />
                My project only exists on my computer
              </div>
              <div className={styles.text}>
                If your project folder is not already a Git repository, initialize
                it by running the following commands in the folder:
              </div>
              <div className={styles.code}>
                <pre>
                  git init   # Initialize the Git repository<br />
                  git add .  # Stage your existing files to a new commit<br />
                  git commit -m “First commit”
                </pre>
              </div>
              <div className={styles.text}>
                Add <code>minard</code> as a remote repository:
              </div>
              <div className={styles.code}>
                <pre>
                  git remote add minard {project.repoUrl}<br />
                  git push -u minard master
                </pre>
              </div>
              <div className={styles.text}>
                Now, whenever you push code to <code>minard</code>, Minard will create
                a new preview:
              </div>
              <div className={styles.code}>
                <pre onClick={selectText}>
                  git push minard master
                </pre>
              </div>

              <div className={styles.heading}>
                <Icon className={styles['heading-icon']} name="github" />
                My project is in GitHub or another remote Git repository
              </div>
              <div className={styles.text}>
                Add <code>minard</code> as a new remote and as a secondary <code>origin</code> URL with:
              </div>
              <div className={styles.code}>
                <pre>
                  git remote add minard {project.repoUrl}<br />
                  git remote set-url ––add origin {project.repoUrl}<br />
                  git push -u minard master
                </pre>
              </div>
              <div className={styles.text}>
                You will now get a new preview whenever you push code
                to <code>origin</code> or <code>minard</code>.
              </div>

              <div className={styles.heading}>
                <Icon className={styles['heading-icon']} name="cogs" />
                My project requires a build step
              </div>

              <div className={styles.text}>
                By default, Minard will not build your project. The preview will be
                the root of your git repository. You can enable builds and change
                the deployment root folder by including a <code>minard.json</code> file
                in your repository. It has the following format:
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
        </div>
      </div>
    </section>
  );
};

export default EmptyProject;
