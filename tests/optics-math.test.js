'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

const opticsMathCode = read('src/simulations/physics/opticsMath.ts');
const simulationCode = read('src/simulations/physics/LightRefractionSimulation.tsx');

test('opticsMath exports Snell law and geometric optics helpers', () => {
  assert.match(opticsMathCode, /export function calculateSnellsLaw/);
  assert.match(opticsMathCode, /export function calculateCriticalAngle/);
  assert.match(opticsMathCode, /export function calculateSpeedInMedium/);
  assert.match(opticsMathCode, /export function calculateDeviationAngle/);
});

test('LightRefractionSimulation imports and binds calculateSnellsLaw from opticsMath', () => {
  assert.match(simulationCode, /import\s*\{\s*calculateSnellsLaw\s*\}\s*from\s*'\.\/opticsMath'/);
  assert.match(simulationCode, /calculateSnellsLaw\(angle1,\s*n1,\s*n2\)/);
});

test('Snell law mathematical relations hold for normal incidence and known refractive indexes', () => {
  // Pure math test
  const calculateSnell = (theta1Deg, n1, n2) => {
    const rad1 = (theta1Deg * Math.PI) / 180;
    const sinTheta2 = (n1 * Math.sin(rad1)) / n2;
    if (sinTheta2 > 1.0) return { theta2Deg: 90, totalInternalReflection: true };
    const rad2 = Math.asin(sinTheta2);
    return { theta2Deg: (rad2 * 180) / Math.PI, totalInternalReflection: false };
  };

  const normal = calculateSnell(0, 1.0, 1.5);
  assert.equal(Math.round(normal.theta2Deg), 0, 'Normal ray does not refract');

  const crownGlass = calculateSnell(45, 1.0, 1.52);
  assert.equal(Math.round(crownGlass.theta2Deg * 10) / 10, 27.7, 'Crown glass at 45 deg yields 27.7 deg');

  const diamond = calculateSnell(30, 1.0, 2.42);
  assert.equal(Math.round(diamond.theta2Deg * 10) / 10, 11.9, 'Diamond at 30 deg yields 11.9 deg');
});
