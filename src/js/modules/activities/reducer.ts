import { Action } from 'redux';

import { ActivityState } from './types';

const initialState: ActivityState = {}; /*
  1: {
    id: '1',
    project: '1',
    branch: '1',
    type: ActivityType.Deployment,
    timestamp: 1469533309791,
    author: 'ville.saarinen@lucify.com',
    deployment: '3275924',
    commitMessage: 'Fix colors',
  },
  2: {
    id: '2',
    project: '1',
    branch: '1',
    type: ActivityType.Deployment,
    timestamp: 1469531269791,
    author: 'ville.saarinen@lucify.com',
    deployment: '3275924',
    commitMessage: 'Fix an annoying bug',
  },
  3: {
    id: '3',
    project: '1',
    branch: '1',
    type: ActivityType.Comment,
    timestamp: 1469530169791,
    author: 'ville.saarinen@lucify.com',
    deployment: '3275924',
    comment: 'I think this bug should be fixed',
  },
  4: {
    id: '4',
    project: '1',
    branch: '2',
    type: ActivityType.Deployment,
    timestamp: 1469523069791,
    author: 'ville.saarinen@lucify.com',
    deployment: 'ac29384',
    commitMessage: 'Deebooop dee',
  },
};
*/
export default (state: ActivityState = initialState, _action: Action) => {
  return state;
};
