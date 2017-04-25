import 'isomorphic-fetch';

import { Api, ApiEntityResponse, ApiPreviewResponse, ApiResult, ApiTeam } from './types';

console.log('Using bundled JSON files'); // tslint:disable-line:no-console

const activitiesJSON = require('file-loader!../../../json/activities.json');
const allProjectsJSON = require('file-loader!../../../json/projects.json');
const projectJSON: { [id: string]: string } = {
  1: require('file-loader!../../../json/project-1.json'),
  2: require('file-loader!../../../json/project-2.json'),
};
const projectBranchesJSON: { [id: string]: string } = {
  1: require('file-loader!../../../json/project-1-branches.json'),
  2: require('file-loader!../../../json/project-2-branches.json'),
};
const branchJSON: { [id: string]: string } = {
  1: require('file-loader!../../../json/branch-1.json'),
  2: require('file-loader!../../../json/branch-2.json'),
  3: require('file-loader!../../../json/branch-3.json'),
};
const branchCommitsJSON: { [id: string]: string } = {
  1: require('file-loader!../../../json/branch-1-commits.json'),
  2: require('file-loader!../../../json/branch-2-commits.json'),
  3: require('file-loader!../../../json/branch-3-commits.json'),
};
const deploymentJSON: { [id: string]: string } = {
  7: require('file-loader!../../../json/deployment-7.json'),
  8: require('file-loader!../../../json/deployment-8.json'),
};
const commentsJSON = require('file-loader!../../../json/comments.json');
const newCommentJSON = require('file-loader!../../../json/new-comment.json');
const commitJSON = require('file-loader!../../../json/commit.json');
const newProjectJSON = require('file-loader!../../../json/new-project.json');
const editedProjectJSON = require('file-loader!../../../json/edited-project.json');
const previewJSON = require('file-loader!../../../json/preview.json');

async function fetchFile(url: string) {
  try {
    const response = await fetch(url, { credentials: 'same-origin' });
    const json = await response.json();

    if (response.ok) {
      return { response: json };
    }

    throw json;
  } catch (error) {
    return {
      error: error.message || 'An error occurred',
      details: '',
    };
  }
}

const Activity = {
  fetchAll: (_teamId: string, _count: number, _until?: number): Promise<ApiResult<ApiEntityResponse>> =>
    fetchFile(activitiesJSON),
  fetchAllForProject: (_id: string, _count: number, _until?: number): Promise<ApiResult<ApiEntityResponse>> =>
    fetchFile(activitiesJSON),
};

const Branch = {
  fetch: (id: string): Promise<ApiResult<ApiEntityResponse>> => fetchFile(branchJSON[id]),
  fetchForProject: (id: string): Promise<ApiResult<ApiEntityResponse>> => fetchFile(projectBranchesJSON[id]),
};

const Comment = {
  fetchForDeployment: (_id: string): Promise<ApiResult<ApiEntityResponse>> => fetchFile(commentsJSON),
  create: (
    _deployment: string,
    _message: string,
    _email: string,
    _name?: string,
  ): Promise<ApiResult<ApiEntityResponse>> =>
    fetchFile(newCommentJSON),
  delete: (_id: string): Promise<ApiResult<{}>> => Promise.resolve({ response: {} }),
};

const Commit = {
  fetch: (_id: string): Promise<ApiResult<ApiEntityResponse>> => fetchFile(commitJSON),
  fetchForBranch: (id: string, _count: number, _until?: number): Promise<ApiResult<ApiEntityResponse>> =>
    fetchFile(branchCommitsJSON[id]),
};

const Deployment = {
  fetch: (id: string): Promise<ApiResult<ApiEntityResponse>> => fetchFile(deploymentJSON[id]),
  fetchBuildLog: (_id: string): Promise<ApiResult<string>> => Promise.resolve({ response: 'Build log...' }),
};

const Preview = {
  fetch: (_id: string, _commitHash: string): Promise<ApiResult<ApiPreviewResponse>> => fetchFile(previewJSON),
};

const Project = {
  fetchAll: (_teamId: string): Promise<ApiResult<ApiEntityResponse>> => fetchFile(allProjectsJSON),
  fetch: (id: string): Promise<ApiResult<ApiEntityResponse>> => fetchFile(projectJSON[id]),
  create: (_teamId: string, _name: string, _description?: string): Promise<ApiResult<ApiEntityResponse>> =>
    fetchFile(newProjectJSON),
  edit: (_id: string, _newAttributes: { name?: string, description?: string }): Promise<ApiResult<ApiEntityResponse>> =>
    fetchFile(editedProjectJSON),
  delete: (_id: string): Promise<ApiResult<{}>> => Promise.resolve({ response: {} }),
    // Promise.resolve({ error: 'sad face :(' });
};

const Team = {
  fetch: () => Promise.resolve({
    response: { id: 3, name: 'Dev team' } as ApiTeam,
  }),
};

const User = {
  signup: () => Promise.resolve({
    response: {
      password: 'secretPassword',
      team: { id: 3, name: 'teamName' } as ApiTeam,
    },
  }),
};

const API: Api = {
  Activity,
  Branch,
  Comment,
  Commit,
  Deployment,
  Preview,
  Project,
  Team,
  User,
};

export default API;
