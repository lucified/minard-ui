import 'isomorphic-fetch';

if (!process.env.CHARLES) {
  throw new Error('API host not defined!');
}

const host: string = `${process.env.CHARLES}/api`;

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
      error: error.message || 'Something bad happened',
    }));
}

export const fetchActivities = () => callApi(`${host}/activity`);
export const fetchActivitiesForProject = (id: string) => callApi(`${host}/activity?filter=project[${id}]`);
export const fetchAllProjects = () => callApi(`${host}/teams/1/projects`); // TODO: add actual team ID
export const fetchProject = (id: string) => callApi(`${host}/projects/${id}`);
export const fetchBranch = (id: string) => callApi(`${host}/branches/${id}`);
export const fetchDeployment = (id: string) => callApi(`${host}/deployments/${id}`);
export const fetchCommit = (id: string) => callApi(`${host}/commits/${id}`);
