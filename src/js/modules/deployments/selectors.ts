import { StateTree } from '../../reducers';
import { FetchError } from '../errors';

import * as t from './types';

const selectDeploymentTree = (state: StateTree) => state.entities.deployments;

export const getDeployment = (state: StateTree, id: string): t.Deployment | FetchError | undefined =>
  selectDeploymentTree(state)[id];
