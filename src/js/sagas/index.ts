import { Api } from '../api/types';
import createActivitySagas from '../modules/activities/sagas';
import createBranchSagas from '../modules/branches/sagas';
import createCommentSagas from '../modules/comments/sagas';
import createCommitSagas from '../modules/commits/sagas';
import createDeploymentSagas from '../modules/deployments/sagas';
import createFormSagas from '../modules/forms/sagas';
import createPreviewSagas from '../modules/previews/sagas';
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

  return function* rootSaga() {
    yield [
      ...activitySagas.sagas,
      ...branchSagas.sagas,
      ...commentSagas.sagas,
      ...commitSagas.sagas,
      ...deploymentSagas.sagas,
      ...formSagas.sagas,
      ...previewSagas.sagas,
      ...projectSagas.sagas,
      ...userSagas.sagas,
    ];
  };
}
