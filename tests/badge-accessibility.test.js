'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

const badgeCode = read('src/components/ui/Badge.tsx');

test('Badge supports color and semantic variants including info, success, warning, error, science', () => {
  assert.match(badgeCode, /export type BadgeVariant/);
  assert.match(badgeCode, /\|\s*'info'[\s\S]*\|\s*'success'[\s\S]*\|\s*'warning'[\s\S]*\|\s*'error'[\s\S]*\|\s*'science'/);
  assert.match(badgeCode, /variantAliasMap/);
});

test('Badge declares accessible text role and default announcement label', () => {
  assert.match(badgeCode, /accessible=\{true\}/);
  assert.match(badgeCode, /accessibilityRole="text"/);
  assert.match(badgeCode, /accessibilityLabel=\{accessibilityLabel \|\| \`\$\{label\} badge\`\}/);
});
