import { Action } from './actions';
import { BranchState } from './types';

const initialState: BranchState = {
  1: {
    id: '1',
    name: 'First branch',
    description: 'This is a branch description',
  },
  2: {
    id: '2',
    name: 'Second branch',
  },
};

export default (state: BranchState = initialState, _action: Action) => {
  return state;
};
