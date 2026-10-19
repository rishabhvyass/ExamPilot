import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type TabParams = {
  Today: undefined;
  Calendar: undefined;
  Subjects: undefined;
  Questions: undefined;
};
export type RootParams = {
  Splash: undefined;
  Intro: undefined;
  Login: { mode?: 'in' | 'up' } | undefined;
  VerifyEmail: undefined;
  Details: undefined;
  Admit: undefined;
  Plan: undefined;
  Main: { screen?: keyof TabParams } | undefined;
  Materials: { subjectId?: string } | undefined;
  Assistant: undefined;
  Pdf: { id: string; page?: number };
};
export const useNav = () =>
  useNavigation<NativeStackNavigationProp<RootParams>>();
