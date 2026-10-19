import {
  destinationAfterLogin,
  validateAuthForm,
  launchDestination,
} from '../authForm';

describe('account forms', () => {
  it('accepts surrounding email whitespace without changing the password', () => {
    expect(
      validateAuthForm('up', ' student@college.edu ', ' secret ', ' secret '),
    ).toBeNull();
    expect(
      validateAuthForm('up', 'student@college.edu', ' secret ', 'secret'),
    ).toMatch(/don’t match/);
  });
  it('validates new passwords but lets Firebase validate existing credentials', () => {
    expect(
      validateAuthForm('up', 'student@college.edu', 'short', 'short'),
    ).toMatch(/6 characters/);
    expect(
      validateAuthForm('in', 'student@college.edu', 'short', ''),
    ).toBeNull();
    expect(validateAuthForm('in', 'invalid', 'secret', '')).toMatch(/email/);
    expect(validateAuthForm('in', 'student@college.edu', '', '')).toMatch(
      /password/,
    );
  });
  it('routes only email signups to email verification', () => {
    expect(destinationAfterLogin(false, true)).toBe('VerifyEmail');
    expect(destinationAfterLogin(false, false)).toBe('Details');
    expect(destinationAfterLogin(true, false)).toBe('Main');
    expect(destinationAfterLogin(true, true)).toBe('Main');
  });
});

it('resumes local guest access without treating the guest as authenticated', () => {
  const local = {
    signedIn: false,
    guestMode: true,
    onboarded: true,
    splashSeen: true,
  };
  expect(launchDestination(local)).toBe('Main');
  expect(launchDestination({ ...local, onboarded: false })).toBe('Details');
  expect(launchDestination({ ...local, guestMode: false })).toBe('Login');
  expect(
    launchDestination({ ...local, guestMode: false, splashSeen: false }),
  ).toBe('Intro');
});
