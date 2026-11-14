'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const magSource = fs.readFileSync(
  path.join(root, 'src', 'simulations', 'physics', 'MagnetismSimulation.tsx'),
  'utf8'
);

test('magnetism compass and materials expose accessible roles, hints, and touch targets', () => {
  assert.match(magSource, /accessibilityLabel=\{`Place compass at \$\{pos\.label\}`\}/);
  assert.match(magSource, /accessibilityHint=\{pos\.desc\}/);
  assert.match(magSource, /accessibilityLabel=\{`Test material \$\{mat\.name\} \(\$\{mat\.category\}\)`\}/);
  assert.match(magSource, /accessibilityHint=\{mat\.explanation\}/);
  assert.match(magSource, /minTouchTarget/);
  assert.match(magSource, /haptics\.selection\(\)/);
});

test('magnet cutting toggle exposes clear dipole explanation and snap feedback', () => {
  assert.match(magSource, /accessibilityRole=['"]button['"]/);
  assert.match(magSource, /accessibilityLabel=\{isBrokenInHalf \? 'Rejoin bar magnet into single dipole' : 'Cut bar magnet in half'\}/);
  assert.match(magSource, /accessibilityHint=['"]Demonstrates that dividing a magnet produces two separate dipoles with new N and S poles, never isolated monopoles['"]/);
  assert.match(magSource, /haptics\.heavySnap\(\)/);
});

test('magnetism simulation provides reliable reset restoring default iron sample', () => {
  assert.match(magSource, /setCompassAngleIndex\(1\)/);
  assert.match(magSource, /setIsBrokenInHalf\(false\)/);
  assert.match(magSource, /setSelectedMaterialId\(['"]iron['"]\)/);
  assert.match(magSource, /setMaterialDistance\(['"]near['"]\)/);
});
