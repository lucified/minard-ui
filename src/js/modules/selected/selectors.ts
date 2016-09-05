import { StateTree } from '../../reducers';

const selectSelectedTree = (state: StateTree) => state.selected;

export const getSelectedProject = (state: StateTree) => selectSelectedTree(state).project;
export const getSelectedBranch = (state: StateTree) => selectSelectedTree(state).branch;
export const isShowingAll = (state: StateTree) => selectSelectedTree(state).showAll;
