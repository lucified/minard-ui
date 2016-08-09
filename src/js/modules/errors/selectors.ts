import { StateTree } from '../../reducers';

const selectErrorTree = (state: StateTree) => state.errors;

export const getErrors = (state: StateTree) => selectErrorTree(state);
