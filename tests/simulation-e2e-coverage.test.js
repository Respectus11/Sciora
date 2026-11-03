'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const registryPath = path.join(root, 'src', 'simulations', 'registry.ts');
const smokeFlowPath = path.join(root, '.maestro', 'flows', 'simulation-smoke.yaml');

test('Maestro simulation smoke flow covers every registered simulation', () => {
  const registry = fs.readFileSync(registryPath, 'utf8');
  const smokeFlow = fs.readFileSync(smokeFlowPath, 'utf8');
  const registeredIds = [...registry.matchAll(/^\\s*'([^']+)':\\s*\\{/gm)]
    .map((match) => match[1]);

  assert.ok(registeredIds.length > 0, 'Simulation registry must contain at least one simulation');

  const missing = registeredIds.filter((id) => !smokeFlow.includes('/' + id + '"'));
  assert.deepEqual(
    missing,
    [],
    'Every registered simulation needs a deep-link smoke assertion in simulation-smoke.yaml'
  );
});

test('simulation smoke flow asserts a visible title after each deep link', () => {
  const smokeFlow = fs.readFileSync(smokeFlowPath, 'utf8');
  const routeChecks = [...smokeFlow.matchAll(/- openLink:\\s*["']sciora:\\/\\/simulations\\/([^"']+)["']\\s*\\n- assertVisible:\\s*\\n\\s*text:\\s*["']([^"']+)["']/g)];

  assert.ok(routeChecks.length > 0, 'Smoke flow should open simulation deep links and assert visible titles');
  assert.equal(
    new Set(routeChecks.map((match) => match[1])).size,
    routeChecks.length,
    'Each simulation route should be checked exactly once'
  );
  assert.ok(
    routeChecks.every((match) => match[2].trim().length > 0),
    'Every simulation route assertion needs a non-empty title'
  );
});
