'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

const notesRepoCode = read('src/database/notesRepository.ts');

test('notesRepository defines StudentNote and LessonBookmark schema interfaces', () => {
  assert.match(notesRepoCode, /export interface StudentNote/);
  assert.match(notesRepoCode, /export interface LessonBookmark/);
  assert.match(notesRepoCode, /export const MAX_NOTE_LENGTH = 2000/);
});

test('notesRepository provides input validation for note text', () => {
  assert.match(notesRepoCode, /validateNoteInput\(text: string\)/);
  assert.match(notesRepoCode, /Note text cannot be empty/);
  assert.match(notesRepoCode, /Note exceeds maximum length/);
});

test('notesRepository supports search, bookmarks filtering, and unit metrics', () => {
  assert.match(notesRepoCode, /searchNotes\(query: string\): Promise<StudentNote\[\]>/);
  assert.match(notesRepoCode, /getBookmarksByUnit\(unitId: string\): Promise<LessonBookmark\[\]>/);
  assert.match(notesRepoCode, /getNotesCountByUnit\(unitId: string\): Promise<number>/);
  assert.match(notesRepoCode, /toggleBookmark\(lessonId: string, unitId: string\)/);
});
