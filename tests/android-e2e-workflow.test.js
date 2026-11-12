'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const workflow = fs.readFileSync(path.join(root, '.github', 'workflows', 'e2e-android.yml'), 'utf8');
const emulatorScript = fs.readFileSync(path.join(root, 'scripts', 'android-e2e.sh'), 'utf8');

test('Android E2E workflow preflights and builds a bundled release APK', () => {
  assert.match(workflow, /expo export --platform android/);
  assert.match(workflow, /expo prebuild --platform android --no-install/);
  assert.match(workflow, /-PreactNativeArchitectures=x86_64 assembleRelease/);
  assert.match(workflow, /app-release\.apk/);
  assert.doesNotMatch(workflow, /assembleDebug/);
});

test('Android emulator runner is pinned to the input-service readiness fix', () => {
  assert.match(
    workflow,
    /uses:\s+ReactiveCircus\/android-emulator-runner@ab495a9b42f2af30f5222bd978136f9b0a85b68a/
  );
  assert.match(workflow, /android-emulator-runner issue #489/);
  assert.match(workflow, /pull\/495/);
  assert.match(workflow, /api-level: 30/);
  assert.match(workflow, /emulator-boot-timeout: 900/);
  assert.match(workflow, /^\s+disable-animations:\s+false\s*$/m);
  assert.doesNotMatch(workflow, /^\s+disable-animations:\s+true\s*$/m);
});

test('emulator invokes the Bash script once so shell state is preserved', () => {
  assert.match(workflow, /^\s+script: bash scripts\/android-e2e\.sh\s*$/m);
  assert.doesNotMatch(workflow, /^\s+script: \|/m);
  assert.match(emulatorScript, /^#!\/usr\/bin\/env bash/m);
  assert.match(emulatorScript, /^set -Eeuo pipefail$/m);
  assert.match(emulatorScript, /MAESTRO_DRIVER_STARTUP_TIMEOUT/);
  assert.match(emulatorScript, /service check input/);
  assert.match(emulatorScript, /trap capture_diagnostics EXIT/);
});

test('emulator script waits for boot with retries before installing the verified APK', () => {
  assert.match(emulatorScript, /adb wait-for-device/);
  assert.match(emulatorScript, /for attempt in \{1\.\.45\}/);
  assert.match(emulatorScript, /getprop sys\.boot_completed/);
  assert.match(emulatorScript, /\[\[ "\$BOOT_STATUS" == "1" \]\]/);
  assert.match(emulatorScript, /timeout --signal=TERM --kill-after=30s 90s/);
  assert.match(emulatorScript, /adb install android\/app\/build\/outputs\/apk\/release\/app-release\.apk/);
  assert.match(emulatorScript, /12m/);
  assert.match(emulatorScript, /maestro test \.maestro\/flows/);
});

test('failed Android E2E runs retain diagnostics using the supported artifact action', () => {
  assert.match(workflow, /if: failure\(\)/);
  assert.match(workflow, /actions\/upload-artifact@v6/);
  assert.match(workflow, /runner\.temp.*sciora-android-e2e/);
  assert.match(workflow, /sciora-logcat\.txt/);
  assert.match(workflow, /retention-days: 7/);
  assert.match(emulatorScript, /trap capture_diagnostics EXIT/);
});

test('release APK package metadata is validated before emulator provisioning', () => {
  const metadataCheck = workflow.indexOf('name: Verify release APK metadata');
  const emulatorStep = workflow.indexOf('name: Run Android end-to-end flows');
  assert.ok(metadataCheck >= 0 && metadataCheck < emulatorStep);
  assert.match(workflow, /aapt.*dump badging/);
  assert.match(workflow, /EXPECTED_PACKAGE/);
  assert.match(workflow, /ACTUAL_PACKAGE/);
  assert.match(workflow, /test "\$ACTUAL_PACKAGE" = "\$EXPECTED_PACKAGE"/);
});
