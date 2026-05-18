# TravelMate AI

TravelMate AI is a React Native Expo travel assistant that helps travelers adapt quickly by detecting their current location, converting currency, translating text, and surfacing ready-to-use travel phrases.

## Features

- Onboarding flow for home currency and preferred language
- Location-aware dashboard powered by `expo-location`
- Currency converter with manual currency selection, swap, cached rates, and last-updated info
- Translator with manual language selection, copy-to-clipboard, and text-to-speech
- Travel phrases screen with common phrases translated into the local language
- Settings screen for updating saved preferences and clearing cached app data
- Bottom tab navigation for the main app shell
- Mock-ready service layer for exchange rates and translation when API keys are missing

## Tech stack

- Expo
- React Native
- TypeScript
- Expo Router
- Zustand
- AsyncStorage
- Expo Location
- Expo Speech
- Expo Clipboard

## App flow

1. User completes onboarding
2. App saves home currency and preferred language locally
3. App redirects into the tabbed main shell
4. Dashboard detects the current country and maps local currency and language
5. User can switch between `Home`, `Convert`, `Translate`, `Phrases`, and `Settings`

## Project structure

```text
app/
  (tabs)/
    _layout.tsx
    converter.tsx
    dashboard.tsx
    phrases.tsx
    settings.tsx
    translator.tsx
  _layout.tsx
  converter.tsx
  index.tsx
  onboarding.tsx
  phrases.tsx
  settings.tsx
  translator.tsx
components/
  DashboardCard.tsx
  PickerField.tsx
  PrimaryButton.tsx
  QuickActionTile.tsx
  ScreenContainer.tsx
  SelectionCard.tsx
constants/
  countryProfiles.ts
  options.ts
  theme.ts
  travelPhrases.ts
hooks/
  useExchangeRate.ts
  useLocationProfile.ts
  useOnboardingForm.ts
  useTranslation.ts
screens/
  converter-screen.tsx
  dashboard-screen.tsx
  phrases-screen.tsx
  settings-screen.tsx
  translator-screen.tsx
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

2. Add environment variables in a `.env` file at the project root if you want live APIs:

```bash
EXPO_PUBLIC_EXCHANGE_API_URL=
EXPO_PUBLIC_EXCHANGE_API_KEY=
EXPO_PUBLIC_TRANSLATION_API_URL=
EXPO_PUBLIC_TRANSLATION_API_KEY=
```

3. Start the app:

```bash
npx expo start
```

## Running targets

### Web

```bash
npx expo start --web
```

If the browser looks stale, clear Metro cache:

```bash
npx expo start --web -c
```

### iOS simulator

Make sure Xcode is selected as the active developer directory:

```bash
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -license accept
```

Then start Expo and press `i`.

### Android emulator

Install Android Studio and SDK tools, then set:

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools:$PATH
```

Then start Expo and press `a`.

## API keys

- `EXPO_PUBLIC_EXCHANGE_API_URL` and `EXPO_PUBLIC_EXCHANGE_API_KEY` are used by [services/exchangeService.ts](/Users/chrisrnojo/Documents/__dev__/travel-mate/services/exchangeService.ts)
- `EXPO_PUBLIC_TRANSLATION_API_URL` and `EXPO_PUBLIC_TRANSLATION_API_KEY` are used by [services/translationService.ts](/Users/chrisrnojo/Documents/__dev__/travel-mate/services/translationService.ts)
- If these are missing, the app falls back to mock responses so development can continue without secrets

## Notes

- Preferences are persisted locally through [store/preferencesStore.ts](/Users/chrisrnojo/Documents/__dev__/travel-mate/store/preferencesStore.ts)
- Cached exchange and translation data can be cleared from the Settings screen
- The main app shell uses bottom tabs, while onboarding stays outside the tab navigator
- The app currently uses lightweight text tab glyphs; real icons would be a good next polish step
