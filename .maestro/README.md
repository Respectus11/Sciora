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

# Start an API 30 x86_64 Android emulator and use the same bounded runner as CI.
ANDROID_SERIAL=emulator-5554 bash scripts/android-e2e.sh
```

The script selects the emulator using `ANDROID_SERIAL` (or the runner-provided `EMULATOR_PORT`), waits for ADB to report the device as online, checks both `sys.boot_completed` and the Android `input` service, then installs the APK and runs every Maestro flow. Override the APK or flow directory with `ANDROID_E2E_APK_PATH` and `MAESTRO_FLOWS_PATH`.

Run the focused workflow and shell-script contract tests with `npm run test:android-e2e`.

The application ID and Expo scheme used by the Maestro flows are checked against `app.json` by the Node regression tests. The Android workflow also checks that the release APK exists, is a valid ZIP/APK, and contains the configured package ID before starting the emulator.

## Included flows

| Flow | What it checks |
|---|---|
| `density-simulation-reset.yaml` | Material selection, submersion, mass display, and reset to the default sample |
| `lesson-resume-and-quiz-persistence.yaml` | Saved lesson step and quiz answer restoration across app restarts, then final lesson completion |
| `simulation-smoke.yaml` | Deep-link navigation to all nine registered simulations and visibility of each lab title |

## Troubleshooting

- **Emulator cannot connect:** inspect `adb devices -l`; the expected state is `device`, not `offline`. The runner script retries the selected emulator transport before checking boot properties.
- **Boot completes but UI automation cannot start:** Android can publish `sys.boot_completed=1` before registering the `input` service. The workflow pins the upstream readiness fix from [android-emulator-runner PR #495](https://github.com/ReactiveCircus/android-emulator-runner/pull/495), tracked in [issue #489](https://github.com/ReactiveCircus/android-emulator-runner/issues/489). Replace the pin with a tagged upstream release when the fix is released.
- **APK install fails:** check that the installed emulator architecture is `x86_64` and that the package ID matches `app.json`.
- **A Maestro selector fails:** compare its text or accessibility label with the rendered component. Prefer stable accessibility labels for controls.
- **Runner disk space is exhausted:** preserve the release APK, remove build intermediates and unused preinstalled toolchains before emulator provisioning. The CI workflow performs this cleanup and reports free disk space.

On failure, CI uploads the emulator state, the most recent 3,000 logcat lines, Maestro logs, and Android build logs as the `sciora-maestro-diagnostics` artifact. The verified release APK is retained separately when the APK build succeeds, even if a later Maestro flow fails. Do not interpret a successful bundle or APK build by itself as a passing end-to-end test; all three Maestro flows must finish successfully.
