import * as React from 'react';
import * as Icon from 'react-fontawesome';

import { Commit } from '../../modules/commits';

import SectionTitle from '../common/section-title';
import SingleCommit from './single-commit';

interface Props {
  commits: Commit[];
}

class CommitList extends React.Component<Props, any> {
  private getEmptyContent() {
    return (
      <div className="empty">
        <Icon name="code-fork" fixedWidth size="3x" />
        <p className="empty-title">Nothing has happened in this branch!</p>
        <p className="empty-meta">Commit some code to get things started.</p>
      </div>
    );
  }

  private getLoadingContent(key: number) {
    return (
      <div key={key} className="empty">
        <Icon name="circle-o-notch" spin fixedWidth size="3x" />
        <p className="empty-title">Loading commit</p>
        <p className="empty-meta">Hold on a sec…</p>
      </div>
    );
  }

  public render() {
    const { commits } = this.props;

    return (
      <div>
        <SectionTitle>Branches</SectionTitle>
        {(commits.length === 0) ? this.getEmptyContent() : (
          <div className="columns">
            <div className="column col-2" />
            <div className="column col-8">
              {commits.map((commit, i) => commit ?
                <SingleCommit key={i} commit={commit} /> :
                this.getLoadingContent(i)
              )}
            </div>
            <div className="column col-2" />
          </div>
        )}
      </div>
    );
  }
}

export default CommitList;
