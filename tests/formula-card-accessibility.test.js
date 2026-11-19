'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

const formulaCardCode = read('src/components/ui/FormulaCard.tsx');

test('FormulaCardProps supports optional spokenFormula for screen readers', () => {
  assert.match(formulaCardCode, /spokenFormula\?: string/);
  assert.match(formulaCardCode, /cardAccessibilityLabel/);
});

test('FormulaCard exposes accessible roles and math announcements', () => {
  assert.match(formulaCardCode, /accessible=\{true\}/);
  assert.match(formulaCardCode, /accessibilityRole="text"/);
  assert.match(formulaCardCode, /Mathematical formula: \$\{spokenFormula \|\| formula\}/);
});

test('FormulaCard variable rows expose accessible variable name, symbol, and SI unit labels', () => {
  assert.match(formulaCardCode, /accessibilityLabel=\{\`\$\{v\.name\}, symbol \$\{v\.symbol\}, measured in \$\{v\.unit\}/);
});
