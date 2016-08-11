import 'isomorphic-fetch';

if (!process.env.CHARLES) {
  throw new Error('API host not defined!');
}

let host: string = process.env.CHARLES;
// Remove trailing /
if (host.slice(-1) === '/') {
  host = host.slice(0, -1);
}
const path: string = `${host}/api`;

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

export const fetchActivities = () => callApi(`${path}/activity`);
export const fetchActivitiesForProject = (id: string) => callApi(`${path}/activity?filter=project[${id}]`);
export const fetchAllProjects = () => callApi(`${path}/teams/1/projects`); // TODO: add actual team ID
export const fetchProject = (id: string) => callApi(`${path}/projects/${id}`);
export const fetchBranch = (id: string) => callApi(`${path}/branches/${id}`);
export const fetchDeployment = (id: string) => callApi(`${path}/deployments/${id}`);
export const fetchCommit = (id: string) => callApi(`${path}/commits/${id}`);
