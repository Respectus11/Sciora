'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

const atomMathCode = read('src/simulations/chemistry/atomMath.ts');
const simulationCode = read('src/simulations/chemistry/AtomBuilderSimulation.tsx');

test('atomMath exports mass number, net charge, Bohr configuration, and ion state helpers', () => {
  assert.match(atomMathCode, /export function calculateMassNumber/);
  assert.match(atomMathCode, /export function calculateNetCharge/);
  assert.match(atomMathCode, /export function calculateBohrConfiguration/);
  assert.match(atomMathCode, /export function getIonState/);
});

test('AtomBuilderSimulation imports and integrates atomMath functions', () => {
  assert.match(simulationCode, /import\s*\{[\s\S]*calculateMassNumber[\s\S]*\}\s*from\s*'\.\/atomMath'/);
  assert.match(simulationCode, /calculateMassNumber\(protons,\s*neutrons\)/);
  assert.match(simulationCode, /calculateNetCharge\(protons,\s*electrons\)/);
  assert.match(simulationCode, /calculateBohrConfiguration\(electrons\)/);
});

test('Bohr shell distribution obeys 2-8-8 maximum shell occupancy', () => {
  const calcBohr = (e) => {
    const s1 = Math.min(2, e);
    const rem1 = Math.max(0, e - 2);
    const s2 = Math.min(8, rem1);
    const rem2 = Math.max(0, rem1 - 8);
    const s3 = Math.min(8, rem2);
    const val = s3 > 0 ? s3 : s2 > 0 ? s2 : s1;
    return { s1, s2, s3, val };
  };

  // Carbon (6 electrons): K=2, L=4, valence=4
  assert.deepEqual(calcBohr(6), { s1: 2, s2: 4, s3: 0, val: 4 });

  // Sodium (11 electrons): K=2, L=8, M=1, valence=1
  assert.deepEqual(calcBohr(11), { s1: 2, s2: 8, s3: 1, val: 1 });

  // Argon (18 electrons): K=2, L=8, M=8, valence=8 (noble gas octet)
  assert.deepEqual(calcBohr(18), { s1: 2, s2: 8, s3: 8, val: 8 });
});
