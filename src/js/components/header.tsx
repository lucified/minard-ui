import * as React from 'react';
import * as Icon from 'react-fontawesome';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import Errors, { FetchError } from '../modules/errors';
import { StateTree } from '../reducers';

interface PassedProps {

}

interface GeneratedStateProps {
  errors: FetchError[];
}

interface GeneratedDispatchProps {
  clearError: (error: FetchError) => void;
}

const Header = ({ errors, clearError }: PassedProps & GeneratedStateProps & GeneratedDispatchProps) => (
  <div className="columns">
    <div className="column col-12">
      <header className="navbar nav-default">
        <section className="navbar-header">
          <Link to="/" className="navbar-brand">Minard</Link>
        </section>
        <section className="navbar-section">
          {errors && errors.length > 0 && (
            <div className="toast toast-danger">
              <button onClick={() => clearError(errors[0])} className="btn btn-clear float-right" />
              <span className="icon icon-error_outline" />
              {errors[0].prettyError}
            </div>
          )}
        </section>
        <section className="navbar-section">
          <a href="#"><Icon name="user" size="lg" /></a>
        </section>
      </header>
    </div>
  </div>
);

const mapStateToProps = (state: StateTree, ownProps: PassedProps): GeneratedStateProps => {
  return {
    errors: Errors.selectors.getErrors(state),
  };
};

export default connect<GeneratedStateProps, GeneratedDispatchProps, PassedProps>(mapStateToProps, {
  clearError: Errors.actions.clearError,
})(Header);
