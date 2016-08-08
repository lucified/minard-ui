import * as React from 'react';
import * as Icon from 'react-fontawesome';

import { Commit } from '../../modules/commits';
import { FetchError, isError } from '../../modules/errors';

import SectionTitle from '../common/section-title';
import SingleCommit from './single-commit';

const getEmptyContent = () => (
  <div className="empty">
    <Icon name="code-fork" fixedWidth size="3x" />
    <p className="empty-title">Nothing has happened in this branch!</p>
    <p className="empty-meta">Commit some code to get things started.</p>
  </div>
);

const getLoadingContent = (key: number) => (
  <div key={key} className="empty">
    <Icon name="circle-o-notch" spin fixedWidth size="3x" />
    <p className="empty-title">Loading commit</p>
    <p className="empty-meta">Hold on a sec…</p>
  </div>
);

const getErrorContent = (commit: FetchError) => (
  <div key={commit.id} className="empty">
    <Icon name="exclamation" fixedWidth size="3x" />
    <p className="empty-title">Error :(</p>
    <p className="empty-meta">{commit.error}</p>
  </div>
);

interface Props {
  commits: (Commit | FetchError)[];
}

const CommitList = ({ commits }: Props) => (
  <div>
    <SectionTitle>Branches</SectionTitle>
    {(commits.length === 0) ? getEmptyContent() : (
      <div className="columns">
        <div className="column col-2" />
        <div className="column col-8">
          {commits.map((commit, i) => {
            if (!commit) {
              return getLoadingContent(i);
            } else if (isError(commit)) {
              return getErrorContent(commit);
            }

            return <SingleCommit key={i} commit={commit} />;
          })}
        </div>
        <div className="column col-2" />
      </div>
    )}
  </div>
);

export default CommitList;
