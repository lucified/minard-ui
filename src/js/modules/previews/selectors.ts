import { StateTree } from '../../reducers';
import { FetchError } from '../errors';

import * as t from './types';

const selectPreviewTree = (state: StateTree): t.PreviewState => state.entities.previews;

export const getPreview = (state: StateTree, id: string): t.Preview | FetchError | undefined =>
  selectPreviewTree(state)[id];
