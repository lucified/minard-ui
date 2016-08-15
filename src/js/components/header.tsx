import * as classNames from 'classnames';
import * as React from 'react';
import * as Icon from 'react-fontawesome';
import * as Gravatar from 'react-gravatar';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import Errors, { FetchError } from '../modules/errors';
import Selected from '../modules/selected';
import { StateTree } from '../reducers';

const styles = require('./header.scss');

interface PassedProps {

}

interface GeneratedStateProps {
  selectedSection: string;
  errors: FetchError[];
}

interface GeneratedDispatchProps {
  clearError: (error: FetchError) => void;
}

type Props = PassedProps & GeneratedStateProps & GeneratedDispatchProps;

const Header = ({ errors, clearError, selectedSection }: Props) => (
  <section className={styles['header-background']}>
    <section className={classNames('container', 'grid-1200')}>
      <header className={classNames(styles.header, 'navbar')}>
        <section className={classNames(styles['link-container'], 'navbar-section')}>
          <ul>
            <li className={classNames(styles.link, { [styles.active]: selectedSection === 'team-projects' })}>
              <Link to="/">Projects</Link>
            </li>
            <li className={styles.link}>
              <Link to="/">Activity</Link>
            </li>
          </ul>
        </section>
        <section className="navbar-section">
          {errors && errors.length > 0 ? (
            <div className="toast toast-danger">
              <button onClick={() => clearError(errors[0])} className="btn btn-clear float-right" />
              <span className="icon icon-error_outline" />
              {errors[0].prettyError}
            </div>
          ) : <h3 title="Minard" className={styles.minard}>m</h3>}
        </section>
        <section className={classNames(styles['profile-container'], 'navbar-section')}>
          <a className={styles['team-dropdown']} href="#">
            Team Lucify <Icon name="caret-down" />
          </a>
          <a href="#">
            <figure className="avatar avatar-lg">
              <Gravatar email="ville.saarinen@gmail.com" rating="pg" https size={96} />
            </figure>
          </a>
        </section>
      </header>
    </section>
  </section>
);

const mapStateToProps = (state: StateTree, ownProps: PassedProps): GeneratedStateProps => {
  // TODO: Improve this
  const selectedSection = Selected.selectors.getSelectedBranch(state) === null &&
    Selected.selectors.getSelectedProject(state) === null ? 'team-projects' : 'other';

  return {
    errors: Errors.selectors.getErrors(state),
    selectedSection,
  };
};

export default connect<GeneratedStateProps, GeneratedDispatchProps, PassedProps>(mapStateToProps, {
  clearError: Errors.actions.clearError,
})(Header);
