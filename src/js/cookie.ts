export const getValue = (field: string): string | undefined => {
  const fieldEquals = `${field}=`;
  const found = document.cookie.split(';')
    .map(part => part.trim())
    .find(part => part.indexOf(fieldEquals) === 0);

  return found && decodeURIComponent(found.substring(fieldEquals.length));
};

export const setValue = (field: string, value: string, expiresInDays = 30, path = '/'): void => {
  let expires: string;

  if (expiresInDays) {
    const date = new Date();
    date.setTime(date.getTime() + expiresInDays * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  } else {
    expires = '';
  }

  document.cookie = `${field}=${encodeURIComponent(value)}${expires}; path=${path}`;
};

export const removeValue = (field: string, path = '/'): void => {
  setValue(field, '', -1, path);
};
