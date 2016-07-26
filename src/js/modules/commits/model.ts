import * as t from './types';

export const getCommit = (commits: t.CommitState, id: string) => commits[id];
