'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const soundSource = fs.readFileSync(
  path.join(root, 'src', 'simulations', 'physics', 'SoundWaveSimulation.tsx'),
  'utf8'
);

test('sound wave medium and frequency chips expose accessible roles and labels', () => {
  assert.match(soundSource, /accessibilityLabel=\{`Select transmission medium \$\{m\.name\}`\}/);
  assert.match(soundSource, /accessibilityHint=\{`Sets sound propagation speed to \$\{m\.speed\} meters per second`\}/);
  assert.match(soundSource, /accessibilityLabel=\{`Set frequency to \$\{f\} Hertz`\}/);
  assert.match(soundSource, /accessibilityLabel=\{`Set vibration amplitude to \$\{a\} millimeters`\}/);
  assert.match(soundSource, /minTouchTarget/);
});

test('vacuum chamber toggle exposes switch role and descriptive context', () => {
  assert.match(soundSource, /accessibilityRole=['"]switch['"]/);
  assert.match(soundSource, /accessibilityLabel=['"]Evacuate Chamber \(Vacuum Pump\)['"]/);
  assert.match(soundSource, /accessibilityHint=['"]Removes medium molecules to demonstrate sound requires a medium['"]/);
  assert.match(soundSource, /haptics\.heavySnap\(\)/);
  assert.match(soundSource, /haptics\.selection\(\)/);
});

test('sound wave simulation provides reliable reset restoring default air medium', () => {
  assert.match(soundSource, /setFrequency\(440\)/);
  assert.match(soundSource, /setAmplitude\(5\)/);
  assert.match(soundSource, /setIsVacuum\(false\)/);
  assert.match(soundSource, /setSelectedMedium\(MEDIA\[0\]\)/);
});
