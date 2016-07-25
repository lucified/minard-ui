import { Action } from './actions';
import { ProjectState } from './model';

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
}
