import * as classNames from 'classnames';
import * as React from 'react';
import * as Icon from 'react-fontawesome';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import Errors, { FetchCollectionError } from '../modules/errors';
import Selected from '../modules/selected';
import { StateTree } from '../reducers';

import Avatar from './common/avatar';

const styles = require('./header.scss');
const errorImage = require('../../images/icon-no-network.svg');

interface PassedProps {

}

interface GeneratedStateProps {
  selectedSection: string;
  errors: FetchCollectionError[];
}

interface GeneratedDispatchProps {

}

type Props = PassedProps & GeneratedStateProps & GeneratedDispatchProps;

const Header = ({ errors, selectedSection }: Props) => (
  <section className={styles['header-background']}>
    {errors && errors.length > 0 && (
      <div className={styles['error-box']}>
        <img className={styles['error-image']} src={errorImage} />
        <div>
          Uhhoh, we seem to be having<br />
          connection problems.
        </div>
      </div>
    )}
    <div className="container">
      <div className={classNames(styles.header, 'row', 'between-xs', 'middle-xs')}>
        <div className={classNames(styles['link-container'], 'col-xs')}>
          <ul className={styles.links}>
            <li className={classNames(styles.link, { [styles.active]: selectedSection === 'team-projects' })}>
              <Link to="/">Projects</Link>
            </li>
            <li className={styles.link}>
              <Link to="/">Activity</Link>
            </li>
          </ul>
        </div>
        <div className={classNames(styles.logo, 'col-xs')}>
          <h1 title="Minard" className={styles.minard}>m</h1>
        </div>
        <div className={classNames(styles['profile-container'], 'col-xs')}>
          <a className={styles['team-dropdown']} href="#">
            Team Lucify <Icon name="caret-down" />
          </a>
          <a href="#">
            <Avatar size="lg" email="ville.saarinen@gmail.com" />
          </a>
        </div>
      </div>
    </div>
  </section>
);

const mapStateToProps = (state: StateTree, ownProps: PassedProps): GeneratedStateProps => {
  // TODO: Improve this
  const selectedSection = Selected.selectors.getSelectedBranch(state) === null &&
    Selected.selectors.getSelectedProject(state) === null ? 'team-projects' : 'other';

  return {
    errors: Errors.selectors.getFetchCollectionErrors(state),
    selectedSection,
  };
};

export default connect<GeneratedStateProps, GeneratedDispatchProps, PassedProps>(mapStateToProps)(Header);
