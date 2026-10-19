export function validateAuthForm(
  mode: 'in' | 'up',
  email: string,
  password: string,
  confirmation: string,
) {
  if (!/^\S+@\S+\.\S+$/.test(email.trim()))
    return 'That email doesn’t look quite right.';
  if (!password) return 'Enter your password.';
  if (mode === 'up' && password.length < 6)
    return 'Use at least 6 characters for your password.';
  if (mode === 'up' && confirmation !== password)
    return 'Your passwords don’t match yet.';
  return null;
}
export function destinationAfterLogin(
  onboarded: boolean,
  emailSignup: boolean,
) {
  return onboarded ? 'Main' : emailSignup ? 'VerifyEmail' : 'Details';
}
export function launchDestination(state: {
  signedIn: boolean;
  guestMode?: boolean;
  onboarded: boolean;
  splashSeen: boolean;
}) {
  if (state.signedIn || state.guestMode)
    return state.onboarded ? 'Main' : 'Details';
  return state.splashSeen ? 'Login' : 'Intro';
}
