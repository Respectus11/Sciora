'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const lessonSource = fs.readFileSync(
  path.join(root, 'src', 'app', 'lessons', '[lessonId].tsx'),
  'utf8'
);

test('lesson runner navigation buttons expose accessible roles and touch targets', () => {
  assert.match(lessonSource, /backBtn:\s*\{[\s\S]*minWidth:\s*spacing\.minTouchTarget/);
  assert.match(lessonSource, /backBtn:\s*\{[\s\S]*minHeight:\s*spacing\.minTouchTarget/);
  assert.match(lessonSource, /prevBtn:\s*\{[\s\S]*minHeight:\s*spacing\.minTouchTarget/);
  assert.match(lessonSource, /accessibilityLabel=['"]Previous step['"]/);
});

test('prediction choices expose radio accessibility roles, labels, and touch targets', () => {
  assert.match(lessonSource, /accessibilityRole=['"]radio['"]/);
  assert.match(lessonSource, /accessibilityLabel=\{choice\.text\}/);
  assert.match(lessonSource, /accessibilityState=\{\{\s*selected:\s*isSelected\s*\}\}/);
  assert.match(lessonSource, /choiceBtn:\s*\{[\s\S]*minHeight:\s*spacing\.minTouchTarget/);
  assert.match(lessonSource, /haptics\.selection\(\)/);
});

test('quiz options expose button roles, dynamic letter labels, and touch targets', () => {
  assert.match(lessonSource, /accessibilityRole=['"]button['"]/);
  assert.match(lessonSource, /accessibilityLabel=\{`Option \$\{String\.fromCharCode\(65 \+ optIdx\)\}: \$\{opt\}`\}/);
  assert.match(lessonSource, /accessibilityState=\{\{\s*selected:\s*isThisSelected,\s*disabled:\s*hasAnswered\s*\}\}/);
  assert.match(lessonSource, /quizOptionBase:\s*\{[\s\S]*minHeight:\s*spacing\.minTouchTarget/);
  assert.match(lessonSource, /haptics\.successNotification\(\)/);
  assert.match(lessonSource, /haptics\.errorNotification\(\)/);
});
