import * as React from 'react';
import * as ReactCSSTransitionGroup from 'react-addons-css-transition-group';

// require global styles
require('font-awesome/css/font-awesome.css');
import './styles.scss';

import Footer from './footer';
import Header from './header';
import SubHeader from './sub-header';

require('./app.scss');

interface Props {
  location: any;
  route: any;
  params: any;
}

class App extends React.Component<Props, any> {
  private previousPath: string | null = null;

  private getTransition(previousPath: string | null, currentPath: string): string {
    if (previousPath === null) {
      return 'first-load';
    } else {
      const previousDepth = previousPath.split('/').length;
      const newDepth = currentPath.split('/').length;

      if (newDepth > previousDepth) {
        return 'zoom-in';
      } else if (newDepth < previousDepth) {
        return 'zoom-out';
      } else {
        return 'slide';
      }
    }
  }

  public render() {
    const { params, children, location } = this.props;
    const path = location.pathname;
    let transition = 'none';

    if (this.previousPath !== path) {
      transition = this.getTransition(this.previousPath, path);
      this.previousPath = path;
    }

    console.log('transition:', transition)

    return (
      <div>
        <Header />
        <SubHeader params={params} />
        <ReactCSSTransitionGroup
          component="div"
          transitionName={transition}
          transitionEnterTimeout={300}
          transitionLeaveTimeout={10}
        >
          {React.cloneElement(children as any, { key: path })}
        </ReactCSSTransitionGroup>
        <Footer />
      </div>
    );
  }
}

export default App;
