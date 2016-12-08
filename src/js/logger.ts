import * as Raven from 'raven-js';

// Level can be 'info', 'warning', or 'error'
export const logMessage = (message: string, extra?: any, level = 'error'): void => {
  console.error(message, extra);
  if (Raven.isSetup()) {
    Raven.captureMessage(message, { extra, level });
  }
};

export const logException = (message: string, ex: any, extra?: any, level = 'error'): void => {
  console.error(message, ex, extra);
  if (Raven.isSetup()) {
    Raven.captureException(ex, { extra, level });
  }
};
