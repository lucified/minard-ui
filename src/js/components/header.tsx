import * as React from 'react';
import { Link } from 'react-router';

const Icon = require('react-fontawesome');

interface HeaderProps extends React.Props<Header> {

}

class Header extends React.Component<HeaderProps, any> {
  public render() {
    return (
      <header className="navbar nav-default">
        <section className="navbar-header">
          <Link to="/" className="navbar-brand">Minard</Link>
        </section>
        <section className="navbar-section">
          <Link to="/"><Icon name="user" size="lg" /></Link>
        </section>
      </header>
    );
  }
}

export default Header;
