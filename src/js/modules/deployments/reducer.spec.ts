import { expect } from 'chai';
import { values } from 'lodash';

import { FetchError } from '../errors';
import Requests from '../requests';
import { CLEAR_STORED_DATA } from '../user';
import {
  addCommentsToDeployment,
  removeCommentFromDeployment,
  setCommentsForDeployment,
  storeDeployments,
} from './actions';
import reducer from './reducer';
import { Deployment, DeploymentState, DeploymentStatus } from './types';

describe('Deployments reducer', () => {
  const stateWithoutExistingEntity: DeploymentState = {
    8: {
      id: '8',
      status: DeploymentStatus.Success,
      url: '#',
      screenshot: 'https://www.lucify.com/images/lucify-asylum-countries-open-graph-size-5adef1be36.png',
      creator: {
        name: undefined,
        email: 'juho@lucify.com',
        timestamp: 1470131581802,
      },
      token: 'testtoken',
    },
  };

  const stateWithExistingEntity: DeploymentState = {
    7: {
      id: '7',
      status: DeploymentStatus.Success,
      url: 'foo#',
      screenshot: 'bar#',
      creator: {
        name: 'Ville',
        email: 'ville.saarinen@lucify.com',
        timestamp: 1470131481802,
      },
      token: 'testtoken',
      comments: ['existingComment'],
      commentCount: 1,
    },
  };

  it('returns the correct default state', () => {
    expect(reducer(undefined as any, { type: 'foobar' })).to.deep.equal({});
  });

  describe('storeCommits', () => {
    const newDeployments: DeploymentState = {
      7: {
        id: '7',
        status: DeploymentStatus.Success,
        url: '#',
        screenshot: 'https://www.lucify.com/images/lucify-asylum-countries-open-graph-size-5adef1be36.png',
        creator: {
          name: 'Ville Saarinen',
          email: 'ville.saarinen@lucify.com',
          timestamp: 1470131481802,
        },
        token: 'testtoken',
      },
    };

    const storeAction = storeDeployments(values<Deployment>(newDeployments));

    it('with an empty initial state', () => {
      expect(reducer(undefined as any, storeAction)).to.deep.equal(newDeployments);
    });

    it('makes no changes with an empty list', () => {
      const emptyAction = storeDeployments([]);
      const newState = reducer(stateWithoutExistingEntity, emptyAction);
      expect(newState).to.deep.equal(stateWithoutExistingEntity);
      expect(newState).to.equal(stateWithoutExistingEntity);
    });

    it('with other deployments in state', () => {
      const newState = reducer(stateWithoutExistingEntity, storeAction);
      expect(newState).to.deep.equal({ ...stateWithoutExistingEntity, ...newDeployments});
      expect(newState).to.not.equal(stateWithoutExistingEntity); // make sure not mutated
    });

    it('by replacing existing deployments', () => {
      const newState = reducer(stateWithExistingEntity, storeAction);
      expect(newState).to.deep.equal({ ...stateWithExistingEntity, ...newDeployments });
      expect(newState).to.not.equal(stateWithExistingEntity); // make sure not mutated
    });
  });

  describe('failed fetch commit request', () => {
    const failedRequestAction: FetchError = {
      id: '7',
      type: Requests.actions.Deployments.LoadDeployment.FAILURE.type,
      error: 'Error message in testing',
      details: 'Detailed message in testing',
      prettyError: 'Pretty error message in testing',
    };

    it('with an empty initial state', () => {
      expect(reducer(undefined as any, failedRequestAction)).to.deep.equal(
        { [failedRequestAction.id]: failedRequestAction },
      );
    });

    it('with other entities in state', () => {
      const newState = reducer(stateWithoutExistingEntity, failedRequestAction);
      expect(newState).to.deep.equal(
        { ...stateWithoutExistingEntity, [failedRequestAction.id]: failedRequestAction },
      );
      expect(newState).to.not.equal(stateWithoutExistingEntity); // make sure not mutated
    });

    it('by not overwriting existing entities', () => {
      const newState = reducer(stateWithExistingEntity, failedRequestAction);
      expect(newState).to.deep.equal(stateWithExistingEntity);
      expect(newState).to.equal(stateWithExistingEntity); // make sure not mutated
    });
  });

  describe('failed fetch comments for commit request', () => {
    const failedRequestAction: FetchError = {
      id: '7',
      type: Requests.actions.Comments.LoadCommentsForDeployment.FAILURE.type,
      error: 'Error message in testing',
      details: 'Detailed message in testing',
      prettyError: 'Pretty error message in testing',
    };

    it('does nothing with an empty initial state', () => {
      expect(reducer(undefined as any, failedRequestAction)).to.deep.equal({});
    });

    it('stores the error if comments do not already exist for the deployment', () => {
      const action = { ...failedRequestAction, id: '8' };
      const existingDeployment = stateWithoutExistingEntity['8'] as Deployment;
      const newState = reducer(stateWithoutExistingEntity, action);
      expect(newState).to.deep.equal({
        ...stateWithoutExistingEntity,
        [action.id]: { ...existingDeployment, comments: action },
      });
      expect(newState).to.not.equal(stateWithoutExistingEntity); // make sure not mutated
    });

    it('does nothing if comments already exist for the deployment in the state', () => {
      const newState = reducer(stateWithExistingEntity, failedRequestAction);
      expect(newState).to.deep.equal(stateWithExistingEntity);
      expect(newState).to.equal(stateWithExistingEntity); // make sure not mutated
    });

    it('does nothing if the deployment does not exist in the state', () => {
      const newState = reducer(stateWithoutExistingEntity, failedRequestAction);
      expect(newState).to.deep.equal(stateWithoutExistingEntity);
      expect(newState).to.equal(stateWithoutExistingEntity); // make sure not mutated
    });
  });

  describe('addCommentsToDeployment', () => {
    it('should add a comment to a deployment that doesn\'t have any', () => {
      const action = addCommentsToDeployment('8', ['comment1', 'comment2']);
      const newState = reducer(stateWithoutExistingEntity, action);
      const newDeployment = newState['8'] as Deployment;
      expect(newDeployment.comments).to.deep.equal(action.comments);
      expect(newState).to.not.equal(stateWithoutExistingEntity);
    });

    it('should add a comment to a deployment that already has one', () => {
      const action = addCommentsToDeployment('7', ['comment1', 'comment2']);
      const oldDeployment = stateWithExistingEntity['7'] as Deployment;
      const newState = reducer(stateWithExistingEntity, action);
      const newDeployment = newState['7'] as Deployment;
      expect(newDeployment.comments).to.deep.equal([...oldDeployment.comments as string[], ...action.comments]);
      expect(newState).to.not.equal(stateWithExistingEntity);
    });

    it('should increase the comment count', () => {
      const action = addCommentsToDeployment('7', ['comment1', 'comment2']);
      const oldDeployment = stateWithExistingEntity['7'] as Deployment;
      expect(oldDeployment.commentCount).to.equal(1);
      const newState = reducer(stateWithExistingEntity, action);
      const newDeployment = newState['7'] as Deployment;
      expect(newDeployment.commentCount).to.equal(3);
      expect(newState).to.not.equal(stateWithExistingEntity);
    });

    it('should do nothing if the comment already exists in the deployment', () => {
      const action = addCommentsToDeployment('7', ['existingComment']);
      const newState = reducer(stateWithExistingEntity, action);
      expect(newState).to.deep.equal(stateWithExistingEntity);
      expect(newState).to.equal(stateWithExistingEntity);
    });

    it('should do nothing if the deployment does not exist', () => {
      const action = addCommentsToDeployment('notExist', ['comment1']);
      const newState = reducer(stateWithExistingEntity, action);
      expect(newState).to.deep.equal(stateWithExistingEntity);
      expect(newState).to.equal(stateWithExistingEntity);
    });
  });

  describe('removeCommentFromDeployment', () => {
    it('should remove an existing comment', () => {
      const action = removeCommentFromDeployment('7', 'existingComment');
      const newState = reducer(stateWithExistingEntity, action);
      const newDeployment = newState['7'] as Deployment;
      expect(newDeployment.comments).to.deep.equal([]);
      expect(newState).to.not.equal(stateWithExistingEntity);
    });

    it('should decrease the commentCount', () => {
      const oldDeployment: Deployment = { ...stateWithExistingEntity['7'] as Deployment };
      const action = removeCommentFromDeployment('7', 'existingComment');
      const newState = reducer(stateWithExistingEntity, action);
      const newDeployment = newState['7'] as Deployment;
      expect(oldDeployment.commentCount).to.equal(1);
      expect(newDeployment.commentCount).to.equal(0);
      expect(newState).to.not.equal(stateWithExistingEntity);
    });

    it('should do nothing if the comment does not exist', () => {
      const action = removeCommentFromDeployment('8', 'notExist');
      const newState = reducer(stateWithoutExistingEntity, action);
      expect(newState).to.deep.equal(stateWithoutExistingEntity);
      expect(newState).to.equal(stateWithoutExistingEntity);
    });

    it('should do nothing if the deployment does not exist', () => {
      const action = removeCommentFromDeployment('notExist', 'comment');
      const newState = reducer(stateWithoutExistingEntity, action);
      expect(newState).to.deep.equal(stateWithoutExistingEntity);
      expect(newState).to.equal(stateWithoutExistingEntity);
    });
  });

  describe('setCommentsForDeployment', () => {
    it('should replace already existing comments', () => {
      const action = setCommentsForDeployment('7', ['comment1', 'comment2']);
      const newState = reducer(stateWithExistingEntity, action);
      const newDeployment = newState['7'] as Deployment;
      expect(newDeployment.comments).to.deep.equal(action.comments);
      expect(newState).to.not.equal(stateWithExistingEntity);
    });

    it('should set the correct commentCount', () => {
      const oldDeployment: Deployment = { ...stateWithExistingEntity['7'] as Deployment };
      const action = setCommentsForDeployment('7', ['comment1', 'comment2']);
      const newState = reducer(stateWithExistingEntity, action);
      const newDeployment = newState['7'] as Deployment;
      expect(oldDeployment.commentCount).to.equal(1);
      expect(newDeployment.commentCount).to.equal(2);
      expect(newState).to.not.equal(stateWithExistingEntity);
    });

    it('should set the comments if they do not already exist', () => {
      const action = setCommentsForDeployment('8', ['comment1', 'comment2']);
      const newState = reducer(stateWithoutExistingEntity, action);
      const newDeployment = newState['8'] as Deployment;
      expect(newDeployment.comments).to.deep.equal(action.comments);
      expect(newState).to.not.equal(stateWithoutExistingEntity);
    });

    it('should do nothing if the deployment does not exist', () => {
      const action = setCommentsForDeployment('notExist', ['comment1', 'comment2']);
      const newState = reducer(stateWithoutExistingEntity, action);
      expect(newState).to.deep.equal(stateWithoutExistingEntity);
      expect(newState).to.equal(stateWithoutExistingEntity);
    });
  });

  it(`clears data on ${CLEAR_STORED_DATA}`, () => {
    expect(reducer(stateWithExistingEntity, { type: CLEAR_STORED_DATA })).to.deep.equal({});
    expect(reducer(stateWithoutExistingEntity, { type: CLEAR_STORED_DATA })).to.deep.equal({});
    expect(reducer(undefined as any, { type: CLEAR_STORED_DATA })).to.deep.equal({});
  });
});
