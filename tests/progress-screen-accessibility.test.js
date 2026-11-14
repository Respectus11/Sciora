const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const progressScreenPath = path.resolve(__dirname, '../src/app/(tabs)/progress.tsx');
const progressSource = fs.readFileSync(progressScreenPath, 'utf8');

test('ProgressScreen declares accessible metric items with spoken values', () => {
  assert.match(progressSource, /accessibilityLabel=\{`\$\{completedImplementedCount\} labs completed`\}/);
  assert.match(progressSource, /accessibilityLabel=\{`\$\{stats\.correctQuestionsCount\} questions solved`\}/);
  assert.match(progressSource, /accessibilityLabel=\{`Quiz accuracy \$\{stats\.totalQuestionsAnswered > 0 \? `\$\{stats\.accuracyPercent\}%` : 'not available'\}`\}/);
});

test('ProgressScreen declares progressbar roles and values for overall and unit mastery', () => {
  assert.match(progressSource, /accessibilityRole="progressbar"/);
  assert.match(progressSource, /accessibilityValue=\{\{\s*min:\s*0,\s*max:\s*100,\s*now:\s*progressPercent\s*\}\}/);
  assert.match(progressSource, /accessibilityValue=\{\{\s*min:\s*0,\s*max:\s*100,\s*now:\s*percent\s*\}\}/);
  assert.match(progressSource, /accessibilityLabel=\{`Unit \$\{unit\.unitNumber\}: \$\{unit\.title\}, \$\{completed\} of \$\{total\} lessons completed, \$\{percent\} percent`\}/);
});

test('ProgressScreen declares an accessible zero-data privacy guarantee summary', () => {
  assert.match(progressSource, /accessibilityLabel="Zero-Data Privacy Guarantee: Sciora collects no personal details, names, locations, or analytics\. All your progress is stored exclusively inside this device's local database\."/);
});
