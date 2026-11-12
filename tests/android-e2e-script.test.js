'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const script = fs.readFileSync(path.join(root, 'scripts', 'android-e2e.sh'), 'utf8');

test('Android E2E script uses strict Bash mode and the configured emulator serial', () => {
  assert.match(script, /^#!\/usr\/bin\/env bash/m);
  assert.match(script, /^set -Eeuo pipefail$/m);
  assert.match(script, /ANDROID_SERIAL:-emulator-\$\{EMULATOR_PORT:-5554\}/);
  assert.match(script, /adb -s "\$EMULATOR_SERIAL"/);
});

test('ADB transport readiness is bounded and retries an offline emulator', () => {
  assert.match(script, /timeout --signal=TERM --kill-after=5s 120s/);
  assert.match(script, /for attempt in \{1\.\.60\}/);
  assert.match(script, /get-state/);
  assert.match(script, /ADB_STATE.*device/);
});

test('Android boot and input service must be ready before installing the APK', () => {
  const bootCheck = script.indexOf('getprop sys.boot_completed');
  const inputCheck = script.indexOf('service check input');
  const install = script.indexOf('adb_cmd install -r');
  assert.ok(bootCheck >= 0 && inputCheck > bootCheck && install > inputCheck);
  assert.match(script, /for attempt in \{1\.\.45\}/);
  assert.match(script, /for attempt in \{1\.\.30\}/);
  assert.match(script, /\*: found\*/);
});

test('APK and Maestro commands are bounded and accept explicit paths', () => {
  assert.match(script, /ANDROID_E2E_APK_PATH/);
  assert.match(script, /MAESTRO_FLOWS_PATH/);
  assert.match(script, /timeout --signal=TERM --kill-after=30s 90s/);
  assert.match(script, /timeout --signal=TERM --kill-after=30s 12m/);
  assert.match(script, /maestro test "\$MAESTRO_FLOWS_PATH"/);
});

test('failure diagnostics capture emulator state and a bounded logcat tail', () => {
  assert.match(script, /DIAGNOSTICS_DIR=.*RUNNER_TEMP/);
  assert.match(script, /trap capture_diagnostics EXIT/);
  assert.match(script, /adb devices -l/);
  assert.match(script, /dumpsys activity activities/);
  assert.match(script, /logcat -d -t 3000 -v threadtime/);
  assert.match(script, /device-state\.txt/);
  assert.match(script, /logcat\.txt/);
});
