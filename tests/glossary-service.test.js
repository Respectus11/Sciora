'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

const glossaryServiceCode = read('src/services/glossaryService.ts');

test('glossaryService defines GlossaryEntry schema and category types', () => {
  assert.match(glossaryServiceCode, /export interface GlossaryEntry/);
  assert.match(glossaryServiceCode, /category:\s*'physics' \| 'chemistry' \| 'astronomy' \| 'investigation'/);
  assert.match(glossaryServiceCode, /amharicTerm\?: string/);
  assert.match(glossaryServiceCode, /phonetic: string/);
  assert.match(glossaryServiceCode, /curriculumRef: string/);
});

test('glossary database includes bilingual entries across curriculum units', () => {
  assert.match(glossaryServiceCode, /id:\s*'density'/);
  assert.match(glossaryServiceCode, /እፍጋት \(Efgat\)/);
  assert.match(glossaryServiceCode, /id:\s*'atomic-number'/);
  assert.match(glossaryServiceCode, /id:\s*'ohms-law'/);
  assert.match(glossaryServiceCode, /id:\s*'snells-law'/);
  assert.match(glossaryServiceCode, /id:\s*'refractive-index'/);
  assert.match(glossaryServiceCode, /id:\s*'electric-current'/);
});

test('glossaryService exposes retrieval methods including category, related terms, and Amharic lookup', () => {
  assert.match(glossaryServiceCode, /getAllTerms\(\): GlossaryEntry\[\]/);
  assert.match(glossaryServiceCode, /getTermById\(id: string\): GlossaryEntry \| undefined/);
  assert.match(glossaryServiceCode, /getTermsByUnit\(unitId: string\): GlossaryEntry\[\]/);
  assert.match(glossaryServiceCode, /getTermsByCategory\(category: string\): GlossaryEntry\[\]/);
  assert.match(glossaryServiceCode, /getCategories\(\): string\[\]/);
  assert.match(glossaryServiceCode, /getRelatedTerms\(id: string\): GlossaryEntry\[\]/);
  assert.match(glossaryServiceCode, /getTermByAmharic\(amharicQuery: string\): GlossaryEntry \| undefined/);
});
