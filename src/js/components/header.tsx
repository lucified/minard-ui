import * as classNames from 'classnames';
import * as React from 'react';
// import * as Icon from 'react-fontawesome';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { teamName } from '../api/team-id';
import Errors, { FetchCollectionError } from '../modules/errors';
import Selected from '../modules/selected';
import Streaming, { ConnectionState } from '../modules/streaming';
import { StateTree } from '../reducers';

// import Avatar from './common/avatar';

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

const reloadPage = (e: React.MouseEvent<HTMLElement>) => {
  e.preventDefault();
  e.stopPropagation();

  location.reload(true);
};

const Header = ({ errors, selectedSection, connectionState }: Props) => {
  let error: JSX.Element | null = null;
  let errorContent: JSX.Element | null = null;
  let errorClass: string = '';
  if (errors && errors.length > 0) {
    errorClass = styles['error-box'];
    errorContent = (
      <div>
        Uhhoh, we seem to be having<br />
        connection problems.
      </div>
    );
  } else if (connectionState === ConnectionState.CLOSED) {
    errorClass = styles['error-box'];
    errorContent = (
      <div>
        Connection lost. Trying to reconnect...<br />
        <a onClick={reloadPage}>Click to reload</a>
      </div>
    );
  } else if (connectionState === ConnectionState.CONNECTING) {
    errorClass = styles['connection-box'];
    errorContent = (
      <div>
        Hold on, connecting...
      </div>
    );
  }

  if (errorContent && errorClass) {
    error = (
      <div className={errorClass}>
        <img className={styles['error-image']} src={errorImage} />
        {errorContent}
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
              <Link to="/">
                <li className={classNames(styles.link, { [styles.active]: selectedSection === 'homepage' })}>
                  Home
                </li>
              </Link>
            </ul>
          </div>
          <div className={classNames(styles.logo, 'col-xs')}>
            <h1 title="Minard" className={styles.minard}>m</h1>
          </div>
          <div className={classNames(styles['profile-container'], 'col-xs')}>
            <span className={styles['team-dropdown']}>
              {teamName/* TODO: add link and <Icon className={styles.caret} name="caret-down" /> */}
            </span>
            {/* TODO: <Avatar size="lg" email="ville.saarinen@gmail.com" />*/}
          </div>
        </div>
      </div>
    </section>
  );
};

const mapStateToProps = (state: StateTree): GeneratedStateProps => {
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
