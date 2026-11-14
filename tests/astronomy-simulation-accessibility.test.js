'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const astroSource = fs.readFileSync(
  path.join(root, 'src', 'simulations', 'astronomy', 'SolarSystemSimulation.tsx'),
  'utf8'
);

test('solar system planet chips and filters expose accessible button roles and states', () => {
  assert.match(astroSource, /accessibilityLabel=['"]Show all 8 planets['"]/);
  assert.match(astroSource, /accessibilityLabel=['"]Filter inner terrestrial planets['"]/);
  assert.match(astroSource, /accessibilityLabel=['"]Filter outer Jovian planets['"]/);
  assert.match(astroSource, /accessibilityLabel=\{`Select \$\{planet\.name\} \(\$\{planet\.type\}\)`\}/);
  assert.match(astroSource, /accessibilityHint=\{`Inspects \$\{planet\.distAU\} AU orbit and Kepler telemetry`\}/);
  assert.match(astroSource, /haptics\.selection\(\)/);
  assert.match(astroSource, /minTouchTarget/);
});

test('habitable zone toggle exposes button role and descriptive label', () => {
  assert.match(astroSource, /accessibilityRole=['"]button['"]/);
  assert.match(astroSource, /accessibilityLabel=\{showHabitableZone \? 'Hide Goldilocks Zone overlay' : 'Show Goldilocks Zone overlay'\}/);
  assert.match(astroSource, /accessibilityHint=['"]Toggles circumstellar habitable temperature boundary['"]/);
  assert.match(astroSource, /haptics\.mediumClick\(\)/);
});

test('solar system provides reset callback restoring default Earth view', () => {
  assert.match(astroSource, /setSelectedPlanetId\(['"]earth['"]\)/);
  assert.match(astroSource, /setFilterGroup\(['"]all['"]\)/);
  assert.match(astroSource, /setShowHabitableZone\(true\)/);
});
