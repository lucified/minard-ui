import * as React from 'react';
import { connect, Dispatch } from 'react-redux';

// require global styles
require('font-awesome/css/font-awesome.css');
import './styles.scss';

import Selected from '../modules/selected';
import StreamingAPIHandler from './streaming-api-handler';

const styles = require('./app.scss');

interface PassedProps {
  location: any;
  route: any;
  params: any;
}

interface GeneratedDispatchProps {
  setSelected: (project: string | null, branch: string | null, showAll: boolean) => void;
}

type Props = PassedProps & GeneratedDispatchProps;

class App extends React.Component<Props, void> {
  public componentDidMount() {
    const { location, setSelected } = this.props;

    // TODO: this is rather fragile and duplicated from entrypoint.tsx since history.listen()
    // does not fire on initial load. Refactor somehow?
    const result = /^\/project\/([^/]+)(\/branch\/([^/]+))?/.exec(location.pathname);
    const project = (result && result[1]) || null;
    const branch = (result && result[3]) || null;
    const showAll = /\/all$/.exec(location.pathname); // This will break if we have an id that is "all"

    setSelected(project, branch, !!showAll);
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
}

const mapDispatchToProps = (dispatch: Dispatch<any>): GeneratedDispatchProps => ({
  setSelected: (project: string | null, branch: string | null, showAll: boolean) => {
    dispatch(Selected.actions.setSelected(project, branch, showAll));
  },
});

export default connect<{}, GeneratedDispatchProps, PassedProps>(() => ({}), mapDispatchToProps)(App);
