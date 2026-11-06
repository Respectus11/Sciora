#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT_DIR, 'src', 'content');
const UNITS_DIR = path.join(CONTENT_DIR, 'units');
const curriculum = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, 'curriculum.json'), 'utf-8'));
const unitFiles = fs.readdirSync(UNITS_DIR)
  .filter((name) => name.startsWith('unit-') && name.endsWith('.json'))
  .sort();
const unitDocuments = unitFiles.map((file) => ({
  file,
  expectedUnitId: file.slice(0, -5),
  data: JSON.parse(fs.readFileSync(path.join(UNITS_DIR, file), 'utf-8')),
}));

const EXPECTED_STEP_TYPES = [
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
const SIMULATION_IDS = new Set([
  'sim-1-density',
  'sim-7-1-reflection',
  'sim-7-1-refraction',
  'sim-7-3-sound',
  'sim-7-4-heat',
  'sim-7-5-circuit',
  'sim-7-6-magnetism',
  'sim-2-atom',
  'sim-6-solar',
]);

let issues = 0;
const lessonIds = new Set();
const questionIds = new Set();
const unitIds = new Set();
const lessonsByUnit = new Map();
const allLessons = [];

function fail(message) {
  console.error('❌ ' + message);
  issues += 1;
}

function nonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

console.log('=== SCIORA CURRICULUM VALIDATION ===');
console.log('Curriculum: ' + curriculum.curriculumName + ' (Grade ' + curriculum.grade + ')');

for (const unit of curriculum.units || []) {
  if (!nonEmptyString(unit.id)) {
    fail('Curriculum contains a unit without an ID.');
    continue;
  }
  if (unitIds.has(unit.id)) fail('Duplicate curriculum unit ID: ' + unit.id);
  unitIds.add(unit.id);
}

for (const document of unitDocuments) {
  if (!unitIds.has(document.expectedUnitId)) {
    fail(document.file + ' has no matching unit entry in curriculum.json.');
  }

  const lessons = document.data.lessons;
  if (!Array.isArray(lessons)) {
    fail(document.file + ' must contain a lessons array.');
    continue;
  }

  for (const lesson of lessons) {
    allLessons.push(lesson);
    lessonsByUnit.set(lesson.unitId, (lessonsByUnit.get(lesson.unitId) || 0) + 1);

    if (!nonEmptyString(lesson.id)) fail(document.file + ' contains a lesson without an ID.');
    else if (lessonIds.has(lesson.id)) fail('Duplicate lesson ID: ' + lesson.id);
    else lessonIds.add(lesson.id);

    if (!nonEmptyString(lesson.title)) fail('Lesson ' + lesson.id + ' has no title.');
    if (!nonEmptyString(lesson.subtitle)) fail('Lesson ' + lesson.id + ' has no subtitle.');
    if (!nonEmptyString(lesson.textbookPageRef)) fail('Lesson ' + lesson.id + ' has no textbook reference.');
    if (!Number.isFinite(lesson.estimatedMinutes) || lesson.estimatedMinutes <= 0) {
      fail('Lesson ' + lesson.id + ' must have a positive estimated duration.');
    }
    if (!unitIds.has(lesson.unitId)) fail('Lesson ' + lesson.id + ' references unknown unit ' + lesson.unitId + '.');
    if (lesson.unitId !== document.expectedUnitId) {
      fail('Lesson ' + lesson.id + ' is stored in ' + document.file + ' but declares unit ' + lesson.unitId + '.');
    }
    if (!SIMULATION_IDS.has(lesson.simulationId)) {
      fail('Lesson ' + lesson.id + ' references an unknown simulation: ' + lesson.simulationId);
    }

    const steps = lesson.steps;
    if (!Array.isArray(steps) || steps.length !== EXPECTED_STEP_TYPES.length) {
      fail('Lesson ' + lesson.id + ' must contain exactly ' + EXPECTED_STEP_TYPES.length + ' steps.');
      continue;
    }

    for (let index = 0; index < EXPECTED_STEP_TYPES.length; index += 1) {
      const step = steps[index];
      const expectedType = EXPECTED_STEP_TYPES[index];

      if (step.stepNumber !== index + 1) {
        fail('Lesson ' + lesson.id + ' step ' + (index + 1) + ' has an invalid stepNumber.');
      }
      if (step.type !== expectedType) {
        fail('Lesson ' + lesson.id + ' step ' + (index + 1) + ' must be ' + expectedType + ', not ' + step.type + '.');
      }
      if (!nonEmptyString(step.title)) fail('Lesson ' + lesson.id + ' step ' + (index + 1) + ' has no title.');
      if (!nonEmptyString(step.content)) fail('Lesson ' + lesson.id + ' step ' + (index + 1) + ' has no content.');
    }

    const predictionStep = steps.find((step) => step.type === 'prediction');
    const prediction = predictionStep && predictionStep.predictionData;
    if (!prediction || !nonEmptyString(prediction.prompt) || !Array.isArray(prediction.choices) || prediction.choices.length < 2) {
      fail('Lesson ' + lesson.id + ' must have a prompt and at least two prediction choices.');
    } else {
      const localChoiceIds = new Set();
      let scientificallySoundChoices = 0;
      for (const choice of prediction.choices) {
        if (!nonEmptyString(choice.id) || !nonEmptyString(choice.text) || !nonEmptyString(choice.feedback)) {
          fail('Lesson ' + lesson.id + ' contains an incomplete prediction choice.');
        }
        if (localChoiceIds.has(choice.id)) fail('Lesson ' + lesson.id + ' has duplicate prediction choice ID ' + choice.id + '.');
        localChoiceIds.add(choice.id);
        if (choice.isScientificallySound === true) scientificallySoundChoices += 1;
      }
      if (scientificallySoundChoices !== 1) {
        fail('Lesson ' + lesson.id + ' must have exactly one scientifically sound prediction choice.');
      }
    }

    const quizStep = steps.find((step) => step.type === 'quiz');
    const questions = quizStep && quizStep.quizData && quizStep.quizData.questions;
    if (!Array.isArray(questions) || questions.length === 0) {
      fail('Lesson ' + lesson.id + ' must contain at least one quiz question.');
    } else {
      for (const question of questions) {
        if (!nonEmptyString(question.id)) {
          fail('Lesson ' + lesson.id + ' contains a quiz question without an ID.');
        } else if (questionIds.has(question.id)) {
          fail('Duplicate quiz question ID: ' + question.id);
        } else {
          questionIds.add(question.id);
        }

        if (!nonEmptyString(question.question)) fail('Lesson ' + lesson.id + ' has a quiz question without prompt text.');
        if (!Array.isArray(question.options) || question.options.length < 2 ||
            question.options.some((option) => !nonEmptyString(option))) {
          fail('Lesson ' + lesson.id + ' question ' + (question.id || '(missing ID)') + ' must have at least two nonempty options.');
        } else if (!Number.isInteger(question.correctIndex) ||
                   question.correctIndex < 0 || question.correctIndex >= question.options.length) {
          fail('Lesson ' + lesson.id + ' question ' + question.id + ' has an invalid correctIndex.');
        }
        if (!nonEmptyString(question.explanation)) {
          fail('Lesson ' + lesson.id + ' question ' + (question.id || '(missing ID)') + ' has no explanation.');
        }
      }
    }

    const simulationStep = steps.find((step) => step.type === 'simulation');
    const stepSimulationId = simulationStep &&
      ((simulationStep.simulationData && simulationStep.simulationData.simId) || simulationStep.simulationId);
    if (!stepSimulationId || stepSimulationId !== lesson.simulationId) {
      fail('Lesson ' + lesson.id + ' simulation step does not match lesson.simulationId.');
    }
  }
}

for (const unit of curriculum.units || []) {
  const actual = allLessons.filter((lesson) => lesson.unitId === unit.id).length;
  if (unit.totalLessons !== actual) {
    fail('Unit ' + unit.id + ' declares ' + unit.totalLessons + ' lessons but contains ' + actual + '.');
  }
}

console.log('Units validated: ' + (curriculum.units || []).length);
console.log('Lessons validated: ' + allLessons.length);
console.log('Quiz questions validated: ' + questionIds.size);

if (issues === 0) {
  console.log('✅ Curriculum IDs, lesson structure, predictions, quizzes, simulation links, and lesson counts are valid.');
  process.exit(0);
}

console.error('❌ Curriculum validation failed with ' + issues + ' issue(s).');
process.exit(1);
