'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

const progressRepoCode = read('src/database/progressRepository.ts');

test('progressRepository declares LessonProgressRecord and GlobalStats interfaces', () => {
  assert.match(progressRepoCode, /export interface LessonProgressRecord/);
  assert.match(progressRepoCode, /is_completed:\s*number/);
  assert.match(progressRepoCode, /export interface GlobalStats/);
  assert.match(progressRepoCode, /accuracyPercent:\s*number/);
});

test('progressRepository implements atomic progress persistence and upsert', () => {
  assert.match(progressRepoCode, /saveLessonStep/);
  assert.match(progressRepoCode, /ON CONFLICT\(lesson_id\) DO UPDATE/);
  assert.match(progressRepoCode, /savePrediction/);
  assert.match(progressRepoCode, /saveQuizAttempt/);
});

test('progressRepository provides unit aggregation and mastery calculation helpers', () => {
  assert.match(progressRepoCode, /getUnitProgress\(unitId: string\)/);
  assert.match(progressRepoCode, /isLessonCompleted\(lessonId: string\)/);
  assert.match(progressRepoCode, /calculateMasteryPercentage\(completed: number, total: number\): number/);
  assert.match(progressRepoCode, /Math\.min\(100, Math\.max\(0, Math\.round\(ratio\)\)\)/);
});
