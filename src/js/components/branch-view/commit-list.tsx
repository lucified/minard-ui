import * as classNames from 'classnames';
import * as React from 'react';
import * as Icon from 'react-fontawesome';

import { Commit } from '../../modules/commits';
import { FetchError } from '../../modules/errors';

import CommitRow from './commit-row';

const styles = require('./commit-list.scss');

const getEmptyContent = () => (
  <div>
    <Icon name="code-fork" fixedWidth size="3x" />
    <p>Nothing has happened in this branch!</p>
    <p>Commit some code to get things started.</p>
  </div>
);

interface Props {
  commits: (Commit | FetchError | undefined)[];
}

const CommitList = ({ commits }: Props) => (
  <section className={classNames(styles['commit-list'], 'container')}>
    {(commits.length === 0) ?
      getEmptyContent() :
      commits.map((commit, i) => <CommitRow key={i} commit={commit} />)
    }
  </section>
);

export default CommitList;
