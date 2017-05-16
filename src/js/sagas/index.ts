import { call, Effect, select } from 'redux-saga/effects';

import { Api, ApiEntityTypeString } from '../api/types';
import createActivitySagas from '../modules/activities/sagas';
import Branches from '../modules/branches';
import createBranchSagas from '../modules/branches/sagas';
import createCommentSagas from '../modules/comments/sagas';
import Commits from '../modules/commits';
import createCommitSagas from '../modules/commits/sagas';
import Deployments from '../modules/deployments';
import createDeploymentSagas from '../modules/deployments/sagas';
import { isFetchError } from '../modules/errors';
import createFormSagas from '../modules/forms/sagas';
import createPreviewSagas from '../modules/previews/sagas';
import Projects from '../modules/projects';
import createProjectSagas from '../modules/projects/sagas';
import createUserSagas from '../modules/user/sagas';

export default function createSagas(api: Api) {
  const activitySagas = createActivitySagas(api);
  const branchSagas = createBranchSagas(api);
  const commentSagas = createCommentSagas(api);
  const commitSagas = createCommitSagas(api);
  const deploymentSagas = createDeploymentSagas(api);
  const formSagas = createFormSagas();
  const previewSagas = createPreviewSagas(api);
  const projectSagas = createProjectSagas(api);
  const userSagas = createUserSagas(api);

  // NOTE: This needs to be constructed here since we need to have the fetcher functions.
  /**
   * Returns the entity object.
   */
  function* fetchIfMissing(type: ApiEntityTypeString, id: string): IterableIterator<Effect> {
    const selectors = {
      branches: Branches.selectors.getBranch,
      commits: Commits.selectors.getCommit,
      deployments: Deployments.selectors.getDeployment,
      projects: Projects.selectors.getProject,
    };
    const fetchers = {
      branches: branchSagas.fetcher,
      commits: commitSagas.fetcher,
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
