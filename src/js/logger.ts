// Level can be 'info', 'warning', or 'error'

export const logMessage = (message: string, extra?: any, level = 'error'): void => {
  console.error(message, extra);
  // We need to not load 'raven-js' when running tests
  if (typeof window !== 'undefined') {
    const Raven = require('raven-js');
    if (Raven.isSetup()) {
      Raven.captureMessage(message, { extra, level });
    }
  }
};

export const logException = (message: string, ex: any, extra?: any, level = 'error'): void => {
  console.error(message, ex, extra);
  // We need to not load 'raven-js' when running tests
  if (typeof window !== 'undefined') {
    const Raven = require('raven-js');
    if (Raven.isSetup()) {
      Raven.captureException(ex, { extra, level });
    }
  }
};
