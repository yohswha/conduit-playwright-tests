export function getCredentials() {
  const { CONDUIT_EMAIL: email, CONDUIT_PASSWORD: password } = process.env;

  if (!email || !password) {
    throw new Error('CONDUIT_EMAIL and CONDUIT_PASSWORD must be set');
  }

  return { email, password };
}