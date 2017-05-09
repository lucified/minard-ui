let loggedInUserEmail: string| undefined;

export function login(email: string) {
  const intercom = (window as any).Intercom;
  if (process.env.INTERCOM_ID && intercom) {
    loggedInUserEmail = email;
    intercom('boot', {
      app_id: process.env.INTERCOM_ID,
      email,
    });

    return true;
  }

  return false;
}

export function logout() {
  loggedInUserEmail = undefined;
  const intercom = (window as any).Intercom;
  if (intercom) {
    intercom('shutdown');
  }
}

export function trackEvent(event: string) {
  const intercom = (window as any).Intercom;
  if (intercom) {
    intercom('trackEvent', event);
  }
}

export function update(options?: any) {
  const intercom = (window as any).Intercom;
  if (intercom) {
    intercom('update', { email: loggedInUserEmail, ...options });
  }
}
