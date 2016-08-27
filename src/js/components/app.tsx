import * as React from 'react';

// require global styles
require('font-awesome/css/font-awesome.css');
import './styles.scss';

import Footer from './footer';
import Header from './header';
import SubHeader from './sub-header';

interface Props {
  location: any;
  route: any;
  params: any;
}

class App extends React.Component<Props, any> {
  public render() {
    return (
      <div>
        <Header />
        <SubHeader />
        {this.props.children}
        <Footer />
      </div>
    );
  }
}

export default App;
