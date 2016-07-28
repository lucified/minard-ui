import { Action } from './actions';
import { ProjectState } from './types';

const initialState: ProjectState = {
  1: {
    id: '1',
    name: 'First project',
    description: 'This is the first project description. It might not be set.',
    branches: ['1', '2', '3'],
    activeUsers: ['ville.saarinen@lucify.com', 'juho@lucify.com']
  },
  2: {
    id: '2',
    name: 'Second project',
    branches: [],
    activeUsers: ['ville.saarinen@lucify.com']
  },
};

export default (state: ProjectState = initialState, _action: Action) => {
  return state;
};
