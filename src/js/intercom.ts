let loggedInUserEmail: string | undefined;

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

/*
 * The goal of this update is to update the information about the current
 * page. This needs to be done manually since we're not refreshing the page
 * whenever the user navigates around. However, it doesn't seem to work at
 * the moment. We'll keep it here to see if it provides some value.
 *
 * TOOD: Make sure this works or remove it along with loggedInUserEmail.
 */
export function update(options?: any) {
  const intercom = (window as any).Intercom;
  if (loggedInUserEmail && intercom) {
    intercom('update', { email: loggedInUserEmail, ...options });
  }
}
