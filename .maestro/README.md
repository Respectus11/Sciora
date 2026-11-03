# Android end-to-end tests

Sciora uses Maestro to exercise the built Android application on an emulator. The flows live in `.maestro/flows`; GitHub Actions builds a release APK and runs every flow against it.

## Requirements

- Node.js 20 and npm
- Java 17
- Android SDK with platform-tools, API 30 emulator image, API 36 compile platform, and build-tools 36
- An Android emulator with an `x86_64` image
- Maestro CLI

## Run locally

From the repository root:

```bash
npm ci

# Check that Expo can bundle the Android application.
npx expo export --platform android --output-dir .expo-e2e-export
rm -rf .expo-e2e-export

# Generate the native Android project and build the same release variant as CI.
npx expo prebuild --platform android --no-install
cd android
./gradlew --no-daemon -PreactNativeArchitectures=x86_64 assembleRelease
cd ..

# Start an API 30 x86_64 Android emulator, then install and test the APK.
adb wait-for-device
adb install android/app/build/outputs/apk/release/app-release.apk
maestro test .maestro/flows
```

The application ID and Expo scheme used by the Maestro flows are checked against `app.json` by the Node regression tests. The Android workflow also checks that the release APK exists, is a valid ZIP/APK, and contains the configured package ID before starting the emulator.

## Included flows

| Flow | What it checks |
|---|---|
| `density-simulation-reset.yaml` | Material selection, submersion, mass display, and reset to the default sample |
| `lesson-resume-and-quiz-persistence.yaml` | Saved lesson step and quiz answer restoration across app restarts, then final lesson completion |
| `simulation-smoke.yaml` | Deep-link navigation to all nine registered simulations and visibility of each lab title |

## Troubleshooting

- **Emulator cannot connect:** confirm the emulator has finished booting with `adb shell getprop sys.boot_completed`; the expected output is `1`.
- **APK install fails:** check that the installed emulator architecture is `x86_64` and that the package ID matches `app.json`.
- **A Maestro selector fails:** compare its text or accessibility label with the rendered component. Prefer stable accessibility labels for controls.
- **Runner disk space is exhausted:** preserve the release APK, remove build intermediates and unused preinstalled toolchains before emulator provisioning. The CI workflow performs this cleanup and reports free disk space.

The CI workflow uploads Maestro and Android logcat diagnostics when a run fails. Do not interpret a successful bundle or APK build by itself as a passing end-to-end test; all three Maestro flows must finish successfully.
