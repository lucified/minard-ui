import { expect } from 'chai';
import { omit } from 'lodash';

import { CLEAR_STORED_DATA } from '../user';
import { removeComment, storeComments } from './actions';
import reducer from './reducer';
import { CommentState } from './types';

describe('Comments reducer', () => {
  const stateWithComments: CommentState = {
    1: {
      id: '1',
      message: 'Comment message 1',
      deployment: 'dep1',
      timestamp: 123456,
      email: 'test@testing.com',
      name: 'tester 1',
    },
    2: {
      id: '2',
      message: 'Comment message 2',
      deployment: 'dep2',
      timestamp: 12345677,
      email: 'test2@testing.com',
    },
  };

  it('returns the correct default empty state', () => {
    expect(reducer(undefined as any, { type: 'foobar' })).to.deep.equal({});
  });

  describe('removeComment', () => {
    it('removes an existing comment', () => {
      const action = removeComment('1');
      const newState = reducer(stateWithComments, action);
      expect(newState).to.deep.equal(omit(stateWithComments, '1'));
      expect(newState).to.not.equal(stateWithComments);
    });

    it('does nothing if the comment doesn\'t exist', () => {
      const action = removeComment('notexist');
      const newState = reducer(stateWithComments, action);
      expect(newState).to.deep.equal(stateWithComments);
      expect(newState).to.equal(stateWithComments);
    });
  });

  describe('storeComments', () => {
    it('stores comments that don\'t already exist', () => {
      const comments = [
        {
          id: '3',
          message: 'Comment message 3',
          deployment: 'dep3',
          timestamp: 323456,
          email: 'test@testing.com',
          name: 'tester 3',
        },
        {
          id: '4',
          message: 'Comment message 4',
          deployment: 'dep1',
          timestamp: 424456,
          email: 'test@testing.com',
          name: 'tester 4',
        },
      ];
      const action = storeComments(comments);
      const newState = reducer(stateWithComments, action);
      expect(newState).to.deep.equal({
        ...stateWithComments,
        3: { ...comments[0] },
        4: { ...comments[1] },
      });
      expect(newState).to.not.equal(stateWithComments);
    });

    it('replaces comments that already exist', () => {
      const comments = [
        {
          id: '1',
          message: 'Comment message 3',
          deployment: 'dep3',
          timestamp: 323456,
          email: 'test@testing.com',
          name: 'tester 3',
        },
        {
          id: '4',
          message: 'Comment message 4',
          deployment: 'dep1',
          timestamp: 424456,
          email: 'test@testing.com',
          name: 'tester 4',
        },
      ];
      const action = storeComments(comments);
      const newState = reducer(stateWithComments, action);
      expect(newState).to.deep.equal({
        ...stateWithComments,
        1: { ...comments[0] },
        4: { ...comments[1] },
      });
      expect(newState).to.not.equal(stateWithComments);
    });

    it('does nothing when no comments are passed', () => {
      const action = storeComments([]);
      const newState = reducer(stateWithComments, action);
      expect(newState).to.deep.equal(stateWithComments);
      expect(newState).to.equal(stateWithComments);
    });
  });

  it(`removes all data with ${CLEAR_STORED_DATA}`, () => {
    expect(reducer(stateWithComments, { type: CLEAR_STORED_DATA })).to.deep.equal({});
    expect(reducer(undefined as any, { type: CLEAR_STORED_DATA })).to.deep.equal({});
  });
});
