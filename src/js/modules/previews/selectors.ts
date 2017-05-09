import { StateTree } from '../../reducers';
import { FetchError } from '../errors';

import { EntityType, Preview, PreviewState } from './types';

const selectPreviewTree = (state: StateTree): PreviewState => state.entities.previews;

export const getPreview = (
  state: StateTree,
  id: string,
  entityType: EntityType,
): Preview | FetchError | undefined =>
  selectPreviewTree(state)[`${entityType}-${id}`];
