import * as React from 'react';

import { Activity } from '../../modules/activities';

import ActivityList from '../common/activity-list';
import SectionTitle from '../common/section-title';

interface Props {
  activities: Activity[];
  isLoading: boolean;
}

const ProjectActivity = ({ activities, isLoading }: Props) => (
  <section className="container">
    <SectionTitle><span>Activity</span></SectionTitle>
    <ActivityList
      activities={activities}
      emptyContentHeader="Nothing to see here yet…"
      emptyContentBody=""
      isLoading={isLoading}
    />
  </section>
);

export default ProjectActivity;
