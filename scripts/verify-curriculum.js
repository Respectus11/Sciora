const fs = require('fs');
const path = require('path');

const curriculum = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../src/content/curriculum.json'), 'utf-8')
);
const unit01 = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../src/content/units/unit-01.json'), 'utf-8')
);
const unit07 = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../src/content/units/unit-07.json'), 'utf-8')
);
const unit02 = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../src/content/units/unit-02.json'), 'utf-8')
);
const unit06 = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../src/content/units/unit-06.json'), 'utf-8')
);

console.log('=== SCIORA CURRICULUM VERIFICATION AUDIT ===');
console.log(`Curriculum: ${curriculum.curriculumName} (Grade ${curriculum.grade})`);
console.log(`Units cataloged: ${curriculum.units.length}`);

const allLessons = [
  ...unit01.lessons,
  ...unit07.lessons,
  ...unit02.lessons,
  ...unit06.lessons,
];

console.log(`Total interactive lessons: ${allLessons.length}`);

let issues = 0;

allLessons.forEach((lesson) => {
  if (lesson.steps.length !== 10) {
    console.error(`❌ Lesson ${lesson.id} does not have exactly 10 steps! (Found: ${lesson.steps.length})`);
    issues++;
  }

  // Check step sequence
  const stepTypes = lesson.steps.map(s => s.type);
  const expectedTypes = [
    'intro',
    'ethiopian_context',
    'key_idea',
    'prediction',
    'simulation',
    'observation',
    'explanation',
    'quiz',
    'misconception',
    'summary'
  ];

  expectedTypes.forEach((t, idx) => {
    if (stepTypes[idx] !== t) {
      console.error(`❌ Lesson ${lesson.id} step ${idx + 1} type is "${stepTypes[idx]}", expected "${t}"`);
      issues++;
    }
  });

  // Verify prediction step
  const predStep = lesson.steps.find(s => s.type === 'prediction');
  if (!predStep || !predStep.predictionData || predStep.predictionData.choices.length < 2) {
    console.error(`❌ Lesson ${lesson.id} has invalid prediction choices`);
    issues++;
  } else {
    const hasSound = predStep.predictionData.choices.some(c => c.isScientificallySound);
    if (!hasSound) {
      console.error(`❌ Lesson ${lesson.id} prediction lacks a scientifically sound choice!`);
      issues++;
    }
  }

  // Verify quiz step
  const quizStep = lesson.steps.find(s => s.type === 'quiz');
  if (!quizStep || !quizStep.quizData || quizStep.quizData.questions.length === 0) {
    console.error(`❌ Lesson ${lesson.id} lacks quiz questions!`);
    issues++;
  } else {
    quizStep.quizData.questions.forEach((q, qIdx) => {
      if (q.correctIndex < 0 || q.correctIndex >= q.options.length) {
        console.error(`❌ Lesson ${lesson.id} Q${qIdx + 1} correctIndex out of range!`);
        issues++;
      }
    });
  }
});

if (issues === 0) {
  console.log('✅ ALL LESSONS PASS 100%: 10-step pedagogical integrity verified.');
  console.log('✅ All prediction hypotheses and checkpoint quizzes validated.');
  process.exit(0);
} else {
  console.error(`❌ Found ${issues} issues in curriculum content!`);
  process.exit(1);
}
