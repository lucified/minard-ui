import { StateTree } from '../../reducers';

import { StreamingState } from './types';

const selectStreamingTree = (state: StateTree): StreamingState => state.streaming;

export const getConnectionState = (state: StateTree) => selectStreamingTree(state).state;
export const getConnectionError = (state: StateTree) => selectStreamingTree(state).error;
