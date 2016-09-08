export const prettyErrorMessage = (error: string): string => {
  // Unable to parse JSON. Might happen from a 404
  if (error.indexOf('Unexpected token') >= 0) {
    return 'Error understanding response';
  }

  // Can't connect to server
  if (error.indexOf('Failed to fetch') >= 0) {
    return 'Unable to connect';
  }

  return error;
};
