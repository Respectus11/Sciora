'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

const astronomyMathCode = read('src/simulations/astronomy/astronomyMath.ts');
const simulationCode = read('src/simulations/astronomy/SolarSystemSimulation.tsx');

test('astronomyMath exports Kepler ratio, period estimator, and habitable zone calculations', () => {
  assert.match(astronomyMathCode, /export function calculateKeplerRatio/);
  assert.match(astronomyMathCode, /export function estimateOrbitalPeriodYears/);
  assert.match(astronomyMathCode, /export function estimateOrbitalVelocityKmS/);
  assert.match(astronomyMathCode, /export function isInHabitableZone/);
});

test('SolarSystemSimulation imports and binds calculateKeplerRatio', () => {
  assert.match(simulationCode, /import\s*\{\s*calculateKeplerRatio\s*\}\s*from\s*'\.\/astronomyMath'/);
  assert.match(simulationCode, /calculateKeplerRatio\(selectedPlanet\.periodYears,\s*selectedPlanet\.distAU\)/);
});

test('Kepler orbital mechanics holds across terrestrial and gas giant regimes', () => {
  const calcKepler = (tYears, aAU) => (tYears * tYears) / Math.pow(aAU, 3);

  // Earth (1 year, 1 AU)
  const earth = calcKepler(1.0, 1.0);
  assert.equal(Math.round(earth), 1);

  // Jupiter (~11.86 yrs, 5.20 AU)
  const jupiter = calcKepler(11.86, 5.20);
  assert.equal(Math.round(jupiter * 100) / 100, 1.00);

  // Mars (~1.88 yrs, 1.52 AU)
  const mars = calcKepler(1.88, 1.52);
  assert.equal(Math.round(mars * 10) / 10, 1.0);
});
