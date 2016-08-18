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
      emptyContentHeader="Nothing has happened in your project!"
      emptyContentBody="Commit some code to get things started."
      isLoading={isLoading}
    />
  </section>
);

export default ProjectActivity;
