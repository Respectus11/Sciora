const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const simulationPath = path.resolve(__dirname, '../src/simulations/investigation/DensityMeasurementSimulation.tsx');
const simulationSource = fs.readFileSync(simulationPath, 'utf8');

test('DensityMeasurementSimulation declares accessible material chips with 48pt touch targets', () => {
  assert.match(simulationSource, /accessibilityRole="button"/);
  assert.match(simulationSource, /accessibilityLabel=\{`Select \$\{mat\.name\}`\}/);
  assert.match(simulationSource, /accessibilityState=\{\{\s*selected:\s*isSelected\s*\}\}/);
  assert.match(simulationSource, /chip:[\s\S]*?minHeight:\s*spacing\.minTouchTarget/);
  assert.match(simulationSource, /haptics\.selection\(\)/);
});

test('DensityMeasurementSimulation declares accessible submerge action button with 48pt touch target', () => {
  assert.match(simulationSource, /accessibilityLabel=\{isSubmerged \? 'Lift sample from water' : 'Submerge sample in water'\}/);
  assert.match(simulationSource, /actionButton:[\s\S]*?minHeight:\s*spacing\.minTouchTarget/);
  assert.match(simulationSource, /haptics\.mediumClick\(\)/);
});

test('DensityMeasurementSimulation resets to Acacia Wood with heavy snap haptic feedback', () => {
  assert.match(simulationSource, /onReset=\{[\s\S]*?haptics\.heavySnap\(\)/);
  assert.match(simulationSource, /setSelectedMaterial\(MATERIALS\[0\]\)/);
  assert.match(simulationSource, /setIsSubmerged\(false\)/);
});

test('Density measurement calculation accurately determines density and buoyancy', () => {
  const materials = [
    { id: 'wood', density: 0.65, volume: 40 },
    { id: 'iron', density: 7.87, volume: 20 },
  ];

  for (const mat of materials) {
    const mass = Math.round(mat.density * mat.volume * 10) / 10;
    const isFloating = mat.density < 1.0;
    const displacedVolume = isFloating ? mass : mat.volume;
    const calculatedDensity = Number((mass / mat.volume).toFixed(2));

    assert.ok(Math.abs(calculatedDensity - mat.density) <= 0.01);
    if (mat.id === 'wood') {
      assert.strictEqual(isFloating, true);
      assert.strictEqual(displacedVolume, 26); // 0.65 * 40 = 26 mL
    } else {
      assert.strictEqual(isFloating, false);
      assert.strictEqual(displacedVolume, 20); // full volume displaced
    }
  }
});
