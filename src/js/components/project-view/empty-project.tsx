import * as React from 'react';

import Icon = require('react-fontawesome');

import { Project } from '../../modules/projects';
import SectionTitle from '../common/section-title';
import { selectText } from './helpers';

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
                <div className={styles.url}>{project.repoUrl}</div>
              </div>
              <div className={styles.heading}>
                <Icon className={styles['heading-icon']} name="file-o" />
                I'm starting a new project
              </div>
              <div className={styles.text}>
                Connect your project folder with
              </div>
              <div className={styles.code}>
                <pre onClick={selectText}>
                  git init<br />
                  git add .<br />
                  git commit -m “First commit”<br />
                  git remote add origin {project.repoUrl}<br />
                  git push -u origin master
                </pre>
              </div>

              <div className={styles.heading}>
                <Icon className={styles['heading-icon']} name="git-square" />
                My project is already in a Git repository
              </div>
              <div className={styles.text}>
                Add Minard as a new remote with
              </div>
              <div className={styles.code}>
                <pre onClick={selectText}>
                  git remote set-url ––add origin {project.repoUrl}<br />
                  git push -u origin master
                </pre>
              </div>

              <div className={styles.heading}>
                <Icon className={styles['heading-icon']} name="cogs" />
                My project requires a build step
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
        </div>
      </div>
    </section>
  );
};

export default EmptyProject;
