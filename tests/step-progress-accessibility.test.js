'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

const stepProgressCode = read('src/components/ui/StepProgress.tsx');

test('StepProgress declares progressbar accessibility role and bounds', () => {
  assert.match(stepProgressCode, /accessibilityRole="progressbar"/);
  assert.match(stepProgressCode, /accessibilityValue=\{\{/);
  assert.match(stepProgressCode, /min:\s*1/);
  assert.match(stepProgressCode, /max:\s*totalSteps/);
  assert.match(stepProgressCode, /now:\s*currentStepIndex \+ 1/);
});

test('StepProgress segments declare accessibility roles, selection states, and hints', () => {
  assert.match(stepProgressCode, /accessibilityRole=\{onStepPress \? 'button' : 'none'\}/);
  assert.match(stepProgressCode, /accessibilityState=\{\{ selected: isCurrent, disabled: !onStepPress \}\}/);
  assert.match(stepProgressCode, /accessibilityHint=\{onStepPress \? \`Jumps to step \$\{idx \+ 1\}\` : undefined\}/);
});
