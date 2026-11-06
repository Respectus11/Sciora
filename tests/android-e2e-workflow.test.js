'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const workflow = fs.readFileSync(path.join(root, '.github', 'workflows', 'e2e-android.yml'), 'utf8');

test('Android E2E workflow preflights and builds a bundled release APK', () => {
  assert.match(workflow, /expo export --platform android/);
  assert.match(workflow, /expo prebuild --platform android --no-install/);
  assert.match(workflow, /-PreactNativeArchitectures=x86_64 assembleRelease/);
  assert.match(workflow, /app-release\.apk/);
  assert.doesNotMatch(workflow, /assembleDebug/);
});

test('Android emulator startup is bounded and animation mutation is explicitly disabled', () => {
  assert.match(workflow, /api-level: 30/);
  assert.match(workflow, /emulator-boot-timeout: 900/);
  assert.match(workflow, /^\s+disable-animations:\s+false\s*$/m);
  assert.doesNotMatch(workflow, /^\s+disable-animations:\s+true\s*$/m);
  assert.match(workflow, /MAESTRO_DRIVER_STARTUP_TIMEOUT=180000/);
  assert.match(workflow, /12m maestro test \.maestro\/flows/);
  assert.match(workflow, /timeout --signal=TERM/);
});

test('emulator script waits for boot and installs only the verified release APK', () => {
  assert.match(workflow, /adb wait-for-device/);
  assert.match(workflow, /getprop sys\.boot_completed/);
  assert.match(workflow, /test "\$BOOT_STATUS" = "1"/);
  assert.match(workflow, /timeout --signal=TERM --kill-after=30s 90s adb install/);
});

test('failed Android E2E runs retain diagnostics', () => {
  assert.match(workflow, /if: failure\(\)/);
  assert.match(workflow, /actions\/upload-artifact@v5/);
  assert.match(workflow, /sciora-logcat\.txt/);
  assert.match(workflow, /retention-days: 7/);
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
