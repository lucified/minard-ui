import { merge } from 'lodash';
import * as moment from 'moment';

import { STORE_COMMITS } from './actions';
import * as t from './types';

const initialState: t.CommitState = {};

const responseToStateShape = (commits: t.ApiResponse) => {
  const createCommitObject = (commit: t.ResponseCommitElement): t.Commit => {
    const commitMessageLines = commit.attributes.message.match(/[^\r\n]+/g);
    const commitMessage = commitMessageLines[0];
    const commitDescription = commitMessageLines.length > 1 ?
      commitMessageLines.slice(1).join('\n') : undefined;
    const deployments = commit.relationships.deployments;
    const latestDeployment = deployments && deployments.data && deployments.data[0] && deployments.data[0].id;

    return {
      hash: commit.id,
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

  return commits.reduce((obj, commit) => merge(obj, { [commit.id]: createCommitObject(commit) }), {});
};

export default (state: t.CommitState = initialState, action: any) => {
  switch (action.type) {
    case STORE_COMMITS:
      const commits = (<t.StoreCommitsAction> action).commits;
      return merge({}, state, responseToStateShape(commits));
    default:
      return state;
  }
};
