'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

const backupServiceCode = read('src/services/backupService.ts');

test('backupService declares StudentBackupPayload and ImportSummary contracts', () => {
  assert.match(backupServiceCode, /export interface StudentBackupPayload/);
  assert.match(backupServiceCode, /version: number/);
  assert.match(backupServiceCode, /exportedAt: number/);
  assert.match(backupServiceCode, /progress: LessonProgressRecord\[\]/);
  assert.match(backupServiceCode, /notes: StudentNote\[\]/);
  assert.match(backupServiceCode, /bookmarks: LessonBookmark\[\]/);
  assert.match(backupServiceCode, /quizAttempts: QuizAttemptRecord\[\]/);
});

test('backupService implements payload validation and schema checking', () => {
  assert.match(backupServiceCode, /validatePayload\(payload: unknown\)/);
  assert.match(backupServiceCode, /Unsupported schema version/);
  assert.match(backupServiceCode, /must be an array/);
  assert.match(backupServiceCode, /getPayloadSummary\(payload: StudentBackupPayload\)/);
});

test('backupService handles export and idempotent import transactions', () => {
  assert.match(backupServiceCode, /exportStudentData\(\): Promise<StudentBackupPayload>/);
  assert.match(backupServiceCode, /importStudentData\(payload: StudentBackupPayload\): Promise<ImportSummary>/);
  assert.match(backupServiceCode, /db\.withTransactionAsync/);
  assert.match(backupServiceCode, /INSERT OR REPLACE INTO lesson_progress/);
  assert.match(backupServiceCode, /clearAllStudentData\(\): Promise<void>/);
});
