'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

const pillCode = read('src/components/ui/TerminologyPill.tsx');

test('TerminologyPillProps declares amharicTerm, phonetic, and category options', () => {
  assert.match(pillCode, /amharicTerm\?: string/);
  assert.match(pillCode, /phonetic\?: string/);
  assert.match(pillCode, /category\?: 'physics' \| 'chemistry' \| 'astronomy' \| 'investigation'/);
});

test('TerminologyPill exposes accessible button role, expanded state, and descriptive hints', () => {
  assert.match(pillCode, /accessibilityRole="button"/);
  assert.match(pillCode, /accessibilityState=\{\{ expanded: isExpanded \}\}/);
  assert.match(pillCode, /accessibilityHint=\{accessibleHint\}/);
  assert.match(pillCode, /hitSlop=\{\{ top: 8, bottom: 8, left: 6, right: 6 \}\}/);
});

test('TerminologyPill expanded card is announced as summary with definition', () => {
  assert.match(pillCode, /accessibilityRole="summary"/);
  assert.match(pillCode, /accessibilityLabel=\{\`\$\{term\} definition\`\}/);
});
