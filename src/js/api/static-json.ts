import 'isomorphic-fetch';

import { Api, ApiPromise } from './types';

console.log('Using bundled JSON files'); // tslint:disable-line:no-console

export const getBuildLogURL = (deploymentId: string): string => '#';

const activitiesJSON = require('file!../../../json/activities.json');
const allProjectsJSON = require('file!../../../json/projects.json');
const projectJSON: { [id: string]: string } = {
  1: require('file!../../../json/project-1.json'),
  2: require('file!../../../json/project-2.json'),
};
const projectBranchesJSON: { [id: string]: string } = {
  1: require('file!../../../json/project-1-branches.json'),
  2: require('file!../../../json/project-2-branches.json'),
};
const branchJSON: { [id: string]: string } = {
  1: require('file!../../../json/branch-1.json'),
  2: require('file!../../../json/branch-2.json'),
  3: require('file!../../../json/branch-3.json'),
};
const branchCommitsJSON: { [id: string]: string } = {
  1: require('file!../../../json/branch-1-commits.json'),
  2: require('file!../../../json/branch-2-commits.json'),
  3: require('file!../../../json/branch-3-commits.json'),
};
const deploymentJSON: { [id: string]: string } = {
  7: require('file!../../../json/deployment-7.json'),
  8: require('file!../../../json/deployment-8.json'),
};
const commitJSON = require('file!../../../json/commit.json');
const newProjectJSON = require('file!../../../json/new-project.json');
const editedProjectJSON = require('file!../../../json/edited-project.json');

function callApi(url: string) {
  return fetch(url, { credentials: 'same-origin' })
    .then(response =>
      response.json().then(json => ({
        json,
        response,
      })) as Promise<{ json: any, response: IResponse}>
    ).then(({ json, response }) =>
      response.ok ? json : Promise.reject(json)
    ).then(json => ({
      response: json,
    }))
    .catch(error => ({
      error: error.message || 'An error occurred',
      details: '',
    }));
}

const Activity = {
  fetchAll: (count: number, until?: number): ApiPromise => callApi(activitiesJSON),
  fetchAllForProject: (id: string, count: number, until?: number): ApiPromise => callApi(activitiesJSON),
};

const Branch = {
  fetch: (id: string): ApiPromise => callApi(branchJSON[id]),
  fetchForProject: (id: string): ApiPromise => callApi(projectBranchesJSON[id]),
};

const Commit = {
  fetch: (id: string): ApiPromise => callApi(commitJSON),
  fetchForBranch: (id: string, count: number, until?: number): ApiPromise => callApi(branchCommitsJSON[id]),
};

const Deployment = {
  fetch: (id: string): ApiPromise => callApi(deploymentJSON[id]),
};

const Project = {
  fetchAll: (): ApiPromise => callApi(allProjectsJSON),
  fetch: (id: string): ApiPromise => callApi(projectJSON[id]),
  create: (name: string, description?: string): ApiPromise => callApi(newProjectJSON),
  edit: (id: string, newAttributes: { name?: string, description?: string }): ApiPromise =>
    callApi(editedProjectJSON),
  delete: (id: string): ApiPromise => Promise.resolve({ response: { data: [] } }),
    // Promise.resolve({ error: 'sad face :(' });
};

const API: Api = {
  Activity,
  Branch,
  Commit,
  Deployment,
  Project,
};

export default API;
