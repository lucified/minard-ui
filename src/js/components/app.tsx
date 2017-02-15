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

const App: React.StatelessComponent<PassedProps> = ({ children }) => (
  <div id="minard-app" className={styles.app}>
    <StreamingAPIHandler />
    {children}
  </div>
);

export default App;
