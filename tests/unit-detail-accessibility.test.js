const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const unitDetailPath = path.resolve(__dirname, '../src/app/units/[unitId].tsx');
const unitSource = fs.readFileSync(unitDetailPath, 'utf8');

test('UnitDetailScreen declares accessible back button with 48pt touch targets', () => {
  assert.match(unitSource, /accessibilityRole="button"/);
  assert.match(unitSource, /accessibilityLabel="Back to previous screen"/);
  assert.match(unitSource, /accessibilityHint="Navigates back to the previous screen"/);
  assert.match(unitSource, /backBtn:[\s\S]*?minWidth:\s*spacing\.minTouchTarget/);
  assert.match(unitSource, /backBtn:[\s\S]*?minHeight:\s*spacing\.minTouchTarget/);
  assert.match(unitSource, /haptics\.lightTick\(\)/);
});

test('UnitDetailScreen declares accessible lesson cards with labels and hints', () => {
  assert.match(unitSource, /accessibilityRole="button"/);
  assert.match(unitSource, /accessibilityLabel=\{`\$\{lesson\.title\}, \$\{lesson\.lessonNumber\}, \$\{lesson\.estimatedMinutes\} minutes`\}/);
  assert.match(unitSource, /accessibilityHint="Opens this 10-step guided science lab"/);
});
