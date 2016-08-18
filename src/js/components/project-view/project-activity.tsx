import * as React from 'react';
import * as Icon from 'react-fontawesome';

import { Activity } from '../../modules/activities';

import ActivityList from '../common/activity-list';
import SectionTitle from '../common/section-title';

interface Props {
  activities: Activity[];
}

const getEmptyContent = () => (
  <div className="empty">
    <Icon name="code-fork" fixedWidth size="3x" />
    <p className="empty-title">Nothing has happened in your project!</p>
    <p className="empty-meta">Commit some code to get things started.</p>
  </div>
);

const ProjectActivity = ({ activities }: Props) => (
  <section className="container">
    <SectionTitle><span>Activity</span></SectionTitle>
    {(activities.length === 0) ? getEmptyContent() :
      <ActivityList activities={activities} />
    }
  </section>
);

export default ProjectActivity;
