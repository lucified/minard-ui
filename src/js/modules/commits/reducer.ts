import * as moment from 'moment';
import { Reducer } from 'redux';

import { FetchError, isError } from '../errors';

import { COMMIT, STORE_COMMITS } from './actions';
import * as t from './types';

const initialState: t.CommitState = {};

const responseToStateShape = (commits: t.ApiResponse) => {
  const createCommitObject = (commit: t.ResponseCommitElement): t.Commit => {
    const commitMessageLines = commit.attributes.message.match(/[^\r\n]+/g);
    const commitMessage = commitMessageLines ? commitMessageLines[0] : '';
    const commitDescription = commitMessageLines && commitMessageLines.length > 1 ?
      commitMessageLines.slice(1).join('\n') : undefined;
    const deployments = commit.relationships.deployments;
    const latestDeployment = deployments && deployments.data && deployments.data[0] && deployments.data[0].id;

    return {
      id: commit.id,
      hash: commit.attributes.hash,
      message: commitMessage,
      description: commitDescription,
      deployment: latestDeployment,
      commiter: {
        name: commit.attributes.commiter.name,
        email: commit.attributes.commiter.email,
        timestamp: moment(commit.attributes.commiter.timestamp).valueOf(),
      },
      author: {
        name: commit.attributes.author.name,
        email: commit.attributes.author.email,
        timestamp: moment(commit.attributes.author.timestamp).valueOf(),
      },
    };
  };

  return commits.reduce((obj, commit) => Object.assign(obj, { [commit.id]: createCommitObject(commit) }), {});
};

const reducer: Reducer<t.CommitState> = (state = initialState, action: any) => {
  switch (action.type) {
    case COMMIT.SUCCESS:
      const commitResonse = (<t.RequestCommitRequestAction> action).response;
      if (commitResonse) {
        return Object.assign({}, state, responseToStateShape([commitResonse]));
      } else {
        return state;
      }
    case COMMIT.FAILURE:
      const responseAction = <FetchError> action;
      const existingEntity = state[responseAction.id!];
      if (!existingEntity || isError(existingEntity)) {
        return Object.assign({}, state, { [responseAction.id!]: responseAction });
      }

      console.log('Error: fetching failed! Not replacing existing entity.');
      return state;
    case STORE_COMMITS:
      const commits = (<t.StoreCommitsAction> action).entities;
      if (commits && commits.length > 0) {
        return Object.assign({}, state, responseToStateShape(commits));
      } else {
        return state;
      }
    default:
      return state;
  }
};

export default reducer;
