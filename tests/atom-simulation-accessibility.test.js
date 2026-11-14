'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const atomSource = fs.readFileSync(
  path.join(root, 'src', 'simulations', 'chemistry', 'AtomBuilderSimulation.tsx'),
  'utf8'
);

test('atom builder preset chips expose accessible button roles and states', () => {
  assert.match(atomSource, /accessibilityLabel=\{`Select \$\{preset\.label\} preset`\}/);
  assert.match(atomSource, /accessibilityHint=['"]Loads isotope proton, neutron, and electron counts['"]/);
  assert.match(atomSource, /haptics\.selection\(\)/);
  assert.match(atomSource, /minTouchTarget/);
});

test('particle counter buttons provide accessible labels and tactile ticks', () => {
  assert.match(atomSource, /accessibilityLabel=['"]Increase protons['"]/);
  assert.match(atomSource, /accessibilityLabel=['"]Decrease protons['"]/);
  assert.match(atomSource, /accessibilityLabel=['"]Increase neutrons['"]/);
  assert.match(atomSource, /accessibilityLabel=['"]Decrease neutrons['"]/);
  assert.match(atomSource, /accessibilityLabel=['"]Increase electrons['"]/);
  assert.match(atomSource, /accessibilityLabel=['"]Decrease electrons['"]/);
  assert.match(atomSource, /haptics\.lightTick\(\)/);
});

test('atom builder provides reset callback restoring default Carbon atom', () => {
  assert.match(atomSource, /onReset=\{\(\) => setPreset\(6, 6, 6\)\}/);
});
