import 'isomorphic-fetch';

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

export const fetchActivities = () => callApi(activitiesJSON);
export const fetchActivitiesForProject = (id: string) => callApi(activitiesJSON);
export const fetchAllProjects = () => callApi(allProjectsJSON);
export const fetchProject = (id: string) => callApi(projectJSON[id]);
export const fetchBranch = (id: string) => callApi(branchJSON[id]);
export const fetchDeployment = (id: string) => callApi(deploymentJSON[id]);
export const fetchCommit = (id: string) => callApi(commitJSON);
export const createProject = (name: string, description?: string) => callApi(newProjectJSON);
export const editProject = (id: string, newAttributes: { name?: string, description?: string}) =>
  callApi(editedProjectJSON);
export const deleteProject = (id: string) => Promise.resolve({ response: 'ok!' });
// export const deleteProject = (id: string) => Promise.resolve({ error: 'sad face :(' });
