import * as React from 'react';
import * as Icon from 'react-fontawesome';
import { Link } from 'react-router';

interface Props {

}

class Header extends React.Component<Props, any> {
  public render() {
    return (
      <div className="columns">
        <div className="column col-12">
          <header className="navbar nav-default">
            <section className="navbar-header">
              <Link to="/" className="navbar-brand">Minard</Link>
            </section>
            <section className="navbar-section">
              <Link to="/"><Icon name="user" size="lg" /></Link>
            </section>
          </header>
        </div>
      </div>
    );
  }
}

export default Header;
