import * as React from 'react';

interface Props extends React.Props<App> {

}

export default class App extends React.Component<Props, any> {
  public render() {
    return (
      <h1>Testing</h1>
    );
  }
}
