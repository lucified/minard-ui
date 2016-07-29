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

export const fetchProjects = () => callApi(projectsJSON);
export const fetchCommits = (_branch: string) => callApi(commitsJSON);
export const fetchBranches = (_project: string) => callApi(branchesJSON);
export const fetchDeployments = () => callApi(deploymentsJSON);
