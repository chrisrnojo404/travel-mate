import { Redirect } from 'expo-router';

import { usePreferencesStore } from '@/store/preferencesStore';

export default function IndexScreen() {
  const hydrated = usePreferencesStore((state) => state.hydrated);
  const onboardingCompleted = usePreferencesStore((state) => state.onboardingCompleted);

  if (!hydrated) {
    return null;
  }

  return <Redirect href={onboardingCompleted ? '/dashboard' : '/onboarding'} />;
}
