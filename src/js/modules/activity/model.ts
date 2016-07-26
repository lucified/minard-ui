import * as _ from 'lodash';

import * as t from './types';

export const getActivityForProject = (activities: t.ActivityState, projectId: string) =>
  _.values<t.Activity>(activities)
  .filter(activity => activity.project === projectId)
  .sort((a, b) => b.timestamp - a.timestamp);
