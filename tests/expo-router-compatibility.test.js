'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const appRoot = path.join(root, 'src', 'app');

function sourceFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(target);
    return /\.[jt]sx?$/.test(entry.name) ? [target] : [];
  });
}

test('application navigation imports use Expo Router SDK 56+ entry points', () => {
  const files = sourceFiles(appRoot);
  assert.ok(files.length > 0, 'Expo Router application source should exist');

  const legacyImports = [];
  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8');
    const importPattern = /(?:from\s*|import\s*\()(['"])@react-navigation\/[^'"]+\1/g;
    for (const match of source.matchAll(importPattern)) {
      legacyImports.push(path.relative(root, file) + ': ' + match[0]);
    }
  }

  assert.deepEqual(
    legacyImports,
    [],
    'SDK 56+ application code must import navigation APIs from expo-router entry points'
  );
});

test('root theme provider is imported from the Expo Router compatibility entry point', () => {
  const rootLayout = fs.readFileSync(path.join(appRoot, '_layout.tsx'), 'utf8');
  assert.match(
    rootLayout,
    /from\s+['"]expo-router\/react-navigation['"]/,
    'Root layout should import ThemeProvider and DarkTheme from expo-router/react-navigation'
  );
  assert.doesNotMatch(
    rootLayout,
    /from\s+['"]@react-navigation\/native['"]/,
    'Root layout must not import directly from @react-navigation/native'
  );
});
