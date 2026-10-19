import { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import {
  getAuth,
  reload,
  sendEmailVerification,
} from '@react-native-firebase/auth';
import { BlurIn } from '../kit/components/BlurIn';
import { Surface } from '../components/surface';
import {
  Icon,
  IconButton,
  PrimaryButton,
  Screen,
  SecondaryButton,
  Txt,
} from '../components/ui';
import { useSubjectColors, useColors, useTypography } from '../theme';
import { useStore } from '../data/store';
import { useNav } from '../navigation';
import { authMessage } from '../data/auth';

// Firebase verifies by email link, so no pretend six-digit-code endpoint is used.
export function VerifyEmail() {
  const SUBJ = useSubjectColors();
  const C = useColors();
  const TYPE = useTypography();
  const nav = useNav();
  const { signOut } = useStore();
  const [busy, setBusy] = useState(false);
  const [verified, setVerified] = useState(false);
  const [message, setMessage] = useState(
    'Open the verification link in your inbox, then check below.',
  );
  const user = getAuth().currentUser;
  const check = async (resend = false) => {
    if (!user || busy) return;
    setBusy(true);
    try {
      if (resend) {
        await sendEmailVerification(user);
        setMessage('A new verification link is on its way.');
      } else {
        await reload(user);
        const confirmed = getAuth().currentUser?.emailVerified ?? false;
        setVerified(confirmed);
        setMessage(
          confirmed
            ? 'Your email is verified.'
            : 'The link hasn’t been confirmed yet. Check your inbox and spam folder.',
        );
      }
    } catch (error) {
      setMessage(authMessage(error));
    } finally {
      setBusy(false);
    }
  };
  return (
    <Screen gutter={24}>
      <IconButton
        icon="chevron-left"
        label="Back"
        onPress={() => { signOut().then(() => nav.reset({ index: 0, routes: [{ name: 'Login' }] })).catch(error => setMessage(authMessage(error))); }}
      />
      <View style={{ marginTop: 48, gap: 20 }}>
        <Txt style={TYPE.onboard}>Check your email</Txt>
        <Txt style={{ color: C.inkMuted }}>
          We sent a verification link to {user?.email ?? 'your email'}.
        </Txt>
        <BlurIn replayKey={verified ? 'verified' : 'inbox'} rise={0}>
          <Surface
            kind="clay"
            style={{
              minHeight: 64,
              padding: 20,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
            }}
          >
            {busy ? (
              <ActivityIndicator color={C.ink} />
            ) : (
              <Icon
                name={verified ? 'check' : 'lock'}
                color={verified ? SUBJ.dds.text : C.ink}
              />
            )}
            <Txt
              accessibilityLiveRegion="polite"
              style={{ flex: 1, color: verified ? SUBJ.dds.text : C.ink }}
            >
              {message}
            </Txt>
          </Surface>
        </BlurIn>
        <PrimaryButton
          disabled={busy}
          label={verified ? 'Continue' : 'I’ve opened the link'}
          onPress={() => (verified ? nav.replace('Details') : check())}
        />
        {!verified && (
          <SecondaryButton
            label="Resend verification link"
            onPress={() => check(true)}
          />
        )}
        {!verified && (
          <SecondaryButton
            variant="outline"
            label="Continue for now"
            onPress={() => nav.replace('Details')}
          />
        )}
      </View>
    </Screen>
  );
}
