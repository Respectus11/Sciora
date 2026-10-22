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
  { name: 'Simulation Contracts & Registry Bindings', cmd: 'node scripts/verify-simulations.js' },
  { name: 'Design System & WCAG Contrast Standards', cmd: 'node scripts/verify-design-system.js' },
  { name: 'TypeScript Strict Type Checking', cmd: 'npx tsc --noEmit' },
  { name: 'Code Quality & Lint Integrity (ESLint Expo)', cmd: 'npx expo lint' },
];

let failedSuites = 0;
const results = [];

SUITES.forEach((suite, index) => {
  process.stdout.write(`[${index + 1}/${SUITES.length}] Running ${suite.name}... `);
  try {
    execSync(suite.cmd, { cwd: ROOT_DIR, stdio: 'pipe' });
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
  console.log('🎉 ALL AUDIT SUITES PASSED 100%! Ready for production.');
  console.log('========================================\n');
  process.exit(0);
} else {
  console.error(`🚨 ${failedSuites} AUDIT SUITE(S) FAILED. Please review above logs.`);
  console.log('========================================\n');
  process.exit(1);
}
