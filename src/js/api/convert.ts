import { compact } from 'lodash';
import * as moment from 'moment';

import { logException } from '../logger';
import { Activity, ActivityType } from '../modules/activities';
import { Branch } from '../modules/branches';
import { Comment } from '../modules/comments';
import { Commit } from '../modules/commits';
import { Deployment, toDeploymentStatus } from '../modules/deployments';
import { Project } from '../modules/projects';
import {
  ResponseActivityElement,
  ResponseBranchElement,
  ResponseCommentElement,
  ResponseCommitElement,
  ResponseDeploymentElement,
  ResponseProjectElement,
} from './types';

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
const createProjectObject = (project: ResponseProjectElement): Project => {
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
    token: project.attributes.token,
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

const createActivityObject = (activity: ResponseActivityElement): Activity => {
  const type = toActivityType(activity.attributes['activity-type']);
  const { commit, deployment, project, branch, timestamp } = activity.attributes;
  const { message, description } = splitCommitMessage(commit.message);

  const activityObject: Activity = {
    id: activity.id,
    type,
    project,
    branch,
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
      token: deployment.token,
    },
    timestamp: moment(timestamp).valueOf(),
  };

  if (type === ActivityType.Comment) {
    activityObject.comment = { ...activity.attributes.comment };
  }

  return activityObject;
};

export const toActivities = toConvertedArray(createActivityObject);

// Branches
const createBranchObject = (branch: ResponseBranchElement): Branch => {
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
    token: branch.attributes.token,
  };
};

export const toBranches = toConvertedArray(createBranchObject);

// Comments
const createCommentObject = (comment: ResponseCommentElement): Comment => {
  const { id } = comment;
  const { name, email, message, 'created-at': timestamp, deployment } = comment.attributes;

  return {
    id,
    message,
    email,
    name,
    timestamp: moment(timestamp).valueOf(),
    deployment,
  };
};

export const toComments = toConvertedArray(createCommentObject);

// Commits
const createCommitObject = (commit: ResponseCommitElement): Commit => {
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
const createDeploymentObject = (deployment: ResponseDeploymentElement): Deployment => ({
  id: deployment.id,
  status: toDeploymentStatus(deployment.attributes.status),
  url: deployment.attributes.url,
  screenshot: deployment.attributes.screenshot,
  commentCount: deployment.attributes['comment-count'],
  creator: {
    name: deployment.attributes.creator.name,
    email: deployment.attributes.creator.email,
    timestamp: moment(deployment.attributes.creator.timestamp).valueOf(),
  },
  token: deployment.attributes.token,
});

export const toDeployments = toConvertedArray(createDeploymentObject);
