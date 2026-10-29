'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const contentRoot = path.join(root, 'src', 'content');
const curriculum = JSON.parse(fs.readFileSync(path.join(contentRoot, 'curriculum.json'), 'utf8'));
const unitDirectory = path.join(contentRoot, 'units');
const unitFiles = fs.readdirSync(unitDirectory)
  .filter((file) => file.startsWith('unit-') && file.endsWith('.json'))
  .sort();
const unitDocuments = unitFiles.map((file) => ({
  file,
  expectedUnitId: file.slice(0, -5),
  data: JSON.parse(fs.readFileSync(path.join(unitDirectory, file), 'utf8')),
}));
const lessons = unitDocuments.flatMap(({ data }) => data.lessons || []);
const expectedStepTypes = [
  'intro',
  'ethiopian_context',
  'key_idea',
  'prediction',
  'simulation',
  'observation',
  'explanation',
  'quiz',
  'misconception',
  'summary',
];
const registrySource = fs.readFileSync(path.join(root, 'src', 'simulations', 'registry.ts'), 'utf8');
const registryIds = new Set(
  [...registrySource.matchAll(/^\s*'([^']+)':\s*\{/gm)].map((match) => match[1])
);

test('every curriculum unit count matches the bundled lessons', () => {
  assert.ok(Array.isArray(curriculum.units), 'curriculum.units must be an array');

  for (const unit of curriculum.units) {
    const actual = lessons.filter((lesson) => lesson.unitId === unit.id).length;
    assert.equal(
      unit.totalLessons,
      actual,
      `Unit ${unit.id} declares ${unit.totalLessons} lessons but bundles ${actual}`
    );
  }

  for (const document of unitDocuments) {
    assert.ok(
      curriculum.units.some((unit) => unit.id === document.expectedUnitId),
      `${document.file} must have a matching curriculum unit`
    );
  }
});

test('lesson IDs are present and globally unique', () => {
  const ids = lessons.map((lesson) => lesson.id);
  assert.ok(ids.length > 0, 'at least one lesson should be bundled');
  assert.ok(ids.every((id) => typeof id === 'string' && id.trim()), 'every lesson needs an ID');
  assert.equal(new Set(ids).size, ids.length, 'lesson IDs must not collide');
});

test('each lesson has the expected ten ordered learning steps', () => {
  for (const lesson of lessons) {
    assert.equal(lesson.steps.length, expectedStepTypes.length, `${lesson.id}: step count`);
    lesson.steps.forEach((step, index) => {
      assert.equal(step.stepNumber, index + 1, `${lesson.id}: step number ${index + 1}`);
      assert.equal(step.type, expectedStepTypes[index], `${lesson.id}: step type ${index + 1}`);
      assert.ok(step.title?.trim(), `${lesson.id}: step ${index + 1} needs a title`);
      assert.ok(step.content?.trim(), `${lesson.id}: step ${index + 1} needs content`);
    });
  }
});

test('prediction choices have unique IDs and exactly one scientifically sound answer', () => {
  for (const lesson of lessons) {
    const step = lesson.steps.find((item) => item.type === 'prediction');
    assert.ok(step?.predictionData?.prompt?.trim(), `${lesson.id}: prediction prompt missing`);
    const choices = step.predictionData.choices;
    assert.ok(Array.isArray(choices) && choices.length >= 2, `${lesson.id}: needs at least two choices`);

    const ids = choices.map((choice) => choice.id);
    assert.ok(ids.every((id) => typeof id === 'string' && id.trim()), `${lesson.id}: choice ID missing`);
    assert.equal(new Set(ids).size, ids.length, `${lesson.id}: prediction choice IDs must be unique`);
    assert.equal(
      choices.filter((choice) => choice.isScientificallySound === true).length,
      1,
      `${lesson.id}: exactly one choice must be scientifically sound`
    );
    for (const choice of choices) {
      assert.ok(choice.text?.trim(), `${lesson.id}: prediction choice text missing`);
      assert.ok(choice.feedback?.trim(), `${lesson.id}: prediction feedback missing`);
    }
  }
});

test('quiz question IDs are present and unique, with valid answer indexes', () => {
  const questions = lessons.flatMap((lesson) => {
    const quiz = lesson.steps.find((step) => step.type === 'quiz');
    assert.ok(Array.isArray(quiz?.quizData?.questions) && quiz.quizData.questions.length > 0,
      `${lesson.id}: quiz questions missing`);
    return quiz.quizData.questions.map((question) => ({ lessonId: lesson.id, question }));
  });
  const ids = questions.map(({ question }) => question.id);

  assert.ok(ids.every((id) => typeof id === 'string' && id.trim()), 'every quiz question needs an ID');
  assert.equal(new Set(ids).size, ids.length, 'quiz question IDs must be globally unique');

  for (const { lessonId, question } of questions) {
    assert.ok(question.question?.trim(), `${lessonId}/${question.id}: prompt missing`);
    assert.ok(Array.isArray(question.options) && question.options.length >= 2,
      `${lessonId}/${question.id}: needs at least two options`);
    assert.ok(question.options.every((option) => typeof option === 'string' && option.trim()),
      `${lessonId}/${question.id}: options must not be empty`);
    assert.ok(Number.isInteger(question.correctIndex), `${lessonId}/${question.id}: correctIndex must be an integer`);
    assert.ok(question.correctIndex >= 0 && question.correctIndex < question.options.length,
      `${lessonId}/${question.id}: correctIndex is out of range`);
    assert.ok(question.explanation?.trim(), `${lessonId}/${question.id}: explanation missing`);
  }
});

test('lesson and simulation-step references resolve to registered simulations', () => {
  assert.ok(registryIds.size > 0, 'simulation registry should not be empty');

  for (const lesson of lessons) {
    assert.ok(registryIds.has(lesson.simulationId),
      `${lesson.id}: unregistered simulation ${lesson.simulationId}`);
    const simulationStep = lesson.steps.find((step) => step.type === 'simulation');
    const stepId = simulationStep?.simulationData?.simId || simulationStep?.simulationId;
    assert.equal(stepId, lesson.simulationId, `${lesson.id}: lesson and step simulation IDs differ`);
  }
});

test('existing curriculum audit accepts the current bundled content', () => {
  const { spawnSync } = require('node:child_process');
  const result = spawnSync(process.execPath, ['scripts/verify-curriculum.js'], {
    cwd: root,
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, [result.stdout, result.stderr].filter(Boolean).join('\n'));
});
