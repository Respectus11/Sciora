'use strict';

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

test('release readiness audit completes without configuration failures', () => {
  const result = spawnSync(
    process.execPath,
    ['scripts/verify-release-readiness.js'],
    { cwd: root, encoding: 'utf8' }
  );

  assert.equal(
    result.status,
    0,
    [result.stdout, result.stderr].filter(Boolean).join('\n')
  );
  assert.match(result.stdout, /Expo application metadata and referenced assets are valid/);
  assert.match(result.stdout, /package\.json and package-lock\.json dependency declarations match/);
  assert.match(result.stdout, /EAS development, preview, and production profiles are explicitly configured/);
  assert.match(result.stdout, /No environment secrets or signing-key files are tracked by Git/);
});

test('release audit clearly identifies the current Android production artifact type', () => {
  const eas = require('../eas.json');
  const productionType = eas.build.production.android.buildType;
  assert.ok(['apk', 'app-bundle'].includes(productionType));

  const result = spawnSync(
    process.execPath,
    ['scripts/verify-release-readiness.js'],
    { cwd: root, encoding: 'utf8' }
  );
  assert.equal(result.status, 0);

  if (productionType === 'apk') {
    assert.match(result.stderr, /Use app-bundle for a Google Play Store release/);
  }
});

test('release audit highlights unresolved store versioning choices', () => {
  const eas = require('../eas.json');
  const app = require('../app.json').expo;
  const result = spawnSync(
    process.execPath,
    ['scripts/verify-release-readiness.js'],
    { cwd: root, encoding: 'utf8' }
  );

  assert.equal(result.status, 0);
  if (!eas.cli?.appVersionSource) {
    assert.match(result.stderr, /appVersionSource is not explicit/);
  }
  if (eas.build.production.autoIncrement !== true && !Number.isInteger(app.android?.versionCode)) {
    assert.match(result.stderr, /No Android versionCode or production autoIncrement is configured/);
  }
});
