import 'isomorphic-fetch';
import * as moment from 'moment';

import { logMessage } from '../logger';
import { getAccessToken } from './auth';
import { Api, ApiEntityResponse, ApiPreviewResponse, ApiResult, ApiTeam, SignupResponse } from './types';

if (!process.env.CHARLES) {
  throw new Error('API host not defined!');
}

let host: string = process.env.CHARLES;
// Remove trailing /
host = host.replace(/\/$/, '');

export const getBuildLogURL = (deploymentId: string): string =>
  `${host}/ci/deployments/${deploymentId}/trace`;

const defaultOptions: RequestInit = {
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

function generateErrorObject(errorResponse: any) {
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
    unauthorized: errorResponse.unauthorized,
  };
};

/**
 * This method will overwrite the Authorization header if an access token exists.
 */
function connectToApi<ResponseType>(path: string, options?: RequestInit): Promise<ApiResult<ResponseType>> {
  const combinedOptions = {
    ...defaultOptions,
    ...options,
  };

  const accessToken = getAccessToken();
  if (accessToken) {
    (combinedOptions.headers as any).Authorization = `Bearer ${accessToken}`;
  }

  return fetch(`${host}${path}`, combinedOptions)
    .then(
      response => response.json().then(json => ({
        json,
        response,
      })) as Promise<{ json: any, response: Response }>,
    ).then(({ json, response }) => {
      if (response.ok) {
        return json;
      }

      if (response.status === 401 || response.status === 403) {
        json.unauthorized = true;
      }

      return Promise.reject(json);
    }).then(
      json => ({ response: json }),
    ).catch(errorResponse => {
      logMessage('Error while calling API', { path, errorResponse }, 'info');

      return generateErrorObject(errorResponse);
    });
};

function getApi<ResponseType>(path: string, query?: any): Promise<ApiResult<ResponseType>> {
  let queryString = '';

  if (query) {
    queryString = '?';
    queryString += Object.keys(query).map(param => `${param}=${encodeURIComponent(query[param])}`).join('&');
  }

  return connectToApi<ResponseType>(`${path}${queryString}`);
};

function postApi<ResponseType>(path: string, payload: any): Promise<ApiResult<ResponseType>> {
  return connectToApi(path, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
    },
    body: JSON.stringify(payload),
  });
}

function deleteApi(path: string): Promise<ApiResult<{}>> {
  return connectToApi(path, { method: 'DELETE' });
}

function patchApi(path: string, payload: any): Promise<ApiResult<ApiEntityResponse>> {
  return connectToApi(path, {
    method: 'PATCH',
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
    },
    body: JSON.stringify(payload),
  });
}

const Activity = {
  fetchAll: (teamId: string, count: number, until?: number) => {
    const query: any = { count, filter: `team[${teamId}]` };

    if (until) {
      query.until = moment(until).toISOString();
    }

    return getApi<ApiEntityResponse>('/api/activity', query);
  },
  fetchAllForProject: (id: string, count: number, until?: number) => {
    const query: any = { count, filter: `project[${id}]` };

    if (until) {
      query.until = moment(until).toISOString();
    }

    return getApi<ApiEntityResponse>('/api/activity', query);
  },
};

const Branch = {
  fetch: (id: string) => getApi<ApiEntityResponse>(`/api/branches/${id}`),
  fetchForProject: (id: string) => getApi<ApiEntityResponse>(`/api/projects/${id}/relationships/branches`),
};

const Comment = {
  fetchForDeployment: (id: string) => getApi<ApiEntityResponse>(`/api/comments/deployment/${id}`),
  create: (deployment: string, message: string, email: string, name?: string) =>
    postApi<ApiEntityResponse>('/api/comments', {
      data: {
        type: 'comments',
        attributes: {
          email,
          name,
          message,
          deployment,
        },
      },
    }),
  delete: (id: string) => deleteApi(`/api/comments/${id}`),
};

const Commit = {
  fetch: (id: string) => getApi<ApiEntityResponse>(`/api/commits/${id}`),
  fetchForBranch: (id: string, count: number, until?: number) => {
    const query: any = { count };

    if (until) {
      query.until = moment(until).toISOString();
    }

    return getApi<ApiEntityResponse>(`/api/branches/${id}/relationships/commits`, query);
  },
};

const Deployment = {
  fetch: (id: string) => getApi<ApiEntityResponse>(`/api/deployments/${id}`),
};

const Project = {
  fetchAll: (teamId: string) => getApi<ApiEntityResponse>(`/api/teams/${teamId}/relationships/projects`),
  fetch: (id: string) => getApi<ApiEntityResponse>(`/api/projects/${id}`),
  create: (teamId: string, name: string, description?: string, projectTemplate?: string) =>
    postApi<ApiEntityResponse>('/api/projects', {
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
  edit: (id: string, newAttributes: { name?: string, description?: string }) =>
    patchApi(`/api/projects/${id}`, {
      data: {
        type: 'projects',
        id,
        attributes: newAttributes,
      },
    }),
  delete: (id: string) => deleteApi(`/api/projects/${id}`),
};

const Preview = {
  fetch: (id: string, commitHash: string) => getApi<ApiPreviewResponse>(`/api/preview/${id}`, { sha: commitHash }),
};

const Team = {
  fetch: () => connectToApi<ApiTeam>('/team', { credentials: 'include' }),
};

const User = {
  signup: () => connectToApi<SignupResponse>('/signup', { credentials: 'include' }),
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
