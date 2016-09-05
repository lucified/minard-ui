import 'isomorphic-fetch';

import { ApiPromise } from './types';

console.log('Using bundled JSON files'); // tslint:disable-line:no-console

const activitiesJSON = require('file!../../../json/activities.json');
const allProjectsJSON = require('file!../../../json/projects.json');
const projectJSON: { [id: string]: string } = {
  1: require('file!../../../json/project-1.json'),
  2: require('file!../../../json/project-2.json'),
};
const branchJSON: { [id: string]: string } = {
  1: require('file!../../../json/branch-1.json'),
  2: require('file!../../../json/branch-2.json'),
  3: require('file!../../../json/branch-3.json'),
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
      }))
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

export const Activity = {
  fetchAll: (): ApiPromise => callApi(activitiesJSON),
  fetchAllForProject: (id: string): ApiPromise => callApi(activitiesJSON),
};

export const Branch = {
  fetch: (id: string): ApiPromise => callApi(branchJSON[id]),
};

export const Commit = {
  fetch: (id: string): ApiPromise => callApi(commitJSON),
};

export const Deployment = {
  fetch: (id: string): ApiPromise => callApi(deploymentJSON[id]),
};

export const Project = {
  fetchAll: (): ApiPromise => callApi(allProjectsJSON),
  fetch: (id: string): ApiPromise => callApi(projectJSON[id]),
  create: (name: string, description?: string): ApiPromise => callApi(newProjectJSON),
  edit: (id: string, newAttributes: { name?: string, description?: string }): ApiPromise =>
    callApi(editedProjectJSON),
  delete: (id: string): ApiPromise => Promise.resolve({ response: 'ok!' }),
    // Promise.resolve({ error: 'sad face :(' });
};
