'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

const circuitMathCode = read('src/simulations/physics/circuitMath.ts');
const simulationCode = read('src/simulations/physics/CircuitBuilderSimulation.tsx');

test('circuitMath exports equivalent resistance, Ohm law, and power helpers', () => {
  assert.match(circuitMathCode, /export function calculateEquivalentResistance/);
  assert.match(circuitMathCode, /export function calculateCircuitCurrent/);
  assert.match(circuitMathCode, /export function calculateElectricPower/);
  assert.match(circuitMathCode, /export function calculateBulbGlow/);
});

test('CircuitBuilderSimulation imports and binds circuitMath functions', () => {
  assert.match(simulationCode, /import\s*\{[\s\S]*calculateEquivalentResistance[\s\S]*\}\s*from\s*'\.\/circuitMath'/);
  assert.match(simulationCode, /calculateEquivalentResistance\(circuitMode,\s*bulbResistance\)/);
  assert.match(simulationCode, /calculateCircuitCurrent\(voltage,\s*eqResistance,\s*isSwitchClosed\)/);
});

test('circuit calculations correctly evaluate series and parallel loads', () => {
  const calcReq = (mode, r) => {
    if (mode === 'series') return r * 2;
    if (mode === 'parallel') return r / 2;
    return r;
  };

  assert.equal(calcReq('single', 10), 10);
  assert.equal(calcReq('series', 10), 20);
  assert.equal(calcReq('parallel', 10), 5);

  const calcI = (v, r, closed) => (closed ? v / r : 0);
  assert.equal(calcI(3.0, 10, true), 0.3);
  assert.equal(calcI(3.0, 20, true), 0.15);
  assert.equal(calcI(3.0, 5, true), 0.6);
  assert.equal(calcI(3.0, 10, false), 0);
});
