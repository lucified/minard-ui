import * as classNames from 'classnames';
import * as React from 'react';
import * as FlipMove from 'react-flip-move';

import { Branch } from '../../modules/branches';
import { FetchError, isFetchError } from '../../modules/errors';
import { Project } from '../../modules/projects';

import LoadingIcon from '../common/loading-icon';
import MinardLink from '../common/minard-link';
import SimpleSectionTitle from '../common/simple-section-title';
import BranchSummary from './branch-summary';

const styles = require('./project-branches.scss');

interface Props {
  branches: (Branch | FetchError | undefined)[] | undefined;
  project: Project;
  showAll?: boolean;
  count?: number;
}

const getEmptyContent = () => (
  <div className={styles.empty}>
    <h2>No branches</h2>
    <p>Push your first branch to the repository to get started.</p>
  </div>
);

const getBranches = (branches: (Branch | undefined)[]) => (
  <FlipMove enterAnimation="fade" leaveAnimation="fade">
    {branches.map(
      (branch, i) => branch ?
        <BranchSummary key={branch.id} branch={branch} /> :
        <LoadingIcon center key={i} />,
    )}
  </FlipMove>
);

class ProjectBranches extends React.Component<Props, void> {
  public render() {
    const { branches, project, showAll, count = 3 } = this.props;
    const title = showAll ? `All branches for ${project.name}` : 'Branches';

    if (!branches) {
      return (
        <section className="container-fluid">
          <SimpleSectionTitle><span>{title}</span></SimpleSectionTitle>
          <LoadingIcon className={styles.loading} center />
        </section>
      );
    }

    const filteredBranches = (branches.filter(branch => !isFetchError(branch)) as (Branch | undefined)[])
      .sort((a, b) => {
        if (a === undefined || a.latestActivityTimestamp === undefined) {
          return -1;
        }

        if (b === undefined || b.latestActivityTimestamp === undefined) {
          return 1;
        }

        return b.latestActivityTimestamp - a.latestActivityTimestamp;
      });
    const branchesToShow = showAll ? filteredBranches : filteredBranches.slice(0, count);
    const content = (branchesToShow.length === 0) ? getEmptyContent() : getBranches(branchesToShow);

    return (
      <section className={classNames(styles.root, showAll && styles['root-all'])}>
        <div className={classNames(showAll && 'container-fluid')}>
          <div className={styles.inner}>
            <SimpleSectionTitle><span>{title}</span></SimpleSectionTitle>
            {content}
            {(!showAll && filteredBranches.length > count) && (
              <MinardLink className={styles['show-all-branches-link']} showAll project={{ project }}>
                Show all branches ({filteredBranches.length})
              </MinardLink>
            )}
          </div>
        </div>
      </section>
    );
  }
}

export default ProjectBranches;
