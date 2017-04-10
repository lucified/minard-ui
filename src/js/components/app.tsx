import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';

// require global styles
require('font-awesome/css/font-awesome.css');
import './styles.scss';

import User, { Team } from '../modules/user';
import { StateTree } from '../reducers';
import StreamingAPIHandler from './streaming-api-handler';

const styles = require('./app.scss');

interface Params {
  deploymentId?: string;
  commitHash?: string;
  branchId?: string;
  projectId?: string;
  commentId?: string;
  view?: string;
  teamToken?: string;
  show?: string;
}

interface GeneratedStateProps {
  team?: Team;
}

type Props = RouteComponentProps<Params, {}> & GeneratedStateProps;

class App extends React.Component<Props, void> {
  public render() {
    const { children, team, params: { deploymentId, commitHash } } = this.props;

    return (
      <div id="minard-app" className={styles.app}>
        <StreamingAPIHandler team={team} deploymentId={deploymentId} commitHash={commitHash} />
        {children}
      </div>
    );
  }
}

const mapStateToProps = (state: StateTree): GeneratedStateProps => ({
  team: User.selectors.getTeam(state),
});

export default connect<GeneratedStateProps, {}, RouteComponentProps<Params, {}>>(
  mapStateToProps,
)(App);
