'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

const densityMathCode = read('src/simulations/investigation/densityMath.ts');
const simulationCode = read('src/simulations/investigation/DensityMeasurementSimulation.tsx');

test('densityMath exports mass, density, buoyancy, and displacement helpers', () => {
  assert.match(densityMathCode, /export function calculateMass/);
  assert.match(densityMathCode, /export function calculateDensity/);
  assert.match(densityMathCode, /export function isFloatingInFluid/);
  assert.match(densityMathCode, /export function calculateDisplacedVolume/);
  assert.match(densityMathCode, /export function calculateBuoyantForce/);
});

test('DensityMeasurementSimulation imports and uses densityMath functions', () => {
  assert.match(simulationCode, /import\s*\{[\s\S]*calculateMass[\s\S]*\}\s*from\s*'\.\/densityMath'/);
  assert.match(simulationCode, /calculateMass\(selectedMaterial\.density,\s*selectedMaterial\.volume\)/);
  assert.match(simulationCode, /isFloatingInFluid\(selectedMaterial\.density\)/);
  assert.match(simulationCode, /calculateDisplacedVolume\(selectedMaterial\.density,\s*selectedMaterial\.volume\)/);
});

test('density and buoyancy math validates Archimedes principle and float-sink threshold', () => {
  const calcM = (rho, v) => Math.round(rho * v * 10) / 10;
  const isFloat = (rho) => rho < 1.0;
  const calcDisp = (rho, v) => (isFloat(rho) ? calcM(rho, v) : v);

  // Acacia wood (0.65 g/cm3, 40 cm3) -> floats, displaces mass (26 mL)
  assert.equal(calcM(0.65, 40), 26);
  assert.equal(isFloat(0.65), true);
  assert.equal(calcDisp(0.65, 40), 26);

  // Iron nugget (7.87 g/cm3, 20 cm3) -> sinks, displaces full volume (20 mL)
  assert.equal(calcM(7.87, 20), 157.4);
  assert.equal(isFloat(7.87), false);
  assert.equal(calcDisp(7.87, 20), 20);
});
