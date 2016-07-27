import { Action } from './actions';
import { CommitState } from './types';

const screenshot = require('../../../images/screenshot.png');

const initialState: CommitState = {
  '1-aacceeff02': {
    hash: 'aacceeff02',
    branchId: '1',
    author: 'ville.saarinen@gmail.com',
    timestamp: 1469533301791,
    message: 'Fix colors',
    hasDeployment: true,
    screenshot: screenshot,
  },
  '1-12354124': {
    hash: '12354124',
    branchId: '1',
    author: 'ville.saarinen@gmail.com',
    timestamp: 1469533291791,
    message: 'Foobar is nice',
    hasDeployment: true,
    screenshot: screenshot,
  },
  '1-2543452': {
    hash: '2543452',
    branchId: '1',
    author: 'ville.saarinen@gmail.com',
    timestamp: 1469532291791,
    message: 'Barbar barr barb aearr',
    hasDeployment: true,
    screenshot: screenshot,
  },
  '1-098325343': {
    hash: '098325343',
    branchId: '1',
    author: 'ville.saarinen@gmail.com',
    timestamp: 1469531291791,
    message: 'This is a commit message',
    hasDeployment: true,
    screenshot: screenshot,
  },
  '1-29832572fc1': {
    hash: '29832572fc1',
    branchId: '1',
    author: 'ville.saarinen@gmail.com',
    timestamp: 1469530291791,
    message: 'And this is one as well',
    hasDeployment: false,
  },
  '1-29752a385': {
    hash: '29752a385',
    branchId: '1',
    author: 'ville.saarinen@gmail.com',
    timestamp: 1469529291791,
    message: 'How about this?',
    hasDeployment: true,
    screenshot: screenshot,
  },
  '2-aacd00f02': {
    hash: 'aacd00f02',
    branchId: '2',
    author: 'ville.saarinen@gmail.com',
    timestamp: 1469532301791,
    message: 'Try to do something else',
    hasDeployment: false,
  },
  '2-a998823423': {
    hash: 'a998823423',
    branchId: '2',
    author: 'ville.saarinen@gmail.com',
    timestamp: 1469531301791,
    message: 'Try to do something',
    description: 'This is a longer commit explanation for whatever was done to the commit. ' +
      'It should be truncated in some cases',
    hasDeployment: true,
    screenshot: screenshot,
  },
};

export default (state: CommitState = initialState, _action: Action) => {
  return state;
};
