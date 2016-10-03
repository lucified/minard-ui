import * as compact from 'lodash/compact';
import * as moment from 'moment';

import { Activity, ActivityType } from '../modules/activities';
import { Branch } from '../modules/branches';
import { Commit } from '../modules/commits';
import { Deployment, toDeploymentStatus } from '../modules/deployments';
import { Project } from '../modules/projects';

import * as t from './types';

const toConvertedArray = <InputType, OutputType>(converter: (response: InputType) => OutputType) =>
  (response: InputType[] | InputType): OutputType[] => {
    let responseEntities = response;
    if (!(responseEntities instanceof Array)) {
      responseEntities = [responseEntities];
    }

    return compact(responseEntities.map(responseEntity => {
      try {
        return converter(responseEntity);
      } catch (e) {
        console.log('Error parsing response object:', responseEntity, e); // tslint:disable-line:no-console
        return undefined;
      }
    })) as OutputType[];
  };

// Projects
const createProjectObject = (project: t.ResponseProjectElement): Project => {
  const latestSuccessfullyDeployedCommitObject: { data?: { id: string }} | undefined = project.relationships &&
    project.relationships['latest-successfully-deployed-commit'];
  const latestSuccessfullyDeployedCommit: string | undefined = latestSuccessfullyDeployedCommitObject &&
    latestSuccessfullyDeployedCommitObject.data &&
    latestSuccessfullyDeployedCommitObject.data.id;

  const latestActivityTimestampString = project.attributes['latest-activity-timestamp'];
  let latestActivityTimestamp: number | undefined;

  if (latestActivityTimestampString) {
    latestActivityTimestamp = moment(latestActivityTimestampString).valueOf();
  }

  return {
    id: project.id,
    name: project.attributes.name,
    description: project.attributes.description,
    activeUsers: project.attributes['active-committers'],
    latestActivityTimestamp,
    latestSuccessfullyDeployedCommit,
    repoUrl: project.attributes['repo-url'],
  };
};

export const toProjects = toConvertedArray(createProjectObject);

// Activities
const toActivityType = (activityString: string): ActivityType => {
  switch (activityString) {
    case 'deployment':
      return ActivityType.Deployment;
    case 'comment':
      return ActivityType.Comment;
    default:
      throw new Error('Unknown activity type!');
  }
};

const createActivityObject = (activity: t.ResponseActivityElement): Activity => {
  const commit = activity.attributes.commit;
  const deployment = activity.attributes.deployment;

  return {
    id: activity.id,
    type: toActivityType(activity.attributes['activity-type']),
    project: activity.attributes.project,
    branch: activity.attributes.branch,
    commit: {
      id: commit.id,
      hash: commit.hash,
      message: commit.message,
      author: {
        name: commit.author.name,
        email: commit.author.email,
        timestamp: moment(commit.author.timestamp).valueOf(),
      },
      committer: {
        name: commit.committer.name,
        email: commit.committer.email,
        timestamp: moment(commit.committer.timestamp).valueOf(),
      },
      deployment: commit.deployments && commit.deployments.length > 0 ? commit.deployments[0] : undefined,
    },
    deployment: {
      status: toDeploymentStatus(deployment.status),
      id: deployment.id,
      url: deployment.url,
      screenshot: deployment.screenshot,
      creator: {
        name: deployment.creator.name,
        email: deployment.creator.email,
        timestamp: moment(deployment.creator.timestamp).valueOf(),
      },
    },
    timestamp: moment(activity.attributes.timestamp).valueOf(),
  };
};

export const toActivities = toConvertedArray(createActivityObject);

// Branches
const createBranchObject = (branch: t.ResponseBranchElement): Branch => {
  const latestSuccessfullyDeployedCommitObject: { data?: { id: string }} | undefined = branch.relationships &&
    branch.relationships['latest-successfully-deployed-commit'];
  const latestSuccessfullyDeployedCommit: string | undefined = latestSuccessfullyDeployedCommitObject &&
    latestSuccessfullyDeployedCommitObject.data &&
    latestSuccessfullyDeployedCommitObject.data.id;

  const latestCommitObject: { data?: { id: string }} | undefined = branch.relationships &&
    branch.relationships['latest-commit'];
  const latestCommit: string | undefined = latestCommitObject &&
    latestCommitObject.data &&
    latestCommitObject.data.id;

  const commits: string[] = [];
  // Make sure latestSuccessfullyDeployedCommit and latestCommit are included in the list
  if (latestCommit) {
    commits.push(latestCommit);
  }
  if (latestSuccessfullyDeployedCommit && latestSuccessfullyDeployedCommit !== latestCommit) {
    commits.push(latestSuccessfullyDeployedCommit);
  }

  const latestActivityTimestampString = branch.attributes['latest-activity-timestamp'];
  let latestActivityTimestamp: number | undefined;

  if (latestActivityTimestampString) {
    latestActivityTimestamp = moment(latestActivityTimestampString).valueOf();
  }

  let errors: string[] = [];
  if (branch.attributes['minard-json'] && branch.attributes['minard-json']!.errors &&
    branch.attributes['minard-json']!.errors!.length > 0) {
    errors = errors.concat(branch.attributes['minard-json']!.errors!);
  }

  return {
    id: branch.id,
    name: branch.attributes.name,
    description: branch.attributes.description,
    project: branch.relationships.project.data.id,
    buildErrors: errors,
    latestActivityTimestamp,
    commits,
    allCommitsLoaded: commits.length === 0,
    latestCommit,
    latestSuccessfullyDeployedCommit,
  };
};

export const toBranches = toConvertedArray(createBranchObject);

// Commits
const createCommitObject = (commit: t.ResponseCommitElement): Commit => {
  const commitMessageLines = commit.attributes.message.match(/[^\r\n]+/g);
  const commitMessage = commitMessageLines ? commitMessageLines[0] : '';
  const commitDescription = commitMessageLines && commitMessageLines.length > 1 ?
    commitMessageLines.slice(1).join('\n') : undefined;
  const deployments = commit.relationships && commit.relationships.deployments;
  const latestDeployment = deployments && deployments.data && deployments.data[0] && deployments.data[0].id;
  const committer = commit.attributes.committer;

  return {
    id: commit.id,
    hash: commit.attributes.hash,
    message: commitMessage,
    description: commitDescription,
    deployment: latestDeployment,
    committer: {
      name: committer.name,
      email: committer.email,
      timestamp: moment(committer.timestamp).valueOf(),
    },
    author: {
      name: commit.attributes.author.name,
      email: commit.attributes.author.email,
      timestamp: moment(commit.attributes.author.timestamp).valueOf(),
    },
  };
};

export const toCommits = toConvertedArray(createCommitObject);

// Deployments
const createDeploymentObject = (deployment: t.ResponseDeploymentElement): Deployment => ({
  id: deployment.id,
  status: toDeploymentStatus(deployment.attributes.status),
  url: deployment.attributes.url,
  screenshot: deployment.attributes.screenshot,
  creator: {
    name: deployment.attributes.creator.name,
    email: deployment.attributes.creator.email,
    timestamp: moment(deployment.attributes.creator.timestamp).valueOf(),
  },
});

export const toDeployments = toConvertedArray(createDeploymentObject);
