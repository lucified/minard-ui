import * as classNames from 'classnames';
import * as React from 'react';
import * as Icon from 'react-fontawesome';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import Errors, { FetchCollectionError } from '../modules/errors';
import Selected from '../modules/selected';
import Streaming, { ConnectionState } from '../modules/streaming';
import { StateTree } from '../reducers';

import Avatar from './common/avatar';

const styles = require('./header.scss');
const errorImage = require('../../images/icon-no-network.svg');

interface PassedProps {

}

interface GeneratedStateProps {
  selectedSection: string;
  errors: FetchCollectionError[];
  connectionState: ConnectionState;
}

interface GeneratedDispatchProps {

}

type Props = PassedProps & GeneratedStateProps & GeneratedDispatchProps;

const reloadPage = (e: any) => {
  location.reload(true);
  return false;
};

const Header = ({ errors, selectedSection, connectionState }: Props) => {
  let error: JSX.Element | null = null;
  if (errors && errors.length > 0) {
    error = (
      <div className={styles['error-box']}>
        <img className={styles['error-image']} src={errorImage} />
        <div>
          Uhhoh, we seem to be having<br />
          connection problems.
        </div>
      </div>
    );
  } else if (connectionState === ConnectionState.CLOSED) {
    error = (
      <div className={styles['error-box']}>
        <img className={styles['error-image']} src={errorImage} />
        <div>
          Connection lost. Trying to reconnect...<br />
          <a onClick={reloadPage}>Click to reload</a>
        </div>
      </div>
    );
  } else if (connectionState === ConnectionState.CONNECTING) {
    error = (
      <div className={styles['connection-box']}>
        <img className={styles['error-image']} src={errorImage} />
        <div>
          Hold on, connecting...
        </div>
      </div>
    );
  }

  return (
    <section className={styles['header-background']}>
      {error}
      <div className="container">
        <div className={classNames(styles.header, 'row', 'between-xs', 'middle-xs')}>
          <div className={classNames(styles['link-container'], 'col-xs')}>
            <ul className={styles.links}>
              <li className={classNames(styles.link, { [styles.active]: selectedSection === 'homepage' })}>
                <Link to="/">Home</Link>
              </li>
            </ul>
          </div>
          <div className={classNames(styles.logo, 'col-xs')}>
            <h1 title="Minard" className={styles.minard}>m</h1>
          </div>
          <div className={classNames(styles['profile-container'], 'col-xs')}>
            <a className={styles['team-dropdown']} href="#">
              Team Lucify <Icon name="caret-down" />
            </a>
            <a href="#">
              <Avatar size="lg" email="ville.saarinen@gmail.com" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const mapStateToProps = (state: StateTree, ownProps: PassedProps): GeneratedStateProps => {
  const selectedSection =
    Selected.selectors.getSelectedBranch(state) === null &&
    Selected.selectors.getSelectedProject(state) === null &&
    !Selected.selectors.isShowingAll(state) ?
      'homepage' : 'other';

  return {
    errors: Errors.selectors.getFetchCollectionErrors(state),
    selectedSection,
    connectionState: Streaming.selectors.getConnectionState(state),
  };
};

export default connect<GeneratedStateProps, GeneratedDispatchProps, PassedProps>(mapStateToProps)(Header);
