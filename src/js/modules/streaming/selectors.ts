import { StateTree } from '../../reducers';

import * as t from './types';

const selectStreamingTree = (state: StateTree): t.StreamingState => state.streaming;

export const getConnectionState = (state: StateTree) => selectStreamingTree(state).state;
export const getConnectionError = (state: StateTree) => selectStreamingTree(state).error;
