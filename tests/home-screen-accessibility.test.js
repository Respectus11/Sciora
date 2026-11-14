const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const homeScreenPath = path.resolve(__dirname, '../src/app/(tabs)/index.tsx');
const homeSource = fs.readFileSync(homeScreenPath, 'utf8');

test('HomeScreen declares accessible unit cards with labels and navigation hints', () => {
  assert.match(homeSource, /accessibilityRole="button"/);
  assert.match(homeSource, /accessibilityLabel=\{`Unit 7: Physical Phenomena in the Surrounding, \$\{contentService\.getLessonsByUnit\('unit-07'\)\.length\} Labs`\}/);
  assert.match(homeSource, /accessibilityLabel=\{`Unit 2: Composition of Matter, \$\{contentService\.getLessonsByUnit\('unit-02'\)\.length\} Labs`\}/);
  assert.match(homeSource, /accessibilityLabel=\{`Unit 6: The Solar System, \$\{contentService\.getLessonsByUnit\('unit-06'\)\.length\} Labs`\}/);
  assert.match(homeSource, /accessibilityLabel="Unit 1: Basics of Scientific Investigation, 1 Lab"/);
  assert.match(homeSource, /haptics\.lightTick\(\)/);
});

test('HomeScreen declares accessible View All and Inquiry actions with 48pt touch targets', () => {
  assert.match(homeSource, /accessibilityLabel="View all curriculum units"/);
  assert.match(homeSource, /seeAllPressable:[\s\S]*?minHeight:\s*spacing\.minTouchTarget/);
  assert.match(homeSource, /accessibilityLabel="Explore in Refraction Lab"/);
  assert.match(homeSource, /inquiryAction:[\s\S]*?minHeight:\s*spacing\.minTouchTarget/);
});
