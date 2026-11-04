#!/usr/bin/env node

/**
 * Sciora Master Audit Runner
 * Executes all curriculum, simulation, design system, and TypeScript checks.
 */

const { execSync } = require('child_process');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

console.log('\n🚀 ========================================');
console.log('   SCIORA MASTER QUALITY & AUDIT RUNNER   ');
console.log('========================================\n');

const SUITES = [
  { name: 'Curriculum Integrity (10-Step Engine)', cmd: 'node scripts/verify-curriculum.js' },
  { name: 'Automated Curriculum Regression Tests', cmd: 'node --test tests' },
  { name: 'Expo Router SDK Compatibility Tests', cmd: 'node --test tests/expo-router-compatibility.test.js' },
  { name: 'Simulation Contracts & Registry Bindings', cmd: 'node scripts/verify-simulations.js' },
  { name: 'Design System & WCAG Contrast Standards', cmd: 'node scripts/verify-design-system.js' },
  { name: 'Production Release Readiness', cmd: 'node scripts/verify-release-readiness.js 2>&1' },
  { name: 'TypeScript Strict Type Checking', cmd: 'npx tsc --noEmit' },
  { name: 'Code Quality & Lint Integrity (ESLint Expo)', cmd: 'npx expo lint' },
];

let failedSuites = 0;
const results = [];

SUITES.forEach((suite, index) => {
  process.stdout.write(`[${index + 1}/${SUITES.length}] Running ${suite.name}... `);
  try {
    const output = execSync(suite.cmd, { cwd: ROOT_DIR, encoding: 'utf8', stdio: 'pipe' });
    if (suite.name === 'Production Release Readiness') {
      const warningLines = output.split(/\r?\n/).filter((line) => line.includes('⚠️'));
      warningLines.forEach((line) => console.warn(line));
    }
    console.log('✅ PASSED');
    results.push({ name: suite.name, passed: true });
  } catch (error) {
    console.log('❌ FAILED');
    results.push({ name: suite.name, passed: false, error: error.message });
    failedSuites++;
  }
});

console.log('\n📊 === AUDIT EXECUTION SUMMARY ===');
results.forEach((r) => {
  console.log(`  ${r.passed ? '✅' : '❌'} ${r.name}`);
});

console.log('\n' + '='.repeat(40));
if (failedSuites === 0) {
  console.log('🎉 ALL AUTOMATED AUDIT SUITES PASSED. Review release warnings and complete the manual sign-off checklist before shipping.');
  console.log('========================================\n');
  process.exit(0);
} else {
  console.error(`🚨 ${failedSuites} AUDIT SUITE(S) FAILED. Please review above logs.`);
  console.log('========================================\n');
  process.exit(1);
}
