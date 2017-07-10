import * as React from 'react';

import { Activity } from '../../modules/activities';
import { Project } from '../../modules/projects';
import ActivityList from '../common/activity-list';
import MinardLink from '../common/minard-link';
import SimpleSectionTitle from '../common/simple-section-title';

const styles = require('./project-activity.scss');

interface Props {
  project: Project;
  activities: Activity[];
  isLoading: boolean;
  allLoaded: boolean;
  loadActivities: (count: number, until?: number) => void;
}

const ProjectActivity = ({
  activities,
  loadActivities,
  isLoading,
  allLoaded,
  project,
}: Props) =>
  <section>
    <SimpleSectionTitle>
      <span>Previews</span>
      <span className={styles['show-branches']}>
        <MinardLink showAll project={{ project }}>
          Show branches
        </MinardLink>
      </span>
    </SimpleSectionTitle>
    <ActivityList
      activities={activities}
      emptyContentHeader="Nothing to see here yet…"
      emptyContentBody=""
      allLoaded={allLoaded}
      loadActivities={loadActivities}
      isLoading={isLoading}
    />
  </section>;

export default ProjectActivity;
