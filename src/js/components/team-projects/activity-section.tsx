import * as React from 'react';
import * as Icon from 'react-fontawesome';

import { Activity } from '../../modules/activities';

import ActivityList from '../common/activity-list';
import SectionTitle from '../common/section-title';

interface Props {
  activities: Activity[];
}

class ActivitySection extends React.Component<Props, any> {
  private getEmptyContent() {
    return (
      <div className="empty">
        <Icon name="code-fork" fixedWidth size="3x" />
        <p className="empty-title">Nothing has happened in your projects!</p>
        <p className="empty-meta">Commit some code to get things started.</p>
      </div>
    );
  }

  public render() {
    const { activities } = this.props;

    return (
      <div>
        <SectionTitle>Activity</SectionTitle>
        {(activities.length === 0) ? this.getEmptyContent() : (
          <div className="columns">
            <div className="column col-1" />
            <div className="column col-10">
              <ActivityList activities={activities} showProjectName={true} />
            </div>
            <div className="column col-1" />
          </div>
        )}
      </div>
    );
  }
}

export default ActivitySection;
