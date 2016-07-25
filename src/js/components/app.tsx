import * as React from 'react';

// require global styles
require('font-awesome/css/font-awesome.css');
import '../../scss/styles.scss';

import Footer from './footer';
import Header from './header';

interface AppProps {

}

export default class App extends React.Component<AppProps, any> {
  public render() {
    return (
      <div className="container grid-1200">
        <div className="columns">
          <div className="column">
            <Header />
            {this.props.children}
            <Footer />
          </div>
        </div>
      </div>
    );
  }
}
