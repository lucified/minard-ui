import { Action } from './actions';
import { ProjectState } from './types';

const initialState: ProjectState = {
  1: {
    id: '1',
    name: 'First project',
  },
  2: {
    id: '2',
    name: 'Second project',
  },
};

export default (state: ProjectState = initialState, _action: Action) => {
  return state;
};
