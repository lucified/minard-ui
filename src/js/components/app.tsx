import * as React from 'react';

// require global styles
require('font-awesome/css/font-awesome.css');
import '../../scss/styles.scss';

interface AppProps extends React.Props<App> {

}

export default class App extends React.Component<AppProps, any> {
  public render() {
    return (
      <h1>Testing</h1>
    );
  }
}
