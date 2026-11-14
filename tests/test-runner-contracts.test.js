'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const runAllAudits = fs.readFileSync(path.join(root, 'scripts', 'run-all-audits.js'), 'utf8');

test('unit test runner command in package.json resolves file patterns cross-platform', () => {
  assert.ok(pkg.scripts?.['test:unit'], 'package.json must define a test:unit script');
  assert.match(pkg.scripts['test:unit'], /node --test tests\/\*\.test\.js/);
  assert.doesNotMatch(
    pkg.scripts['test:unit'],
    /node --test tests\s*$/,
    'bare directory invocation breaks module resolution on Windows Node'
  );
});

test('master quality audit runner uses explicit regression test target', () => {
  assert.match(
    runAllAudits,
    /cmd:\s*['"]node --test tests\/curriculum-regression\.test\.js['"]/,
    'master audit runner must target explicit curriculum regression test file'
  );
  assert.doesNotMatch(
    runAllAudits,
    /cmd:\s*['"]node --test tests['"]/,
    'bare directory invocation breaks on Windows environments'
  );
});
