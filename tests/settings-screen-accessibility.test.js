const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const settingsScreenPath = path.resolve(__dirname, '../src/app/(tabs)/settings.tsx');
const settingsSource = fs.readFileSync(settingsScreenPath, 'utf8');

test('SettingsScreen declares switches with accessibility states and roles', () => {
  assert.match(settingsSource, /accessibilityRole="switch"/);
  assert.match(settingsSource, /accessibilityLabel="Reduce motion"/);
  assert.match(settingsSource, /accessibilityState=\{\{\s*checked:\s*settings\.reduceMotion\s*\}\}/);
  assert.match(settingsSource, /accessibilityLabel="High-contrast opaque cards"/);
  assert.match(settingsSource, /accessibilityState=\{\{\s*checked:\s*settings\.highContrast\s*\}\}/);
  assert.match(settingsSource, /accessibilityLabel="Haptic feedback"/);
  assert.match(settingsSource, /accessibilityState=\{\{\s*checked:\s*settings\.hapticsEnabled\s*\}\}/);
});

test('SettingsScreen provides haptic feedback on preference updates', () => {
  assert.match(settingsSource, /handlePreferenceChange = \(key: UserSettingKey, value: boolean\) => \{[\s\S]*?haptics\.selection\(\)/);
});

test('SettingsScreen declares accessible danger button with 48pt touch target and destructive haptics', () => {
  assert.match(settingsSource, /accessibilityLabel="Reset local learning progress"/);
  assert.match(settingsSource, /accessibilityHint="Permanently clears all quiz scores, simulation progress, and local checkpoints"/);
  assert.match(settingsSource, /dangerButton:[\s\S]*?minHeight:\s*spacing\.minTouchTarget/);
  assert.match(settingsSource, /handleResetProgress = \(\) => \{[\s\S]*?haptics\.heavySnap\(\)/);
  assert.match(settingsSource, /await progressRepository\.resetAllProgress\(\);[\s\S]*?haptics\.successNotification\(\)/);
});
