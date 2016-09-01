import 'isomorphic-fetch';

import { ApiPromise } from './types';

if (!process.env.CHARLES) {
  throw new Error('API host not defined!');
}

let host: string = process.env.CHARLES;
// Remove trailing /
if (host.slice(-1) === '/') {
  host = host.slice(0, -1);
}
const path: string = `${host}/api`;

const defaultOptions = {
  credentials: 'same-origin',
  headers: {
    Accept: 'application/vnd.api+json',
    'Content-Type': 'application/vnd.api+json',
  },
};

const connectToApi = (url: string, options: RequestInit = defaultOptions): ApiPromise =>
  fetch(url, options)
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
      error: error.message || 'Something bad happened',
    }));

export const getApi = (url: string): ApiPromise => connectToApi(url);

export const postApi = (url: string, payload: any): ApiPromise =>
  connectToApi(url, Object.assign({}, defaultOptions, { method: 'POST', body: JSON.stringify(payload) }));

export const patchApi = (url: string, payload: any): ApiPromise =>
  connectToApi(url, Object.assign({}, defaultOptions, { method: 'PATCH', body: JSON.stringify(payload) }));

export const fetchActivities = () => getApi(`${path}/activity`);
export const fetchActivitiesForProject = (id: string) => getApi(`${path}/activity?filter=project[${id}]`);
export const fetchAllProjects = () => getApi(`${path}/teams/1/projects`); // TODO: add actual team ID
export const fetchProject = (id: string) => getApi(`${path}/projects/${id}`);
export const fetchBranch = (id: string) => getApi(`${path}/branches/${id}`);
export const fetchDeployment = (id: string) => getApi(`${path}/deployments/${id}`);
export const fetchCommit = (id: string) => getApi(`${path}/commits/${id}`);
export const createProject = (name: string, description?: string) =>
  postApi(`${path}/projects`, {
    data: {
      type: 'projects',
      attributes: {
        name,
        description,
      },
      relationships: {
        team: {
          data: {
            type: 'teams',
            id: 1, // TODO: add actual team ID
          },
        },
      },
    },
  });

export const editProject = (id: string, newAttributes: { name?: string, description?: string }) =>
  patchApi(`${path}/projects/${id}`, {
    data: {
      type: 'projects',
      id,
      attributes: newAttributes,
    },
  });
