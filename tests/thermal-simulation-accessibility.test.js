'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const thermalSource = fs.readFileSync(
  path.join(root, 'src', 'simulations', 'physics', 'ThermalConductionSimulation.tsx'),
  'utf8'
);

test('thermal conduction temperature chips and play button expose accessible roles and touch targets', () => {
  assert.match(thermalSource, /accessibilityLabel=\{`Set flame temperature to \$\{t\} degrees Celsius`\}/);
  assert.match(thermalSource, /accessibilityHint=['"]Increases heat conduction rate through experimental rods['"]/);
  assert.match(thermalSource, /accessibilityLabel=\{isHeating \? 'Pause flame heating' : 'Start flame heating'\}/);
  assert.match(thermalSource, /accessibilityHint=\{isHeating \? 'Pauses conduction timer' : 'Starts flame and rod heat transfer'\}/);
  assert.match(thermalSource, /minTouchTarget/);
  assert.match(thermalSource, /haptics\.selection\(\)/);
  assert.match(thermalSource, /haptics\.mediumClick\(\)/);
});

test('thermal conduction simulation provides reset callback restoring defaults', () => {
  assert.match(thermalSource, /setFlameTemp\(200\)/);
  assert.match(thermalSource, /setTimeElapsed\(0\)/);
  assert.match(thermalSource, /setIsHeating\(true\)/);
});
