import { Action } from './actions';
import { BranchState } from './types';

const initialState: BranchState = {
  1: {
    id: '1',
    name: 'First branch',
    description: 'This is a branch description',
    commits: ['1-aacceeff02', '1-12354124', '1-2543452', '1-098325343', '1-29832572fc1', '1-29752a385'],
  },
  2: {
    id: '2',
    name: 'Second branch',
    commits: ['2-aacd00f02', '2-a998823423'],
  },
};

export default (state: BranchState = initialState, _action: Action) => {
  return state;
};
