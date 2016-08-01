import 'isomorphic-fetch';

const projectsJSON = require('file!../../../json/projects.json');
const commitsJSON = require('file!../../../json/commits.json');
const deploymentsJSON = require('file!../../../json/deployments.json');
const branchesJSON = require('file!../../../json/branches.json');

function callApi(url: string) {
  return fetch(url)
    .then(response =>
      response.json().then(json => ({ json, response }))
    ).then(({ json, response }) => {
      if (!response.ok) {
        return Promise.reject(json);
      }

      return json;
    })
    .then(
      response => ({ response }),
      error => ({ error: error.message || 'Something bad happened' }),
    );
}

// TODO: call actual endpoints
export const fetchProjects = () => callApi(projectsJSON);
export const fetchProject = (_id: string) => callApi(projectsJSON);
export const fetchCommits = (_branch: string) => callApi(commitsJSON); // TODO: Remove?
export const fetchBranch = (_project: string) => callApi(branchesJSON);
export const fetchDeployment = () => callApi(deploymentsJSON);
