import * as React from 'react';
import { connect } from 'react-redux';

import { reloadPage } from '../helpers';
import Errors, { FetchCollectionError } from '../modules/errors';
import Streaming, { ConnectionState } from '../modules/streaming';
import { StateTree } from '../reducers';

const errorImage = require('../../images/icon-no-network.svg');

const styles = require('./error-popup.scss');

interface GeneratedStateProps {
  errors: FetchCollectionError[];
  connectionState: ConnectionState;
}

type Props = GeneratedStateProps;

function ErrorPopup({ errors, connectionState }: Props) {
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
    errorContent = <div>Hold on, connecting...</div>;
  }

  if (errorContent && errorClass) {
    error = (
      <div className={errorClass} key="error-dialog">
        <img className={styles['error-image']} src={errorImage} />
        {errorContent}
      </div>
    );
  }

  return error;
}

const mapStateToProps = (state: StateTree): GeneratedStateProps => ({
  errors: Errors.selectors.getFetchCollectionErrors(state),
  connectionState: Streaming.selectors.getConnectionState(state),
});

export default connect<GeneratedStateProps, {}, {}>(mapStateToProps)(
  ErrorPopup,
);
