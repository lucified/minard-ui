import { expect } from 'chai';

import { closeModal, openModal } from './actions';
import reducer from './reducer';
import { ModalType } from './types';

describe('Modals reducer', () => {
  it('opens a modal dialog when one is not open', () => {
    const type = ModalType.NewProject;
    const action = openModal(type);
    const initialState = null;
    const expectedState = { type };

    expect(reducer(initialState, action)).to.deep.equal(expectedState);
  });

  it('does nothing when opening a modal that is already open', () => {
    const type = ModalType.NewProject;
    const action = openModal(type);
    const initialState = { type };
    const expectedState = { type };

    expect(reducer(initialState, action)).to.deep.equal(expectedState);
  });

  it('does nothing when opening a modal when another modal is already open', () => {
    const action = openModal(ModalType.NewProject);
    const initialState = { type: ModalType.ProjectSettings };
    const expectedState = { type: ModalType.ProjectSettings };

    expect(reducer(initialState, action)).to.deep.equal(expectedState);
  });

  it('closes a modal dialog', () => {
    const action = closeModal(ModalType.ProjectSettings);
    const initialState = { type: ModalType.ProjectSettings };
    const expectedState = null;

    expect(reducer(initialState, action)).to.deep.equal(expectedState);
  });

  it('does not close a modal dialog of a different type', () => {
    const action = closeModal(ModalType.NewProject);
    const initialState = { type: ModalType.ProjectSettings };
    const expectedState = { type: ModalType.ProjectSettings };

    expect(reducer(initialState, action)).to.deep.equal(expectedState);
  });

  it('does nothing when closing a modal when none are open', () => {
    const action = closeModal(ModalType.NewProject);
    const initialState = null;
    const expectedState = null;

    expect(reducer(initialState, action)).to.deep.equal(expectedState);
  });
});
