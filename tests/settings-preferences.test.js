'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

const repository = read('src/database/settingsRepository.ts');
const context = read('src/contexts/SettingsContext.tsx');
const settingsScreen = read('src/app/(tabs)/settings.tsx');
const rootLayout = read('src/app/_layout.tsx');
const glassCard = read('src/components/ui/GlassCard.tsx');
const haptics = read('src/utils/haptics.ts');
const runtime = read('src/utils/settingsRuntime.ts');

test('preferences use the existing SQLite settings table with safe defaults', () => {
  assert.match(repository, /DEFAULT_USER_SETTINGS/);
  assert.match(repository, /SELECT key, value FROM user_settings/);
  assert.match(repository, /INSERT INTO user_settings/);
  assert.match(repository, /ON CONFLICT\(key\) DO UPDATE/);
  assert.match(repository, /parseStoredBoolean/);
});

test('settings provider restores stored preferences and persists before publishing changes', () => {
  assert.match(context, /settingsRepository\.getSettings\(\)/);
  assert.match(context, /setSettingsSnapshot\(loadedSettings\)/);
  assert.match(context, /await settingsRepository\.setPreference\(key, value\)/);
  assert.match(context, /SettingsContext\.Provider/);
  assert.match(runtime, /getSettingsSnapshot/);
});

test('Settings screen is controlled by app settings, not temporary local state', () => {
  assert.match(settingsScreen, /useAppSettings\(\)/);
  assert.doesNotMatch(settingsScreen, /useState/);
  for (const key of ['reduceMotion', 'highContrast', 'hapticsEnabled']) {
    assert.match(settingsScreen, new RegExp('value=\\{settings\\.' + key + '\\}'));
    assert.ok(settingsScreen.includes("handlePreferenceChange('" + key + "', value)"));
  }
  assert.match(settingsScreen, /disabled=\{isLoading\}/);
  assert.match(settingsScreen, /Setting not saved/);
});

test('reduced motion and high contrast affect shared application components', () => {
  assert.match(rootLayout, /SettingsProvider/);
  assert.match(rootLayout, /settings\.reduceMotion \? 'none' : 'slide_from_right'/);
  assert.match(glassCard, /settings\.highContrast/);
  assert.match(glassCard, /variant === 'opaque' \|\| settings\.highContrast/);
});

test('the centralized haptics utility respects the saved preference', () => {
  assert.match(haptics, /getSettingsSnapshot\(\)\.hapticsEnabled/);
  const guards = haptics.match(/!getSettingsSnapshot\(\)\.hapticsEnabled/g) || [];
  assert.equal(guards.length, 7, 'Every haptic feedback method should respect the preference');
});
