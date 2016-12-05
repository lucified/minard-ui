import 'isomorphic-fetch';
import * as moment from 'moment';

import { logMessage } from '../logger';
import { teamId } from './team-id';
import { Api, ApiEntityResponse, ApiPreviewResponse, ApiPromise } from './types';

if (!process.env.CHARLES) {
  throw new Error('API host not defined!');
}

let host: string = process.env.CHARLES;
// Remove trailing /
host = host.replace(/\/$/, '');

export const getBuildLogURL = (deploymentId: string): string =>
  `${host}/ci/deployments/${deploymentId}/trace`;

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

const generateErrorObject = (errorResponse: any) => {
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
};

const connectToApi = (path: string, options?: RequestInit): ApiPromise<ApiEntityResponse | ApiPreviewResponse> =>
  fetch(`${host}${path}`, Object.assign({}, defaultOptions, options))
    .then(
      response => response.json().then(json => ({
        json,
        response,
      })) as Promise<{ json: any, response: IResponse}>,
    ).then(
      ({ json, response }) => response.ok ? json : Promise.reject(json),
    ).then(
      json => ({ response: json }),
    ).catch(errorResponse => {
      logMessage('Error while calling API', { errorResponse }, 'info');

      return generateErrorObject(errorResponse);
    });

const getApi = (path: string, query?: any): ApiPromise<ApiEntityResponse | ApiPreviewResponse> => {
  let queryString = '';

  if (query) {
    queryString = '?';
    queryString += Object.keys(query).map(param => `${param}=${encodeURIComponent(query[param])}`).join('&');
  }

  return connectToApi(`${path}${queryString}`);
};

const postApi = (path: string, payload: any): ApiPromise<ApiEntityResponse | ApiPreviewResponse> =>
  connectToApi(path, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
    },
    body: JSON.stringify(payload),
  });

const deleteApi = (path: string): ApiPromise<{}> =>
  connectToApi(path, { method: 'DELETE' });

const patchApi = (path: string, payload: any): ApiPromise<ApiEntityResponse> =>
  connectToApi(path, {
    method: 'PATCH',
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
    },
    body: JSON.stringify(payload),
  });

const Activity = {
  fetchAll: (count: number, until?: number): ApiPromise<ApiEntityResponse> => {
    const query: any = { count, filter: `team[${teamId}]` };

    if (until) {
      query.until = moment(until).toISOString();
    }

    return getApi('/api/activity', query);
  },
  fetchAllForProject: (id: string, count: number, until?: number): ApiPromise<ApiEntityResponse> => {
    const query: any = { count, filter: `project[${id}]` };

    if (until) {
      query.until = moment(until).toISOString();
    }

    return getApi('/api/activity', query);
  },
};

const Branch = {
  fetch: (id: string): ApiPromise<ApiEntityResponse> => getApi(`/api/branches/${id}`),
  fetchForProject: (id: string): ApiPromise<ApiEntityResponse> => getApi(`/api/projects/${id}/relationships/branches`),
};

const Commit = {
  fetch: (id: string): ApiPromise<ApiEntityResponse> => getApi(`/api/commits/${id}`),
  fetchForBranch: (id: string, count: number, until?: number): ApiPromise<ApiEntityResponse> => {
    const query: any = { count };

    if (until) {
      query.until = moment(until).toISOString();
    }

    return getApi(`/api/branches/${id}/relationships/commits`, query);
  },
};

const Deployment = {
  fetch: (id: string): ApiPromise<ApiEntityResponse> => getApi(`/api/deployments/${id}`),
};

const Project = {
  fetchAll: (): ApiPromise<ApiEntityResponse> => getApi(`/api/teams/${teamId}/relationships/projects`),
  fetch: (id: string): ApiPromise<ApiEntityResponse> => getApi(`/api/projects/${id}`),
  create: (name: string, description?: string, projectTemplate?: string): ApiPromise<ApiEntityResponse> =>
    postApi('/api/projects', {
      data: {
        type: 'projects',
        attributes: {
          name,
          description,
          templateProjectId: projectTemplate,
        },
        relationships: {
          team: {
            data: {
              type: 'teams',
              id: teamId,
            },
          },
        },
      },
    }),
  edit: (id: string, newAttributes: { name?: string, description?: string }): ApiPromise<ApiEntityResponse> =>
    patchApi(`/api/projects/${id}`, {
      data: {
        type: 'projects',
        id,
        attributes: newAttributes,
      },
    }),
  delete: (id: string): ApiPromise<{}> => deleteApi(`/api/projects/${id}`),
};

const Preview = {
  fetch: (id: string): ApiPromise<ApiPreviewResponse> => getApi(`/api/preview/${id}`),
};

const API: Api = {
  Activity,
  Branch,
  Commit,
  Deployment,
  Preview,
  Project,
};

export default API;
