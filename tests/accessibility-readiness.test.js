'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const settings = fs.readFileSync(path.join(root, 'src', 'app', '(tabs)', 'settings.tsx'), 'utf8');
const primaryButton = fs.readFileSync(path.join(root, 'src', 'components', 'ui', 'PrimaryButton.tsx'), 'utf8');
const spacing = fs.readFileSync(path.join(root, 'src', 'design-system', 'spacing.ts'), 'utf8');

test('settings switches expose explicit labels and hints to assistive technology', () => {
  const labels = [
    'Reduce motion',
    'High-contrast opaque cards',
    'Haptic feedback',
  ];

  for (const label of labels) {
    assert.ok(
      settings.includes('accessibilityLabel="' + label + '"'),
      'Settings switch needs the accessible label: ' + label
    );
  }

  const switchRoles = settings.match(/accessibilityRole="switch"/g) || [];
  const hints = settings.match(/accessibilityHint=/g) || [];
  assert.equal(switchRoles.length, 3, 'All three settings controls should be exposed as switches');
  assert.ok(hints.length >= 3, 'Each settings switch should provide usage context');
});

test('settings rows and destructive action meet the 48-point touch target token', () => {
  assert.match(spacing, /minTouchTarget:\s*48/);
  assert.match(settings, /settingRow:\s*\{\s*minHeight:\s*spacing\.minTouchTarget/);
  assert.match(settings, /dangerButton:\s*\{\s*minHeight:\s*spacing\.minTouchTarget/);
  assert.match(settings, /accessibilityLabel="Reset local learning progress"/);
});

test('shared primary buttons expose accessible role, label, and disabled state', () => {
  assert.match(primaryButton, /accessibilityRole="button"/);
  assert.match(primaryButton, /accessibilityLabel=\{title\}/);
  assert.match(primaryButton, /accessibilityState=\{\{ disabled:/);
  assert.match(primaryButton, /minHeight:\s*spacing\.minTouchTarget/);
});

test('About screen displays the app version from Expo configuration', () => {
  assert.match(settings, /import Constants from ['"]expo-constants['"]/);
  assert.match(settings, /Constants\\.expoConfig\\?\\.version/);
  assert.doesNotMatch(settings, /Phase C Build/);
});
