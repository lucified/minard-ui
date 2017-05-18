import { StateTree } from '../../reducers';
import { FetchError } from '../errors';

import { Deployment } from './types';

const selectDeploymentTree = (state: StateTree) => state.entities.deployments;

export const getDeployment = (state: StateTree, id: string): Deployment | FetchError | undefined =>
  selectDeploymentTree(state)[id];
