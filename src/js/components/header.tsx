import * as React from 'react';
import * as Icon from 'react-fontawesome';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import Errors, { FetchError } from '../modules/errors';
import { StateTree } from '../reducers';

interface PassedProps {

}

interface GeneratedProps {
  errors: FetchError[];
}

const getErrorToast = (error: FetchError) => (
  <div className="toast toast-danger">
    <button className="btn btn-clear float-right" />
    <span className="icon icon-error_outline" />
    {error.error}
  </div>
);

const Header = ({ errors }: PassedProps & GeneratedProps) => (
  <div className="columns">
    <div className="column col-12">
      <header className="navbar nav-default">
        <section className="navbar-header">
          <Link to="/" className="navbar-brand">Minard</Link>
        </section>
        <section className="navbar-section">
          {errors && errors.length > 0 && getErrorToast(errors[0])}
        </section>
        <section className="navbar-section">
          <a href="#"><Icon name="user" size="lg" /></a>
        </section>
      </header>
    </div>
  </div>
);

const mapStateToProps = (state: StateTree, ownProps: PassedProps): GeneratedProps => {
  return {
    errors: Errors.selectors.getErrors(state),
  };
};

export default connect<GeneratedProps, {}, PassedProps>(mapStateToProps)(Header);
