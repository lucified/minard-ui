import * as React from 'react';

import { Activity } from '../../modules/activities';

import ActivityList from '../common/activity-list';
import SectionTitle from '../common/section-title';

interface Props {
  activities: Activity[];
  isLoading: boolean;
  allLoaded: boolean;
  loadActivities: (count: number, until?: number) => void;
}

const ProjectActivity = ({ activities, loadActivities, isLoading, allLoaded }: Props) => (
  <section className="container">
    <SectionTitle><span>Activity</span></SectionTitle>
    <ActivityList
      activities={activities}
      emptyContentHeader="Nothing to see here yet…"
      emptyContentBody=""
      allLoaded={allLoaded}
      loadActivities={loadActivities}
      isLoading={isLoading}
    />
  </section>
);

export default ProjectActivity;
