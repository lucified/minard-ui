import * as Raven from 'raven-js';

export const logMessage = (
  message: string,
  extra?: any,
  level: 'error' | 'critical' | 'warn' | 'info' | 'debug' | undefined = 'error',
): void => {
  console.error(message, extra);
  if (Raven.isSetup()) {
    Raven.captureMessage(message, { extra, level });
  }
};

export const logException = (
  message: string,
  ex: any,
  extra?: any,
  level: 'error' | 'critical' | 'warn' | 'info' | 'debug' | undefined = 'error',
): void => {
  console.error(message, ex, extra);
  if (Raven.isSetup()) {
    Raven.captureException(ex, { extra, level });
  }
};
