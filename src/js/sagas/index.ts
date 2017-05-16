import { call, Effect, select } from 'redux-saga/effects';

import { Api, ApiEntityTypeString } from '../api/types';
import Activities from '../modules/activities';
import Branches from '../modules/branches';
import Comments from '../modules/comments';
import Commits from '../modules/commits';
import Deployments from '../modules/deployments';
import { isFetchError } from '../modules/errors';
import { createSagas as createFormSagas } from '../modules/forms';
import Previews from '../modules/previews';
import Projects from '../modules/projects';
import User from '../modules/user';

console.log('Activities', Activities);

export default function createSagas(api: Api) {
  const activitySagas = Activities.createSagas(api);
  const branchSagas = Branches.createSagas(api);
  const commentSagas = Comments.createSagas(api);
  const commitSagas = Commits.createSagas(api);
  const deploymentSagas = Deployments.createSagas(api);
  const formSagas = createFormSagas();
  const previewSagas = Previews.createSagas(api);
  const projectSagas = Projects.createSagas(api);
  const userSagas = User.createSagas(api);

  // NOTE: This needs to be constructed here since we need to have the fetcher functions.
  /**
   * Returns the entity object.
   */
  function* fetchIfMissing(type: ApiEntityTypeString, id: string): IterableIterator<Effect> {
    const selectors = {
      commits: Commits.selectors.getCommit,
      branches: Branches.selectors.getBranch,
      deployments: Deployments.selectors.getDeployment,
      projects: Projects.selectors.getProject,
    };
    const fetchers = {
      commits: commitSagas.fetcher,
      branches: branchSagas.fetcher,
      deployments: deploymentSagas.fetcher,
      projects: projectSagas.fetcher,
    };

    const selector = (selectors as any)[type];
    const fetcher = (fetchers as any)[type];

    let existingEntity = yield select(selector, id);

    if (!existingEntity || isFetchError(existingEntity)) {
      yield call(fetcher, id);
      existingEntity = yield select(selector, id);
    }

    return existingEntity;
  }

  return function* rootSaga() {
    yield [
      ...activitySagas.sagas,
      ...branchSagas.sagas(fetchIfMissing),
      ...commentSagas.sagas,
      ...commitSagas.sagas(fetchIfMissing),
      ...deploymentSagas.sagas,
      ...formSagas.sagas,
      ...previewSagas.sagas,
      ...projectSagas.sagas(fetchIfMissing),
      ...userSagas.sagas,
    ];
  };
}
