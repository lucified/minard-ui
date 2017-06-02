// tslint:disable:no-object-literal-type-assertion

import { expect } from 'chai';
import { call, put, select } from 'redux-saga/effects';

import * as Converter from '../api/convert';
import { ResponseCommitElement, ResponseDeploymentElement } from '../api/types';
import Commits from '../modules/commits';
import Deployments from '../modules/deployments';

import { testData } from '../../../test/test-utils';
import { fetchIfMissing, storeIncludedEntities } from './utils';

describe('saga utils', () => {
  describe('fetchIfMissing', () => {
    /*
    // TODO
    const testFetchIfMissing = (
      type: ApiEntityTypeString,
      selector: (state: StateTree, id: string) => Branch | Commit | Deployment | Project | FetchError | undefined,
      fetcher: (id: string) => IterableIterator<Effect>,
    ) => {
      it(`fetches missing ${type}`, () => {
        const id = '1';
        const iterator = fetchIfMissing(type, id);

        expect(iterator.next().value).to.deep.equal(
          select(selector, id),
        );

        expect(iterator.next().value).to.deep.equal(
          call(fetcher, id),
        );

        expect(iterator.next().value).to.deep.equal(
          select(selector, id),
        );

        const obj = { id };
        const next = iterator.next(obj);

        expect(next.done).to.equal(true);
        expect(next.value).to.equal(obj);
      });
    };

    testFetchIfMissing('commits', Commits.selectors.getCommit, sagas.fetchCommit);
    testFetchIfMissing('deployments', Deployments.selectors.getDeployment, sagas.fetchDeployment);
    testFetchIfMissing('projects', Projects.selectors.getProject, sagas.fetchProject);
    testFetchIfMissing('branches', Branches.selectors.getBranch, sagas.fetchBranch);
    */

    it('does not fetch already existing data', () => {
      const id = '1';
      const iterator = fetchIfMissing('commits', id);

      expect(iterator.next().value).to.deep.equal(
        select(Commits.selectors.getCommit, id),
      );

      const obj = { id };
      const next = iterator.next(obj);

      expect(next.done).to.equal(true);
      expect(next.value).to.equal(obj);
    });
  });

  describe('storeIncludedEntities', () => {
    it('stores passed entities', () => {
      const includedData = testData.branchResponse.included!;
      const iterator = storeIncludedEntities(includedData);
      const deploymentsEntities = includedData.filter(
        entity => entity.type === 'deployments',
      );
      const deploymentObjects = [{ id: '1' }];
      const commitsEntities = includedData.filter(
        entity => entity.type === 'commits',
      );
      const commitObjects = [{ id: '2' }];

      expect(iterator.next().value).to.deep.equal(
        call(
          Converter.toDeployments,
          deploymentsEntities as ResponseDeploymentElement[],
        ),
      );

      expect(iterator.next(deploymentObjects).value).to.deep.equal(
        put(Deployments.actions.storeDeployments(deploymentObjects as any)),
      );

      expect(iterator.next().value).to.deep.equal(
        call(Converter.toCommits, commitsEntities as ResponseCommitElement[]),
      );

      expect(iterator.next(commitObjects).value).to.deep.equal(
        put(Commits.actions.storeCommits(commitObjects as any)),
      );

      expect(iterator.next().done).to.equal(true);
    });

    it('handles an empty included section', () => {
      const iteratorUndefined = storeIncludedEntities(undefined);
      expect(iteratorUndefined.next().done).to.equal(true);

      const iteratorEmptyArray = storeIncludedEntities([]);
      expect(iteratorEmptyArray.next().done).to.equal(true);
    });
  });
});
