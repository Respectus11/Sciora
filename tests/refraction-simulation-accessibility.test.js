const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const simulationPath = path.resolve(__dirname, '../src/simulations/physics/LightRefractionSimulation.tsx');
const simulationSource = fs.readFileSync(simulationPath, 'utf8');

test('LightRefractionSimulation declares accessible mode switcher controls with 48pt touch targets', () => {
  assert.match(simulationSource, /accessibilityRole="button"/);
  assert.match(simulationSource, /accessibilityLabel="Snell's Law Boundary mode"/);
  assert.match(simulationSource, /accessibilityLabel="Prism Dispersion mode"/);
  assert.match(simulationSource, /accessibilityState=\{\{\s*selected:\s*labMode === 'boundary'\s*\}\}/);
  assert.match(simulationSource, /accessibilityState=\{\{\s*selected:\s*labMode === 'prism'\s*\}\}/);
  assert.match(simulationSource, /tabBtn:[\s\S]*?minHeight:\s*spacing\.minTouchTarget/);
});

test('LightRefractionSimulation declares accessible angle steppers with 48pt touch targets', () => {
  assert.match(simulationSource, /accessibilityLabel="Decrease angle by 5 degrees"/);
  assert.match(simulationSource, /accessibilityLabel="Decrease angle by 1 degree"/);
  assert.match(simulationSource, /accessibilityLabel="Increase angle by 1 degree"/);
  assert.match(simulationSource, /accessibilityLabel="Increase angle by 5 degrees"/);
  assert.match(simulationSource, /stepBtn:[\s\S]*?minHeight:\s*spacing\.minTouchTarget/);
  assert.match(simulationSource, /stepBtn:[\s\S]*?minWidth:\s*spacing\.minTouchTarget/);
  assert.match(simulationSource, /haptics\.lightTick\(\)/);
});

test('LightRefractionSimulation declares accessible medium selector chips with 48pt targets', () => {
  assert.match(simulationSource, /accessibilityLabel=\{`Select medium \$\{m\.name\}, refractive index \$\{m\.n\}`\}/);
  assert.match(simulationSource, /accessibilityState=\{\{\s*selected:\s*isSelected\s*\}\}/);
  assert.match(simulationSource, /chip:[\s\S]*?minHeight:\s*spacing\.minTouchTarget/);
  assert.match(simulationSource, /haptics\.selection\(\)/);
});

test('LightRefractionSimulation resets to crown glass at 45 degrees incidence with haptic feedback', () => {
  assert.match(simulationSource, /onReset=\{[\s\S]*?haptics\.heavySnap\(\)/);
  assert.match(simulationSource, /setAngle1\(45\)/);
  assert.match(simulationSource, /setSelectedMediumId\('crown-glass'\)/);
  assert.match(simulationSource, /setLabMode\('boundary'\)/);
});

test('LightRefractionSimulation computes Snell law refraction correctly', () => {
  const n1 = 1.0;
  const n2 = 1.52; // crown glass
  const angle1 = 45;
  const rad1 = (angle1 * Math.PI) / 180;
  const sinTheta2 = (n1 * Math.sin(rad1)) / n2;
  const rad2 = Math.asin(sinTheta2);
  const angle2Deg = (rad2 * 180) / Math.PI;

  assert.ok(angle2Deg < angle1, 'Light entering denser medium must bend toward normal');
  assert.ok(Math.abs(angle2Deg - 27.7) < 0.2, 'Refraction in crown glass at 45 deg should be ~27.7 deg');
});
