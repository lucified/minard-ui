import 'isomorphic-fetch';

import { Api, ApiPromise } from './types';

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

const getApi = (path: string, query?: any): ApiPromise => {
  let queryString = '';

  if (query) {
    queryString = '?';
    queryString += Object.keys(query).map(param => `${param}=${encodeURIComponent(query[param])}`).join('&');
  }

  return connectToApi(`${path}${queryString}`);
};

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

const Activity = {
  fetchAll: (): ApiPromise => getApi('/activity'),
  fetchAllForProject: (id: string): ApiPromise => getApi('/activity', { filter: `project[${id}]`}),
};

const Branch = {
  fetch: (id: string): ApiPromise => getApi(`/branches/${id}`),
  fetchForProject: (id: string): ApiPromise => getApi(`/projects/${id}/relationships/branches`),
};

const Commit = {
  fetch: (id: string): ApiPromise => getApi(`/commits/${id}`),
  fetchForBranch: (id: string): ApiPromise => getApi(`/branches/${id}/relationships/commits`),
};

const Deployment = {
  fetch: (id: string): ApiPromise => getApi(`/deployments/${id}`),
};

const Project = {
  fetchAll: (): ApiPromise => getApi('/teams/1/projects'), // TODO: add actual team Id
  fetch: (id: string): ApiPromise => getApi(`/projects/${id}`),
  create: (name: string, description?: string): ApiPromise =>
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
    }),
  edit: (id: string, newAttributes: { name?: string, description?: string }): ApiPromise =>
    patchApi(`/projects/${id}`, {
      data: {
        type: 'projects',
        id,
        attributes: newAttributes,
      },
    }),
  delete: (id: string): ApiPromise => deleteApi(`/projects/${id}`),
};

const API: Api = {
  Activity,
  Branch,
  Commit,
  Deployment,
  Project,
};

export default API;
