'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const workflowPath = path.join(root, '.github', 'workflows', 'e2e-android.yml');
const workflow = fs.readFileSync(workflowPath, 'utf8');

test('Android E2E workflow preflights and builds a bundled release APK', () => {
  assert.match(workflow, /expo export --platform android/);
  assert.match(workflow, /expo prebuild --platform android --no-install/);
  assert.match(workflow, /-PreactNativeArchitectures=x86_64 assembleRelease/);
  assert.match(workflow, /app-release\.apk/);
  assert.doesNotMatch(workflow, /assembleDebug/);
});

test('runner disk cleanup happens before emulator provisioning', () => {
  const checkoutCleanup = workflow.indexOf('name: Reclaim runner disk space');
  const emulatorStep = workflow.indexOf('name: Run Android end-to-end flows');
  const postBuildCleanup = workflow.indexOf('name: Reclaim disk space before Android emulator');

  assert.ok(checkoutCleanup >= 0 && checkoutCleanup < emulatorStep,
    'Preinstalled toolchains should be removed before emulator provisioning');
  assert.ok(postBuildCleanup > workflow.indexOf('assembleRelease') && postBuildCleanup < emulatorStep,
    'Build intermediates should be removed after APK creation but before emulator provisioning');
  assert.match(workflow, /APK="android\/app\/build\/outputs\/apk\/release\/app-release\.apk"/);
  assert.match(workflow, /rm -rf node_modules android\/app\/build\/intermediates/);
});

test('Android emulator workflow has bounded startup and test execution', () => {
  assert.match(workflow, /api-level: 30/);
  assert.match(workflow, /emulator-boot-timeout: 900/);
  assert.match(workflow, /MAESTRO_DRIVER_STARTUP_TIMEOUT=180000/);
  assert.match(workflow, /12m maestro test \.maestro\/flows/);
  assert.match(workflow, /timeout --signal=TERM/);
});

test('failed Android E2E runs retain diagnostic artifacts', () => {
  assert.match(workflow, /if: failure\(\)/);
  assert.match(workflow, /actions\/upload-artifact@v5/);
  assert.match(workflow, /sciora-logcat\.txt/);
  assert.match(workflow, /retention-days: 7/);
});

test('release APK package metadata is validated before emulator provisioning', () => {
  const metadataCheck = workflow.indexOf('name: Verify release APK metadata');
  const emulatorStep = workflow.indexOf('name: Run Android end-to-end flows');

  assert.ok(metadataCheck >= 0 && metadataCheck < emulatorStep,
    'Release APK metadata must be checked before the emulator is started');
  assert.match(workflow, /aapt.*dump badging/);
  assert.match(workflow, /EXPECTED_PACKAGE/);
  assert.match(workflow, /ACTUAL_PACKAGE/);
  assert.match(workflow, /test "\$ACTUAL_PACKAGE" = "\$EXPECTED_PACKAGE"/);
});

test('emulator runner does not invoke the unstable animation settings command', () => {
  assert.doesNotMatch(
    workflow,
    /disable-animations:\\s*true/,
    'Keep emulator animation settings at their defaults because the runner adb settings command can break the emulator connection'
  );
});
