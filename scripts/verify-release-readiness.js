#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
let failures = 0;
let warnings = 0;

function fail(message) {
  failures += 1;
  console.error('❌ ' + message);
}

function warn(message) {
  warnings += 1;
  console.warn('⚠️  ' + message);
}

function pass(message) {
  console.log('✅ ' + message);
}

function readJson(relativePath) {
  const absolutePath = path.join(ROOT, relativePath);
  try {
    return JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
  } catch (error) {
    fail(relativePath + ' is missing or invalid JSON: ' + error.message);
    return null;
  }
}

function isSafeRelativeAsset(relativePath) {
  if (typeof relativePath !== 'string' || !relativePath.trim()) return false;
  return fs.existsSync(path.resolve(ROOT, relativePath));
}

function getTrackedFiles() {
  try {
    return execFileSync('git', ['ls-files', '-z'], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).split('\0').filter(Boolean);
  } catch (error) {
    warn('Could not inspect Git-tracked files; secret-file checks are limited to this environment.');
    return [];
  }
}

console.log('\n=== SCIORA RELEASE READINESS AUDIT ===\n');

const app = readJson('app.json');
const pkg = readJson('package.json');
const lock = readJson('package-lock.json');
const eas = readJson('eas.json');
const gitignore = fs.existsSync(path.join(ROOT, '.gitignore'))
  ? fs.readFileSync(path.join(ROOT, '.gitignore'), 'utf8')
  : '';

if (app) {
  const expo = app.expo || {};
  const requiredStrings = [
    ['name', expo.name],
    ['slug', expo.slug],
    ['version', expo.version],
    ['scheme', expo.scheme],
    ['owner', expo.owner],
  ];

  for (const [field, value] of requiredStrings) {
    if (typeof value !== 'string' || !value.trim()) fail('app.json expo.' + field + ' must be a non-empty string.');
  }

  if (typeof expo.version === 'string' && !/^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(expo.version)) {
    fail('app.json expo.version must use semantic versioning.');
  }

  if (typeof expo.scheme === 'string' && !/^[a-z][a-z0-9+.-]*$/.test(expo.scheme)) {
    fail('app.json expo.scheme is not a valid URL scheme.');
  }

  const androidPackage = expo.android && expo.android.package;
  if (typeof androidPackage !== 'string' ||
      !/^[a-z][a-z0-9_]*(?:\.[a-z][a-z0-9_]*)+$/.test(androidPackage)) {
    fail('app.json must define a valid reverse-domain Android application ID.');
  }

  const projectId = expo.extra && expo.extra.eas && expo.extra.eas.projectId;
  if (typeof projectId !== 'string' ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(projectId)) {
    fail('app.json must define a valid EAS project UUID.');
  }

  const requiredAssets = [
    expo.icon,
    expo.ios && expo.ios.icon,
    expo.android && expo.android.adaptiveIcon && expo.android.adaptiveIcon.foregroundImage,
    expo.android && expo.android.adaptiveIcon && expo.android.adaptiveIcon.backgroundImage,
    expo.android && expo.android.adaptiveIcon && expo.android.adaptiveIcon.monochromeImage,
    expo.web && expo.web.favicon,
  ];
  const splashPlugin = (expo.plugins || []).find(
    (plugin) => Array.isArray(plugin) && plugin[0] === 'expo-splash-screen'
  );
  requiredAssets.push(splashPlugin && splashPlugin[1] && splashPlugin[1].image);

  for (const asset of requiredAssets) {
    if (!isSafeRelativeAsset(asset)) fail('Referenced app asset does not exist: ' + String(asset));
  }

  if (!(expo.plugins || []).includes('expo-router')) fail('Expo Router plugin is missing from app.json.');
  if (expo.userInterfaceStyle !== 'dark' && expo.userInterfaceStyle !== 'light' && expo.userInterfaceStyle !== 'automatic') {
    fail('app.json userInterfaceStyle must be dark, light, or automatic.');
  }

  if (pkg && pkg.version !== expo.version) {
    fail('package.json version (' + pkg.version + ') must match app.json version (' + expo.version + ').');
  }

  if (failures === 0) pass('Expo application metadata and referenced assets are valid.');
}

if (pkg && lock) {
  if (pkg.name !== lock.name || pkg.version !== lock.version || lock.lockfileVersion !== 3) {
    fail('package.json and package-lock.json metadata are out of sync (expected lockfile v3).');
  }

  const rootLock = lock.packages && lock.packages[''];
  if (!rootLock) {
    fail('package-lock.json is missing its root package entry.');
  } else {
    for (const section of ['dependencies', 'devDependencies']) {
      const declared = pkg[section] || {};
      const locked = rootLock[section] || {};
      const names = new Set([...Object.keys(declared), ...Object.keys(locked)]);
      for (const name of names) {
        if (declared[name] !== locked[name]) {
          fail('package-lock.json ' + section + ' entry differs for ' + name + '.');
        }
      }
    }
    pass('package.json and package-lock.json dependency declarations match.');
  }
}

if (eas) {
  const build = eas.build || {};
  if (!build.development || build.development.developmentClient !== true ||
      build.development.distribution !== 'internal') {
    fail('EAS development profile must enable a development client with internal distribution.');
  }
  if (!build.preview || build.preview.distribution !== 'internal' ||
      !build.preview.android || !['apk', 'app-bundle'].includes(build.preview.android.buildType)) {
    fail('EAS preview profile must use internal distribution and an explicit Android build type.');
  }
  if (!build.production || !build.production.android ||
      !['apk', 'app-bundle'].includes(build.production.android.buildType)) {
    fail('EAS production profile must declare an Android APK or app-bundle build type.');
  } else if (build.production.android.buildType === 'apk') {
    warn('EAS production currently builds an APK. Use app-bundle for a Google Play Store release.');
  }
  if (failures === 0) pass('EAS development, preview, and production profiles are explicitly configured.');
}

if (!gitignore.includes('.env') ||
    !gitignore.includes('*.keystore') ||
    !gitignore.includes('.expo-e2e-export/')) {
  fail('.gitignore must exclude .env files, signing keystores, and the temporary Android export directory.');
}

const trackedFiles = getTrackedFiles();
const sensitiveFiles = trackedFiles.filter((file) => {
  const base = path.posix.basename(file).toLowerCase();
  const envFile = base === '.env' || (base.startsWith('.env.') && !base.endsWith('.example'));
  const signingFile = ['.jks', '.keystore', '.p8', '.p12', '.mobileprovision', '.key'].some((ext) => base.endsWith(ext));
  return envFile || signingFile;
});

if (sensitiveFiles.length) {
  for (const file of sensitiveFiles) fail('Potential secret or signing file is tracked by Git: ' + file);
} else if (trackedFiles.length) {
  pass('No environment secrets or signing-key files are tracked by Git.');
} else {
  warn('No Git-tracked file list was available for secret-file inspection.');
}

for (const requiredFile of ['LICENSE', 'THIRD_PARTY_NOTICES.md']) {
  if (!fs.existsSync(path.join(ROOT, requiredFile))) fail('Missing release/legal file: ' + requiredFile);
  else pass(requiredFile + ' is present.');
}

console.log('\nRelease audit summary: ' + failures + ' failure(s), ' + warnings + ' warning(s).');
if (failures) {
  console.error('Release readiness audit failed. Resolve the issues above before preparing a release.');
  process.exit(1);
}
if (warnings) {
  console.log('Release readiness checks passed with warnings that need a release decision.');
} else {
  console.log('All release readiness checks passed.');
}
