const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const exploreScreenPath = path.resolve(__dirname, '../src/app/(tabs)/explore.tsx');
const exploreSource = fs.readFileSync(exploreScreenPath, 'utf8');

test('ExploreScreen declares accessible filter chips for all Ethiopian curriculum units with 48pt touch targets', () => {
  assert.match(exploreSource, /accessibilityRole="button"/);
  assert.match(exploreSource, /accessibilityLabel=\{`All Topics filter, \$\{allLessons\.length\} labs total`\}/);
  assert.match(exploreSource, /accessibilityLabel=\{`Unit 1 Basics filter,/);
  assert.match(exploreSource, /accessibilityLabel=\{`Unit 7 Physics filter,/);
  assert.match(exploreSource, /accessibilityLabel=\{`Unit 2 Matter filter,/);
  assert.match(exploreSource, /accessibilityLabel=\{`Unit 6 Solar System filter,/);
  assert.match(exploreSource, /accessibilityState=\{\{\s*selected:\s*selectedFilter === 'all'\s*\}\}/);
  assert.match(exploreSource, /filterChip:[\s\S]*?minHeight:\s*spacing\.minTouchTarget/);
  assert.match(exploreSource, /haptics\.selection\(\)/);
});

test('ExploreScreen declares accessible lesson cards with 48pt touch targets and navigation feedback', () => {
  assert.match(exploreSource, /accessibilityRole="button"/);
  assert.match(exploreSource, /accessibilityLabel=\{`\$\{lesson\.title\}, Unit \$\{lesson\.lessonNumber\}, \$\{isCompleted \? 'completed' : 'not completed'\}`\}/);
  assert.match(exploreSource, /accessibilityHint="Opens this 10-step guided science lesson"/);
  assert.match(exploreSource, /haptics\.lightTick\(\)/);
  assert.match(exploreSource, /router\.push\(`\/lessons\/\$\{lesson\.id\}`/);
});
