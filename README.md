# TravelMate AI

TravelMate AI is an Expo + React Native travel assistant that will help users adapt to new countries with currency conversion, translation, travel phrases, and location-aware defaults.

## Current progress

This first increment includes:

- Expo Router project setup
- Persisted onboarding preferences with Zustand + AsyncStorage
- Shared project structure for screens, services, types, constants, hooks, and components
- A complete onboarding screen
- Mock-ready service layer for exchange rates, translation, and location detection

The remaining screens will be added incrementally.

## Project structure

```text
app/
  _layout.tsx
  dashboard.tsx
  index.tsx
  onboarding.tsx
components/
  PickerField.tsx
  PrimaryButton.tsx
  ScreenContainer.tsx
  SelectionCard.tsx
constants/
  countryProfiles.ts
  options.ts
  theme.ts
  travelPhrases.ts
hooks/
  useOnboardingForm.ts
services/
  exchangeService.ts
  locationService.ts
  translationService.ts
store/
  preferencesStore.ts
types/
  index.ts
utils/
  date.ts
  storage.ts
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Add environment variables in a `.env` file at the project root if you want to use real APIs:

```bash
EXPO_PUBLIC_EXCHANGE_API_URL=
EXPO_PUBLIC_EXCHANGE_API_KEY=
EXPO_PUBLIC_TRANSLATION_API_URL=
EXPO_PUBLIC_TRANSLATION_API_KEY=
```

3. Start the project:

```bash
npx expo start
```

## API key placement

- Put currency API values in `EXPO_PUBLIC_EXCHANGE_API_URL` and `EXPO_PUBLIC_EXCHANGE_API_KEY`
- Put translation API values in `EXPO_PUBLIC_TRANSLATION_API_URL` and `EXPO_PUBLIC_TRANSLATION_API_KEY`
- If those values are missing, the app uses mock fallback behavior so local development still works

## Notes

- `services/exchangeService.ts` is already prepared to cache the most recent rate locally
- `services/translationService.ts` is prepared for a real translation backend and falls back to mock translations
- `services/locationService.ts` uses `expo-location` and a country profile map to power local defaults
