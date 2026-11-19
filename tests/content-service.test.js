'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

const contentServiceCode = read('src/services/contentService.ts');

test('contentService provides standard unit and lesson retrieval', () => {
  assert.match(contentServiceCode, /getAllUnits\(\): CurriculumUnit\[\]/);
  assert.match(contentServiceCode, /getUnitById\(id: string\): CurriculumUnit \| undefined/);
  assert.match(contentServiceCode, /getLessonsByUnit\(unitId: string\): Lesson\[\]/);
  assert.match(contentServiceCode, /getLessonById\(lessonId: string\): Lesson \| undefined/);
  assert.match(contentServiceCode, /getAllLessons\(\): Lesson\[\]/);
});

test('contentService implements sequential lesson navigation helpers', () => {
  assert.match(contentServiceCode, /getLessonNavigation\(lessonId: string\): \{ prevLesson: Lesson \| null; nextLesson: Lesson \| null \}/);
  assert.match(contentServiceCode, /currentIndex > 0 \? allLessons\[currentIndex - 1\] : null/);
  assert.match(contentServiceCode, /currentIndex < allLessons\.length - 1 \? allLessons\[currentIndex \+ 1\] : null/);
});

test('contentService provides curriculum stats and simulation lookup', () => {
  assert.match(contentServiceCode, /getCurriculumStats\(\): \{ totalUnits: number; totalLessons: number; totalCompetencies: number \}/);
  assert.match(contentServiceCode, /getUnitsWithLessonCounts\(\): Array<\{ unit: CurriculumUnit; lessonCount: number \}>/);
  assert.match(contentServiceCode, /getLessonsBySimulationId\(simulationId: string\): Lesson\[\]/);
});
