'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const circuitSource = fs.readFileSync(
  path.join(root, 'src', 'simulations', 'physics', 'CircuitBuilderSimulation.tsx'),
  'utf8'
);

test('circuit builder chips expose accessible roles, labels, and touch targets', () => {
  assert.match(circuitSource, /accessibilityRole=['"]button['"]/);
  assert.match(circuitSource, /accessibilityLabel=\{`Configure \$\{mode\} circuit`\}/);
  assert.match(circuitSource, /accessibilityState=\{\{\s*selected:\s*circuitMode === mode\s*\}\}/);
  assert.match(circuitSource, /accessibilityLabel=\{`Set battery voltage to \$\{v\.toFixed\(1\)\} Volts`\}/);
  assert.match(circuitSource, /minTouchTarget/);
});

test('knife switch exposes toggle actions and tactile feedback', () => {
  assert.match(circuitSource, /accessibilityLabel=\{isSwitchClosed \? 'Open knife switch' : 'Close knife switch'\}/);
  assert.match(circuitSource, /accessibilityHint=\{isSwitchClosed \? 'Breaks current flow through circuit' : 'Completes circuit allowing current flow'\}/);
  assert.match(circuitSource, /haptics\.heavySnap\(\)/);
  assert.match(circuitSource, /haptics\.selection\(\)/);
});

test('circuit builder provides reliable reset callback restoring defaults', () => {
  assert.match(circuitSource, /setVoltage\(3\.0\)/);
  assert.match(circuitSource, /setIsSwitchClosed\(true\)/);
  assert.match(circuitSource, /setCircuitMode\(['"]single['"]\)/);
});
