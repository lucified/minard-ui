import * as React from 'react';

import { Activity } from '../../modules/activities';

import ActivityList from '../common/activity-list';
import SectionTitle from '../common/simple-section-title';

interface Props {
  activities: Activity[];
  loadActivities: (count: number, until?: number) => void;
  isLoading: boolean;
  allLoaded: boolean;
}

const ActivitySection = ({ activities, isLoading, allLoaded, loadActivities }: Props) => (
  <section>
    <SectionTitle><span>Previews</span></SectionTitle>
    <ActivityList
      activities={activities}
      emptyContentHeader="Nothing has happened in your projects!"
      emptyContentBody=""
      showProjectName
      allLoaded={allLoaded}
      loadActivities={loadActivities}
      isLoading={isLoading}
    />
  </section>
);

export default ActivitySection;
