import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  type User,
  type UserCredential,
} from '@react-native-firebase/auth';
import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { GOOGLE_WEB_CLIENT_ID } from '../config/firebase';

export type { User };

// iOS reads its client ID from GoogleService-Info.plist; Android needs the web client ID for an idToken.
GoogleSignin.configure(
  GOOGLE_WEB_CLIENT_ID ? { webClientId: GOOGLE_WEB_CLIENT_ID } : {},
);

const auth = () => getAuth();

export const watchAuth = (cb: (u: User | null) => void) =>
  onAuthStateChanged(auth(), cb);

export const signInEmail = (email: string, pw: string) =>
  signInWithEmailAndPassword(auth(), email.trim(), pw);

export async function signUpEmail(email: string, pw: string) {
  const cred = await createUserWithEmailAndPassword(auth(), email.trim(), pw);
  sendEmailVerification(cred.user).catch(() => {});
  return cred;
}

/** Resolves null when the student closes the Google sheet. */
export async function signInGoogle(): Promise<UserCredential | null> {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const res = await GoogleSignin.signIn();
  if (res.type !== 'success') return null;
  const token = res.data.idToken;
  if (!token) throw new Error('google/no-id-token');
  return signInWithCredential(auth(), GoogleAuthProvider.credential(token));
}

export const resetPassword = (email: string) =>
  sendPasswordResetEmail(auth(), email.trim());

export async function signOut() {
  await GoogleSignin.signOut().catch(() => {});
  await fbSignOut(auth());
}

/** Calm, student-facing copy for Firebase / Google sign-in errors. */
export function authMessage(e: unknown): string {
  if (isErrorWithCode(e) && e.code === statusCodes.IN_PROGRESS)
    return 'Google sign-in is already open.';
  const code = (e as { code?: string })?.code ?? '';
  console.warn('[authMessage]', code, (e as Error)?.message);
  switch (code) {
    case 'auth/email-already-in-use':
      return 'That email already has an account — try signing in.';
    case 'auth/invalid-email':
      return 'That email doesn’t look quite right.';
    case 'auth/weak-password':
      return 'Use at least 6 characters for your password.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'That email and password don’t match. Try again?';
    case 'auth/too-many-requests':
      return 'Too many tries. Take a breather and try again shortly.';
    case 'auth/network-request-failed':
    case 'firestore/unavailable':
      return 'You seem to be offline. Check your connection and try again.';
    case 'auth/account-exists-with-different-credential':
      return 'This email signs in another way — try email and password.';
    default:
      return 'Something went wrong signing you in. Please try again.';
  }
}
