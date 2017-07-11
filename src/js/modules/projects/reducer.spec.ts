import { expect } from 'chai';
import { values } from 'lodash';

import { FetchError } from '../errors';
import Requests from '../requests';

import { CLEAR_STORED_DATA } from '../user/index';
import {
  addBranchesToProject,
  removeBranchFromProject,
  removeProject,
  storeAuthorsToProject,
  storeProjects,
  updateLatestActivityTimestampForProject,
  updateLatestDeployedCommitForProject,
  updateProject,
} from './actions';
import reducer from './reducer';
import { Project, ProjectState, ProjectUser } from './types';

describe('Projects reducer', () => {
  const newProjects: ProjectState = {
    1: {
      id: '1',
      name: 'first-project',
      description:
        'This is the first-project description. It might not be set.',
      branches: undefined,
      latestActivityTimestamp: 1470066681802,
      latestSuccessfullyDeployedCommit: 'aacceeff02',
      activeUsers: [
        {
          name: 'Ville Saarinen',
          email: 'ville.saarinen@lucify.com',
        },
        {
          email: 'juho@lucify.com',
          name: undefined,
        },
      ],
      repoUrl: 'http://mock.repo.url/project.git',
      token: 'testtoken',
      webhookUrl: 'http://foo.webhook.url',
    },
    2: {
      id: '2',
      name: 'second-project',
      description: undefined,
      branches: undefined,
      latestActivityTimestamp: undefined,
      latestSuccessfullyDeployedCommit: undefined,
      activeUsers: [],
      repoUrl: 'http://mock.repo.url/project.git',
      token: 'testtoken',
      webhookUrl: 'http://foo.webhook.url',
    },
  };

  const stateWithoutExistingEntity: ProjectState = {
    3: {
      id: '3',
      name: 'Third project',
      description: undefined,
      activeUsers: [],
      latestActivityTimestamp: undefined,
      latestSuccessfullyDeployedCommit: undefined,
      branches: undefined,
      repoUrl: 'http://mock.repo.url/project.git',
      token: 'testtoken',
      webhookUrl: 'http://foo.webhook.url',
    },
  };

  const stateWithExistingEntity: ProjectState = {
    3: {
      id: '3',
      name: 'Third project a',
      description: undefined,
      branches: ['branch1', 'branch2'],
      latestActivityTimestamp: undefined,
      latestSuccessfullyDeployedCommit: undefined,
      activeUsers: [
        {
          email: 'existing.user@test.com',
        },
      ],
      repoUrl: 'http://mock.repo.url/project.git',
      token: 'testtoken',
      webhookUrl: 'http://foo.webhook.url',
    },
    1: {
      id: '1',
      name: 'first-project again',
      description: 'foobar',
      branches: undefined,
      latestActivityTimestamp: 1234567777,
      latestSuccessfullyDeployedCommit: undefined,
      activeUsers: [
        {
          email: 'existing.user@test.com',
        },
      ],
      repoUrl: 'http://mock.repo.url/project.git',
      token: 'testtoken',
      webhookUrl: 'http://foo.webhook.url',
    },
  };

  it('returns the correct default state', () => {
    expect(reducer(undefined as any, { type: 'foobar' })).to.deep.equal({});
  });

  describe('storeProjects', () => {
    const storeAction = storeProjects(values<Project>(newProjects));

    it('with an empty initial state', () => {
      expect(reducer(undefined as any, storeAction)).to.deep.equal(newProjects);
    });

    it('makes no changes with an empty list', () => {
      const emptyAction = storeProjects([]);
      const newState = reducer(stateWithoutExistingEntity, emptyAction);
      expect(newState).to.deep.equal(stateWithoutExistingEntity);
      expect(newState).to.equal(stateWithoutExistingEntity);
    });

    it('with other projects in state', () => {
      const newState = reducer(stateWithoutExistingEntity, storeAction);
      expect(newState).to.deep.equal({
        ...stateWithoutExistingEntity,
        ...newProjects,
      });
      expect(newState).to.not.equal(stateWithoutExistingEntity); // make sure not mutated
    });

    it('by replacing existing projects', () => {
      const newState = reducer(stateWithExistingEntity, storeAction);
      expect(newState).to.deep.equal({
        ...stateWithExistingEntity,
        ...newProjects,
      });
      expect(newState).to.not.equal(stateWithExistingEntity); // make sure not mutated
    });
  });

  describe('failed fetch project request', () => {
    const failedRequestAction: FetchError = {
      id: '1',
      type: Requests.actions.Projects.LoadProject.FAILURE.type,
      error: 'Error message in testing',
      details: 'Detailed message in testing',
      prettyError: 'Pretty error message in testing',
    };

    it('with an empty initial state', () => {
      expect(reducer(undefined as any, failedRequestAction)).to.deep.equal({
        [failedRequestAction.id]: failedRequestAction,
      });
    });

    it('with other entities in state', () => {
      const newState = reducer(stateWithoutExistingEntity, failedRequestAction);
      expect(newState).to.deep.equal({
        ...stateWithoutExistingEntity,
        [failedRequestAction.id]: failedRequestAction,
      });
      expect(newState).to.not.equal(stateWithoutExistingEntity); // make sure not mutated
    });

    it('by not overwriting existing entities', () => {
      const newState = reducer(stateWithExistingEntity, failedRequestAction);
      expect(newState).to.deep.equal(stateWithExistingEntity);
      expect(newState).to.equal(stateWithExistingEntity); // make sure not mutated
    });
  });

  describe('failed fetch branches for project request', () => {
    const failedRequestAction: FetchError = {
      id: '3',
      type: Requests.actions.Branches.LoadBranchesForProject.FAILURE.type,
      error: 'Error message in testing',
      details: 'Detailed message in testing',
      prettyError: 'Pretty error message in testing',
    };

    it('does nothing with an empty initial state', () => {
      expect(reducer(undefined as any, failedRequestAction)).to.deep.equal({});
    });

    it('stores the error if branches do not already exist for the project', () => {
      const action = { ...failedRequestAction, id: '1' };
      const existingProject = { ...stateWithExistingEntity['1'] as Project };
      const newState = reducer(stateWithExistingEntity, action);
      expect(newState).to.deep.equal({
        ...stateWithExistingEntity,
        [action.id]: { ...existingProject, branches: action },
      });
      expect(newState).to.not.equal(stateWithExistingEntity); // make sure not mutated
    });

    it('does nothing if comments already exist for the deployment in the state', () => {
      const newState = reducer(stateWithExistingEntity, failedRequestAction);
      expect(newState).to.deep.equal(stateWithExistingEntity);
      expect(newState).to.equal(stateWithExistingEntity); // make sure not mutated
    });

    it('does nothing if the deployment does not exist in the state', () => {
      const newState = reducer(stateWithoutExistingEntity, {
        ...failedRequestAction,
        id: 'notexist',
      });
      expect(newState).to.deep.equal(stateWithoutExistingEntity);
      expect(newState).to.equal(stateWithoutExistingEntity); // make sure not mutated
    });
  });

  describe('project deletion request success', () => {
    const expectedStateWithExistingEntity = {
      ...stateWithExistingEntity,
      ...newProjects,
    };

    it(`removes a project from the state upon receiving ${Requests.actions
      .Projects.DeleteProject.SUCCESS.type}`, () => {
      const action = Requests.actions.Projects.DeleteProject.SUCCESS.actionCreator(
        '3',
      );
      const initialState = expectedStateWithExistingEntity;
      const expectedNewState = { ...initialState };
      delete expectedNewState['3'];

      const newState = reducer(initialState, action);
      expect(newState).to.deep.equal(expectedNewState);
      expect(newState).to.not.equal(initialState);
    });

    it('does nothing if the project does not exist', () => {
      const action = Requests.actions.Projects.DeleteProject.SUCCESS.actionCreator(
        '7',
      );
      const initialState = expectedStateWithExistingEntity;
      const newState = reducer(initialState, action);

      expect(newState).to.deep.equal(initialState);
      expect(newState).to.equal(initialState);
    });
  });

  describe('removeProject', () => {
    const expectedStateWithExistingEntity = {
      ...stateWithExistingEntity,
      ...newProjects,
    };

    it(`removes an existing project`, () => {
      const action = removeProject('3');
      const initialState = expectedStateWithExistingEntity;
      const expectedNewState = { ...initialState };
      delete expectedNewState['3'];

      const newState = reducer(initialState, action);
      expect(newState).to.deep.equal(expectedNewState);
      expect(newState).to.not.equal(initialState);
    });

    it('does nothing if the project does not exist', () => {
      const action = removeProject('notExist');
      const initialState = expectedStateWithExistingEntity;
      const newState = reducer(initialState, action);

      expect(newState).to.deep.equal(initialState);
      expect(newState).to.equal(initialState);
    });
  });

  describe('addBranchesToProject', () => {
    it('should add all branches to a project if they do not already exist', () => {
      const action = addBranchesToProject('3', ['newbranch1', 'newbranch2']);
      const oldProject = { ...stateWithExistingEntity['3'] as Project };
      const newState = reducer(stateWithExistingEntity, action);
      const newProject = newState['3'] as Project;
      expect(newProject.branches).to.deep.equal([
        ...(oldProject.branches as string[]),
        ...action.branches,
      ]);
      expect(newState).to.not.equal(stateWithExistingEntity);
    });

    it('should add only the projects that do not exist on a project', () => {
      const action = addBranchesToProject('3', ['branch1', 'newbranch2']);
      const oldProject = { ...stateWithExistingEntity['3'] as Project };
      const newState = reducer(stateWithExistingEntity, action);
      const newProject = newState['3'] as Project;
      expect(newProject.branches).to.deep.equal([
        ...(oldProject.branches as string[]),
        action.branches[1],
      ]);
      expect(newState).to.not.equal(stateWithExistingEntity);
    });

    it('should do nothing if the branches already exists on the project', () => {
      const action = addBranchesToProject('3', ['branch1', 'branch2']);
      const newState = reducer(stateWithExistingEntity, action);
      expect(newState).to.deep.equal(stateWithExistingEntity);
      expect(newState).to.equal(stateWithExistingEntity);
    });

    it('should do nothing if the project does not exist', () => {
      const action = addBranchesToProject('notExist', [
        'newbranch1',
        'newbranch2',
      ]);
      const newState = reducer(stateWithExistingEntity, action);
      expect(newState).to.deep.equal(stateWithExistingEntity);
      expect(newState).to.equal(stateWithExistingEntity);
    });
  });

  describe('removeBranchFromProject', () => {
    it('should remove the branch if it exists', () => {
      const action = removeBranchFromProject('3', 'branch1');
      const oldProject = { ...stateWithExistingEntity['3'] as Project };
      const newState = reducer(stateWithExistingEntity, action);
      const newProject = newState['3'] as Project;
      expect((oldProject.branches as string[]).length).to.equal(2);
      expect(newProject.branches).to.deep.equal(
        (oldProject.branches as string[]).filter(b => b !== 'branch1'),
      );
      expect(newState).to.not.equal(stateWithExistingEntity);
    });

    it('should do nothing if the branch does not exist', () => {
      const action = removeBranchFromProject('3', 'notexist');
      const newState = reducer(stateWithExistingEntity, action);
      expect(newState).to.deep.equal(stateWithExistingEntity);
      expect(newState).to.equal(stateWithExistingEntity);
    });

    it('should do nothing if the project does not exist', () => {
      const action = removeBranchFromProject('notexist', 'branch1');
      const newState = reducer(stateWithExistingEntity, action);
      expect(newState).to.deep.equal(stateWithExistingEntity);
      expect(newState).to.equal(stateWithExistingEntity);
    });
  });

  describe('storeAuthorsToProject', () => {
    const newUsers: ProjectUser[] = [
      { email: 'new.user1@test.com' },
      { email: 'new.user2@test.com' },
    ];
    it('should add new authors to project', () => {
      const action = storeAuthorsToProject('1', newUsers);
      const existingProject = stateWithExistingEntity['1'] as Project;
      const newState = reducer(stateWithExistingEntity, action);
      const newProject = newState['1'] as Project;
      expect(existingProject.activeUsers.length).to.equal(1);
      expect(newProject.activeUsers).to.deep.equal([
        ...existingProject.activeUsers,
        ...action.authors,
      ]);
      expect(newState).to.not.equal(stateWithExistingEntity);
    });

    it('should add only authors that do not exist in project', () => {
      const existingProject = stateWithExistingEntity['1'] as Project;
      const action = storeAuthorsToProject('1', [
        ...newUsers,
        ...existingProject.activeUsers,
      ]);
      const newState = reducer(stateWithExistingEntity, action);
      const newProject = newState['1'] as Project;
      expect(existingProject.activeUsers.length).to.equal(1);
      expect(newProject.activeUsers).to.deep.equal([
        ...existingProject.activeUsers,
        ...newUsers,
      ]);
      expect(newState).to.not.equal(stateWithExistingEntity);
    });

    it('should not do anything if all authors already exist', () => {
      const action = storeAuthorsToProject(
        '1',
        (stateWithExistingEntity['1'] as Project).activeUsers,
      );
      const newState = reducer(stateWithExistingEntity, action);
      expect(newState).to.deep.equal(stateWithExistingEntity);
      expect(newState).to.equal(stateWithExistingEntity);
    });

    it('should not do anything if projet does not exist', () => {
      const action = storeAuthorsToProject('notExist', newUsers);
      const newState = reducer(stateWithExistingEntity, action);
      expect(newState).to.deep.equal(stateWithExistingEntity);
      expect(newState).to.equal(stateWithExistingEntity);
    });
  });

  describe('updateLatestActivityTimestampForProject', () => {
    it('should update the timestamp for a project that exists', () => {
      const action = updateLatestActivityTimestampForProject('1', 5555555);
      const oldProject = stateWithExistingEntity['1'] as Project;
      const newState = reducer(stateWithExistingEntity, action);
      const newProject = newState['1'] as Project;
      expect(oldProject.latestActivityTimestamp).to.not.equal(
        newProject.latestActivityTimestamp,
      );
      expect(newProject.latestActivityTimestamp).to.equal(action.timestamp);
      expect(newState).to.not.equal(stateWithExistingEntity);
    });

    it('should do nothing if the same timestamp is already on the project', () => {
      const oldProject = stateWithExistingEntity['1'] as Project;
      const action = updateLatestActivityTimestampForProject(
        '1',
        oldProject.latestActivityTimestamp!,
      );
      const newState = reducer(stateWithExistingEntity, action);
      expect(newState).to.deep.equal(stateWithExistingEntity);
      expect(newState).to.equal(stateWithExistingEntity);
    });

    it('should do nothing if a project does not exist', () => {
      const action = updateLatestActivityTimestampForProject(
        'notexist',
        55555555,
      );
      const newState = reducer(stateWithExistingEntity, action);
      expect(newState).to.deep.equal(stateWithExistingEntity);
      expect(newState).to.equal(stateWithExistingEntity);
    });
  });

  describe('updateLatestDeployedCommitForProject', () => {
    it('should update the timestamp for a project that exists', () => {
      const action = updateLatestDeployedCommitForProject('1', 'newcommit');
      const oldProject = stateWithExistingEntity['1'] as Project;
      const newState = reducer(stateWithExistingEntity, action);
      const newProject = newState['1'] as Project;
      expect(oldProject.latestSuccessfullyDeployedCommit).to.not.equal(
        newProject.latestSuccessfullyDeployedCommit,
      );
      expect(newProject.latestSuccessfullyDeployedCommit).to.equal(
        action.commit,
      );
      expect(newState).to.not.equal(stateWithExistingEntity);
    });

    it('should do nothing if the same timestamp is already on the project', () => {
      const oldProject = stateWithExistingEntity['1'] as Project;
      const action = updateLatestDeployedCommitForProject(
        '1',
        oldProject.latestSuccessfullyDeployedCommit!,
      );
      const newState = reducer(stateWithExistingEntity, action);
      expect(newState).to.deep.equal(stateWithExistingEntity);
      expect(newState).to.equal(stateWithExistingEntity);
    });

    it('should do nothing if a project does not exist', () => {
      const action = updateLatestDeployedCommitForProject(
        'notexist',
        'newcommit',
      );
      const newState = reducer(stateWithExistingEntity, action);
      expect(newState).to.deep.equal(stateWithExistingEntity);
      expect(newState).to.equal(stateWithExistingEntity);
    });
  });

  describe('updateProject', () => {
    it("should update an existing project's properties", () => {
      const action = updateProject(
        '1',
        'newname',
        'newrepourl',
        'newdescription',
      );
      const oldProject = stateWithExistingEntity['1'] as Project;
      const newState = reducer(stateWithExistingEntity, action);
      const newProject = newState['1'] as Project;
      expect(newProject).to.not.deep.equal(oldProject);
      expect(newProject.name).to.equal(action.name);
      expect(newProject.description).to.equal(action.description);
      expect(newProject.repoUrl).to.equal(action.repoUrl);
      expect(newState).to.not.equal(stateWithExistingEntity);
    });

    it('should do nothing if no properties were changed', () => {
      const oldProject = stateWithExistingEntity['1'] as Project;
      const action = updateProject(
        '1',
        oldProject.name,
        oldProject.repoUrl,
        oldProject.description,
      );
      const newState = reducer(stateWithExistingEntity, action);
      expect(newState).to.deep.equal(stateWithExistingEntity);
      expect(newState).to.equal(stateWithExistingEntity);
    });

    it('should do nothing if a project does not exist', () => {
      const action = updateProject(
        'notexist',
        'newname',
        'newrepourl',
        'newdescription',
      );
      const newState = reducer(stateWithExistingEntity, action);
      expect(newState).to.deep.equal(stateWithExistingEntity);
      expect(newState).to.equal(stateWithExistingEntity);
    });
  });

  it(`clears data on ${CLEAR_STORED_DATA}`, () => {
    const action = { type: CLEAR_STORED_DATA };
    expect(reducer(stateWithExistingEntity, action)).to.deep.equal({});
    expect(reducer(stateWithoutExistingEntity, action)).to.deep.equal({});
    expect(reducer(undefined as any, action)).to.deep.equal({});
  });
});
