'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const workspaceSource = fs.readFileSync(
  path.join(root, 'src', 'components', 'simulation', 'SimulationWorkspace.tsx'),
  'utf8'
);

test('simulation workspace toolbar buttons expose accessible button roles and labels', () => {
  assert.match(workspaceSource, /accessibilityRole=['"]button['"]/);
  assert.match(workspaceSource, /accessibilityLabel=['"]Toggle instructions['"]/);
  assert.match(workspaceSource, /accessibilityHint=['"]Shows or hides guided lab steps['"]/);
  assert.match(workspaceSource, /accessibilityLabel=['"]Reset simulation['"]/);
  assert.match(workspaceSource, /accessibilityHint=['"]Restores default simulation controls and measurements['"]/);
  assert.match(workspaceSource, /haptics\.mediumClick\(\)/);
  assert.match(workspaceSource, /haptics\.selection\(\)/);
});

test('simulation workspace toolbar buttons meet 48-point touch target minimum', () => {
  assert.match(workspaceSource, /minWidth:\s*spacing\.minTouchTarget/);
  assert.match(workspaceSource, /minHeight:\s*spacing\.minTouchTarget/);
});
