import * as React from 'react';

// require global styles
require('font-awesome/css/font-awesome.css');
import './styles.scss';

import Footer from './footer';
import Header from './header';

interface Props {

}

class App extends React.Component<Props, any> {
  public render() {
    return (
      <div>
        <Header />
        {this.props.children}
        <Footer />
      </div>
    );
  }
}

export default App;
