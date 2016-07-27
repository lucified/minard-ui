import { Action } from './actions';
import { ProjectState } from './types';

const initialState: ProjectState = {
  1: {
    id: '1',
    name: 'First project',
    description: 'This is the first project description. It might not be set.',
    branches: ['1', '2', '3'],
  },
  2: {
    id: '2',
    name: 'Second project',
    branches: [],
  },
};

export default (state: ProjectState = initialState, _action: Action) => {
  return state;
};
