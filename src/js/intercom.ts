export function login(email: string) {
  const intercom = (window as any).Intercom;
  if (process.env.INTERCOM_ID && intercom) {
    intercom('boot', {
      app_id: process.env.INTERCOM_ID,
      user_id: email,
      email,
    });

    return true;
  }

  return false;
}

export function logout() {
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
    intercom('update', options);
  }
}
