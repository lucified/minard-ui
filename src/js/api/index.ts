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
host = `${host}/api`;

const defaultOptions = {
  credentials: 'same-origin',
  headers: {
    Accept: 'application/vnd.api+json',
  },
};

interface Error {
  status: string;
  source?: any;
  title?: string;
  detail: string;
}

const connectToApi = (path: string, options?: RequestInit): ApiPromise =>
  fetch(`${host}${path}`, Object.assign({}, defaultOptions, options))
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
    .catch(errorResponse => {
      let error: string = errorResponse.message || 'An error occurred';
      let details: string = '';

      if (errorResponse && errorResponse.errors && errorResponse.errors.length > 0) {
        const errorTitles = new Set();
        errorResponse.errors.forEach((singleError: Error) => { errorTitles.add(singleError.title); });
        error = Array.from(errorTitles.values()).join(' & ');
        details = errorResponse.errors.map((singleError: Error) => singleError.detail).join('\n');
      }

      return {
        error,
        details,
      };
    });

const getApi = (path: string, query?: string): ApiPromise =>
  connectToApi(`${path}${query ? `?${encodeURIComponent(query)}` : ''}`);

const postApi = (path: string, payload: any): ApiPromise =>
  connectToApi(path, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
    },
    body: JSON.stringify(payload),
  });

const deleteApi = (path: string): ApiPromise =>
  connectToApi(path, { method: 'DELETE' });

const patchApi = (path: string, payload: any): ApiPromise =>
  connectToApi(path, {
    method: 'PATCH',
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
    },
    body: JSON.stringify(payload),
  });

export const fetchActivities = (): ApiPromise => getApi('/activity');
export const fetchActivitiesForProject = (id: string): ApiPromise => getApi('/activity', `filter=project[${id}]`);
export const fetchAllProjects = (): ApiPromise => getApi('/teams/1/projects'); // TODO: add actual team ID
export const fetchProject = (id: string): ApiPromise => getApi(`/projects/${id}`);
export const fetchBranch = (id: string): ApiPromise => getApi(`/branches/${id}`);
export const fetchDeployment = (id: string): ApiPromise => getApi(`/deployments/${id}`);
export const fetchCommit = (id: string): ApiPromise => getApi(`/commits/${id}`);

export const createProject = (name: string, description?: string): ApiPromise =>
  postApi('/projects', {
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

export const editProject = (id: string, newAttributes: { name?: string, description?: string }): ApiPromise =>
  patchApi(`/projects/${id}`, {
    data: {
      type: 'projects',
      id,
      attributes: newAttributes,
    },
  });

export const deleteProject = (id: string): ApiPromise => deleteApi(`/projects/${id}`);
