import { StateTree } from '../../reducers';

const selectDeploymentTree = (state: StateTree) => state.entities.deployments;

export const getDeployment = (state: StateTree, id: string) => selectDeploymentTree(state)[id];
