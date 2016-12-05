import { compact, isArray } from 'lodash';
import * as moment from 'moment';

import { logException } from '../logger';
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
        logException('Error parsing response object:', e, { responseEntity });

        return undefined;
      }
    })) as OutputType[];
  };

const splitCommitMessage = (rawMessage: string): { message: string, description?: string } => {
  const commitMessageLines = rawMessage.match(/[^\r\n]+/g);
  const message = commitMessageLines ? commitMessageLines[0] : '';
  const description = commitMessageLines && commitMessageLines.length > 1 ?
    commitMessageLines.slice(1).join('\n') : undefined;

  return {
    message,
    description,
  };
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

  // TODO: Remove this. used for debugging
  if (!isArray(project.attributes['active-committers'])) {
    console.error('activeUsers is not an array when creating project!', project.attributes['active-committers']);
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
  const { message, description } = splitCommitMessage(commit.message);

  return {
    id: activity.id,
    type: toActivityType(activity.attributes['activity-type']),
    project: activity.attributes.project,
    branch: activity.attributes.branch,
    commit: {
      id: commit.id,
      hash: commit.hash,
      message,
      description,
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
    commits: [],
    allCommitsLoaded: !latestCommit,
    latestCommit,
    latestSuccessfullyDeployedCommit,
  };
};

export const toBranches = toConvertedArray(createBranchObject);

// Commits
const createCommitObject = (commit: t.ResponseCommitElement): Commit => {
  const { message, description } = splitCommitMessage(commit.attributes.message);
  const deployments = commit.relationships && commit.relationships.deployments;
  const latestDeployment = deployments && deployments.data && deployments.data[0] && deployments.data[0].id;
  const committer = commit.attributes.committer;

  return {
    id: commit.id,
    hash: commit.attributes.hash,
    message,
    description,
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
