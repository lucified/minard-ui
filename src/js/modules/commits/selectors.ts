import { StateTree } from '../../reducers';

const selectCommitTree = (state: StateTree) => state.entities.commits;

export const getCommit = (state: StateTree, id: string) => selectCommitTree(state)[id];
