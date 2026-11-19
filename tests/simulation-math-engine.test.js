'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

const mathIndexCode = read('src/simulations/math/index.ts');

test('math index re-exports optics, circuit, density, astronomy, and chemistry calculation engines', () => {
  assert.match(mathIndexCode, /export \* from '\.\.\/physics\/opticsMath'/);
  assert.match(mathIndexCode, /export \* from '\.\.\/physics\/circuitMath'/);
  assert.match(mathIndexCode, /export \* from '\.\.\/investigation\/densityMath'/);
  assert.match(mathIndexCode, /export \* from '\.\.\/astronomy\/astronomyMath'/);
  assert.match(mathIndexCode, /export \* from '\.\.\/chemistry\/atomMath'/);
});

test('simulation math engines cover all core scientific disciplines', () => {
  const mathFiles = [
    'src/simulations/physics/opticsMath.ts',
    'src/simulations/physics/circuitMath.ts',
    'src/simulations/investigation/densityMath.ts',
    'src/simulations/astronomy/astronomyMath.ts',
    'src/simulations/chemistry/atomMath.ts',
  ];

  for (const file of mathFiles) {
    assert.ok(fs.existsSync(path.join(root, file)), `Math module ${file} must exist`);
    const content = fs.readFileSync(path.join(root, file), 'utf8');
    assert.ok(content.includes('export function'), `${file} must export pure calculation functions`);
  }
});
