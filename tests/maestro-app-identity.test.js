'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const appConfig = JSON.parse(fs.readFileSync(path.join(root, 'app.json'), 'utf8')).expo;
const flowsDirectory = path.join(root, '.maestro', 'flows');
const flowFiles = fs.readdirSync(flowsDirectory).filter((file) => file.endsWith('.yaml'));

test('Maestro flows target the configured Android application ID', () => {
  assert.ok(flowFiles.length > 0, 'At least one Maestro flow must be configured');
  const expectedAppId = appConfig.android.package;

  for (const file of flowFiles) {
    const flow = fs.readFileSync(path.join(flowsDirectory, file), 'utf8');
    assert.match(flow, /^appId:\s*[^\r\n]+/m, file + ': appId header missing');
    const actualAppId = flow.match(/^appId:\s*([^\r\n]+)/m)?.[1];
    assert.equal(actualAppId, expectedAppId, file + ': appId differs from app.json');
  }
});

test('simulation deep-link smoke flow uses the configured Expo scheme', () => {
  const smokeFlow = fs.readFileSync(path.join(flowsDirectory, 'simulation-smoke.yaml'), 'utf8');
  const scheme = appConfig.scheme;

  assert.ok(typeof scheme === 'string' && scheme.trim(), 'Expo app scheme must be configured');
  assert.ok(
    smokeFlow.includes('openLink: "' + scheme + '://simulations/'),
    'Simulation deep links must use the app.json scheme'
  );
});
