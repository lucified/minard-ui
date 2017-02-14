import * as React from 'react';

// require global styles
require('font-awesome/css/font-awesome.css');
import './styles.scss';

import StreamingAPIHandler from './streaming-api-handler';

const styles = require('./app.scss');

interface PassedProps {
  location: any;
  route: any;
  params: any;
}

class App extends React.Component<PassedProps, any> {
  public componentWillMount() {
    const intercom = (window as any).Intercom;
    if (intercom) {
      // TODO: fix this

      /*intercom('boot', {
        app_id: 'i2twhziy',
        user_id: teamId, // TODO: add proper user_id and user_email once known
      });*/
    }
  }

  public render() {
    const { children } = this.props;

    return (
      <div id="minard-app" className={styles.app}>
        <StreamingAPIHandler />
        {children}
      </div>
    );
  }
};

export default App;
