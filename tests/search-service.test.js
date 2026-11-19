'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

const searchServiceCode = read('src/services/searchService.ts');

test('searchService declares SearchFilterOptions and SearchResult interfaces', () => {
  assert.match(searchServiceCode, /export interface SearchResult/);
  assert.match(searchServiceCode, /export interface SearchFilterOptions/);
  assert.match(searchServiceCode, /unitId\?: string/);
  assert.match(searchServiceCode, /type\?: SearchResultType/);
});

test('searchService provides query normalization and match scoring', () => {
  assert.match(searchServiceCode, /function normalize\(str: string\): string/);
  assert.match(searchServiceCode, /function computeMatchScore\(query: string, text: string\): number/);
  assert.match(searchServiceCode, /normText === normQuery/);
});

test('searchService implements unit, lesson, simulation, and competency matching', () => {
  assert.match(searchServiceCode, /search\(query: string, options: SearchFilterOptions = \{\}\): SearchResult\[\]/);
  assert.match(searchServiceCode, /contentService\.getAllUnits\(\)/);
  assert.match(searchServiceCode, /contentService\.getAllLessons\(\)/);
  assert.match(searchServiceCode, /options\.unitId && unit\.id !== options\.unitId/);
  assert.match(searchServiceCode, /options\.unitId && lesson\.unitId !== options\.unitId/);
});

test('searchService provides autocomplete suggestions helper', () => {
  assert.match(searchServiceCode, /getSuggestions\(query: string, maxSuggestions = \d+\): string\[\]/);
  assert.match(searchServiceCode, /suggestions\.add\(lesson\.title\)/);
});
