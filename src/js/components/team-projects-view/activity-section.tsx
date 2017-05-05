import * as React from 'react';

import { Activity } from '../../modules/activities';

import ActivityList from '../common/activity-list';
import MinardLink from '../common/minard-link';
import SimpleSectionTitle from '../common/simple-section-title';

const styles = require('./activity-section.scss');

interface Props {
  activities: Activity[];
  loadActivities: (count: number, until?: number) => void;
  isLoading: boolean;
  allLoaded: boolean;
}

const ActivitySection = ({ activities, isLoading, allLoaded, loadActivities }: Props) => (
  <section>
    <SimpleSectionTitle>
      <span>Previews</span>
      <span className={styles['show-projects']}>
        <MinardLink showAll homepage>
          Show projects
        </MinardLink>
      </span>
    </SimpleSectionTitle>
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
