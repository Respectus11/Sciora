# Sciora release checklist

This is the release gate for an Android distribution build. A green TypeScript/lint job or a successful APK build alone is not a release approval.

## Automated gates

- [ ] `npm ci` completes from the committed lockfile.
- [ ] `npm test` passes, including curriculum, simulation, accessibility, and release-readiness audits.
- [ ] `npx expo export --platform android` produces the JavaScript bundle without Metro/Expo Router errors.
- [ ] An EAS preview build installs and launches on a clean Android device.
- [ ] The Android package ID, app scheme, version, launcher icon, adaptive icons, and splash screen are verified in the installed build.
- [ ] All Maestro flows pass on the actual release APK: lesson resume/quiz persistence, density reset, and all nine simulation routes.
- [ ] No secret environment files or signing keys are committed. Production credentials stay in EAS credentials/secrets, not Git.

## Device and accessibility checks

- [ ] Install on a clean device and confirm first launch initializes SQLite without a network connection.
- [ ] Upgrade from the previous supported build and confirm existing progress remains readable.
- [ ] Enable airplane mode and test Home, Explore, lesson content, simulations, Progress, and Settings.
- [ ] Test Android Back navigation, app background/foreground, force-stop/restart, and low-storage behavior.
- [ ] Test TalkBack on tabs, lesson navigation, quiz answers, simulation controls, and Settings switches.
- [ ] Confirm visible focus, readable text scaling, contrast, and touch targets on a small screen.
- [ ] Verify behavior with Android's system-level reduced-motion preference and with haptics unavailable.
- [ ] Test performance on a lower-memory Android device; check startup, scrolling, simulation frame rate, and SQLite reads.

## Product, content, and privacy decisions

- [ ] Confirm the intended first-release curriculum scope. The current bundled content is nine lessons across Units 1, 2, 6, and 7; it is not yet a complete seven-unit Grade 8 curriculum.
- [ ] Have a subject-matter reviewer validate every included formula, answer key, worked example, glossary entry, and textbook page reference against the official textbook.
- [ ] Confirm image, simulation, curriculum, and third-party licenses are compatible with the intended distribution; review `LICENSE` and `THIRD_PARTY_NOTICES.md`.
- [ ] Verify every privacy statement against the built application and its dependencies. Do not claim zero telemetry or network use without checking the actual release manifest and runtime behavior.
- [ ] Decide whether the settings switches (Reduce Motion, High-Contrast Opaque Cards, Haptic Feedback) are fully implemented and persisted. Do not describe a preference as supported if it only changes local screen state.
- [ ] Confirm what the Reset Progress action deletes and verify the confirmation and result messages match that behavior.

## Store/distribution configuration

- [ ] Decide whether production distribution is a directly installable APK or a Google Play release.
- [ ] For Google Play, switch the EAS production Android build type to `app-bundle`; keep APK for direct installation/testing when appropriate.
- [ ] Confirm Android version code/build-number incrementing strategy before the first public update.
- [ ] Set the final app name, publisher/developer contact, support URL, privacy policy URL, screenshots, and store description.
- [ ] Generate and retain a signed production artifact through EAS; verify the artifact's package ID and version before submission.
- [ ] Test the exact signed production artifact, not only a development or preview build.

## Current known release blockers

1. The Android Maestro workflow has not yet completed successfully. The release APK builds, but the prior emulator attempt failed after boot when the emulator action tried to disable animations via ADB. That optional action has been removed; confirm a clean rerun before accepting Phase 4.
2. Current content has nine lessons in four units, while Settings describes the official textbook scope as seven units. Decide whether the first release is explicitly a limited pilot or complete the remaining curriculum before calling it the full Grade 8 app.
3. Settings preferences currently use screen-local React state. Persist and apply them globally, or remove/label them as unsupported before public release.
4. Production EAS currently builds an APK. Select app-bundle if Google Play is the target.

Record reviewer, device model/API level, build number, test date, and links to CI artifacts when signing off.
