import 'isomorphic-fetch';

import { Api, ApiEntityResponse, ApiPreviewResponse, ApiPromise } from './types';

console.log('Using bundled JSON files'); // tslint:disable-line:no-console

export const getBuildLogURL = (_deploymentId: string): string => '#';

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

function callApi(url: string) {
  return fetch(url, { credentials: 'same-origin' })
    .then(
      response => response.json().then(json => ({
        json,
        response,
      })) as Promise<{ json: any, response: any}>,
    ).then(
      ({ json, response }) => response.ok ? json : Promise.reject(json),
    ).then(
      json => ({ response: json }),
    ).catch(
      error => ({
        error: error.message || 'An error occurred',
        details: '',
      }),
    );
}

const Activity = {
  fetchAll: (_teamId: string, _count: number, _until?: number): ApiPromise<ApiEntityResponse> =>
    callApi(activitiesJSON),
  fetchAllForProject: (_id: string, _count: number, _until?: number): ApiPromise<ApiEntityResponse> =>
    callApi(activitiesJSON),
};

const Branch = {
  fetch: (id: string): ApiPromise<ApiEntityResponse> => callApi(branchJSON[id]),
  fetchForProject: (id: string): ApiPromise<ApiEntityResponse> => callApi(projectBranchesJSON[id]),
};

const Comment = {
  fetchForDeployment: (_id: string): ApiPromise<ApiEntityResponse> => callApi(commentsJSON),
  create: (_deployment: string, _message: string, _email: string, _name?: string): ApiPromise<ApiEntityResponse> =>
    callApi(newCommentJSON),
  delete: (_id: string): ApiPromise<{}> => Promise.resolve({ response: {} }),
};

const Commit = {
  fetch: (_id: string): ApiPromise<ApiEntityResponse> => callApi(commitJSON),
  fetchForBranch: (id: string, _count: number, _until?: number): ApiPromise<ApiEntityResponse> =>
    callApi(branchCommitsJSON[id]),
};

const Deployment = {
  fetch: (id: string): ApiPromise<ApiEntityResponse> => callApi(deploymentJSON[id]),
};

const Preview = {
  fetch: (_id: string, _commitHash: string): ApiPromise<ApiPreviewResponse> => callApi(previewJSON),
};

const Project = {
  fetchAll: (_teamId: string): ApiPromise<ApiEntityResponse> => callApi(allProjectsJSON),
  fetch: (id: string): ApiPromise<ApiEntityResponse> => callApi(projectJSON[id]),
  create: (_teamId: string, _name: string, _description?: string): ApiPromise<ApiEntityResponse> =>
    callApi(newProjectJSON),
  edit: (_id: string, _newAttributes: { name?: string, description?: string }): ApiPromise<ApiEntityResponse> =>
    callApi(editedProjectJSON),
  delete: (_id: string): ApiPromise<{}> => Promise.resolve({ response: {} }),
    // Promise.resolve({ error: 'sad face :(' });
};

const Team = {
  fetch: () => Promise.resolve({ response: { id: 3, name: 'Dev team' } }),
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
};

export default API;
