import * as React from 'react';
import * as ModalDialog from 'react-modal';

const ReactConfirm = require('react-confirm');

const styles = require('./confirm.scss');

interface Props {
  show: boolean; // from confirmable. indicates if the dialog is shown or not.
  proceed: (args?: any) => void; // from confirmable. call to close the dialog with promise resolved.
  cancel: (args?: any) => void; // from confirmable. call to close the dialog with promise rejected.
  dismiss: (args?: any) => void; // from confirmable. call to only close the dialog.
  confirmation: string; // confirmation message from the confirm function
  options: any; // options from the confirm function
}

let ConfirmDialog = ({show, proceed, dismiss, cancel, confirmation, options}: Props) => (
  <ModalDialog className={styles.dialog} overlayClassName={styles.overlay} onRequestClose={dismiss} isOpen={show}>
    <p>{confirmation}</p>
    <div>
      <button onClick={() => cancel()}>Cancel</button>
      <button onClick={() => proceed()}>OK</button>
    </div>
  </ModalDialog>
);

ConfirmDialog = ReactConfirm.confirmable(ConfirmDialog);
const confirmFunction = ReactConfirm.createConfirmation(ConfirmDialog);

export default function(confirmation: string, options = {}) {
  return confirmFunction({ confirmation, options });
}
