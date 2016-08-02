import { merge } from 'lodash';
import * as moment from 'moment';

import { STORE_COMMITS } from './actions';
import * as t from './types';

const initialState: t.CommitState = {};

const responseToStateShape = (commits: t.ApiResponse) => {
  const commitObjects: t.CommitState = {};

  commits.forEach(commit => {
    const commitMessageLines = commit.attributes.message.match(/[^\r\n]+/g);
    const commitMessage = commitMessageLines[0];
    const commitDescription = commitMessageLines.length > 1 ?
      commitMessageLines.slice(1).join('\n') : undefined;

    commitObjects[commit.id] = {
      hash: commit.id,
      message: commitMessage,
      description: commitDescription,
      branch: commit.relationships.branch.data.id,
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
  });

  return commitObjects;
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
