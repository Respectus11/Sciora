'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const reflectionSource = fs.readFileSync(
  path.join(root, 'src', 'simulations', 'physics', 'LightReflectionSimulation.tsx'),
  'utf8'
);

test('reflection laser, steppers, and presets expose accessible roles and touch targets', () => {
  assert.match(reflectionSource, /accessibilityLabel=\{`Select \$\{laser\.name\} laser \(\$\{laser\.wavelength\}\)`\}/);
  assert.match(reflectionSource, /accessibilityLabel=['"]Decrease angle by 5 degrees['"]/);
  assert.match(reflectionSource, /accessibilityLabel=['"]Increase angle by 5 degrees['"]/);
  assert.match(reflectionSource, /accessibilityLabel=\{`Set incident angle to \$\{preset\} degrees`\}/);
  assert.match(reflectionSource, /minTouchTarget/);
  assert.match(reflectionSource, /haptics\.selection\(\)/);
  assert.match(reflectionSource, /haptics\.lightTick\(\)/);
});

test('surface mode buttons expose specular vs diffuse states and haptics', () => {
  assert.match(reflectionSource, /accessibilityRole=['"]button['"]/);
  assert.match(reflectionSource, /accessibilityLabel=['"]Select specular reflection with plane mirror['"]/);
  assert.match(reflectionSource, /accessibilityLabel=['"]Select diffuse scattering reflection with rough surface['"]/);
  assert.match(reflectionSource, /haptics\.mediumClick\(\)/);
});

test('light reflection simulation provides reliable reset restoring default mirror view', () => {
  assert.match(reflectionSource, /setAngle\(45\)/);
  assert.match(reflectionSource, /setSurfaceMode\(['"]mirror['"]\)/);
  assert.match(reflectionSource, /setSelectedLaserId\(['"]cyan['"]\)/);
});
