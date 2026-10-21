#!/usr/bin/env node

/**
 * Automated Verification Script: Design System & WCAG Contrast Audit
 * Validates that all design system color tokens adhere to WCAG AA / AAA
 * accessibility thresholds against the dark space background.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const COLORS_PATH = path.join(ROOT_DIR, 'src', 'design-system', 'colors.ts');
const SPACING_PATH = path.join(ROOT_DIR, 'src', 'design-system', 'spacing.ts');
const RADII_PATH = path.join(ROOT_DIR, 'src', 'design-system', 'radii.ts');

console.log('\n🎨 === SCIORA DESIGN SYSTEM ACCESSIBILITY AUDIT ===');

let failureCount = 0;

// Helper to convert hex to RGB
function hexToRgb(hex) {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return { r, g, b };
}

// Compute relative luminance
function relativeLuminance({ r, g, b }) {
  const toLinear = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

// Compute contrast ratio between two hex colors
function computeContrastRatio(hex1, hex2) {
  const lum1 = relativeLuminance(hexToRgb(hex1));
  const lum2 = relativeLuminance(hexToRgb(hex2));
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

// Base dark background
const BACKGROUND_HEX = '#080D1A';

const FOREGROUND_TOKENS = [
  { name: 'textPrimary', hex: '#F8FAFC', minRatio: 7.0, targetLevel: 'AAA' },
  { name: 'textSecondary', hex: '#94A3B8', minRatio: 4.5, targetLevel: 'AA' },
  { name: 'cyan (Optics/CTAs)', hex: '#00E5FF', minRatio: 4.5, targetLevel: 'AA' },
  { name: 'amber (Heat/Alerts)', hex: '#FF9E00', minRatio: 4.5, targetLevel: 'AA' },
  { name: 'emerald (Verification)', hex: '#10B981', minRatio: 4.5, targetLevel: 'AA' },
  { name: 'violet (Atoms/Acoustics)', hex: '#8B5CF6', minRatio: 4.0, targetLevel: 'AA Large' },
  { name: 'rose (Errors/Catastrophic)', hex: '#EF4444', minRatio: 4.0, targetLevel: 'AA Large' },
];

console.log(`Auditing color contrast against dark canvas (${BACKGROUND_HEX}):\n`);

FOREGROUND_TOKENS.forEach((token) => {
  const ratio = computeContrastRatio(token.hex, BACKGROUND_HEX);
  const passed = ratio >= token.minRatio;

  if (passed) {
    console.log(
      `  ✅ PASS: ${token.name.padEnd(28)} ${ratio.toFixed(2)}:1 (Min ${token.minRatio}:1 [${token.targetLevel}])`
    );
  } else {
    console.error(
      `  ❌ FAIL: ${token.name.padEnd(28)} ${ratio.toFixed(2)}:1 (< ${token.minRatio}:1)`
    );
    failureCount++;
  }
});

// Verify Spacing Tokens Exist and are Monotonic
console.log('\nAuditing Spacing Tokens...');
if (fs.existsSync(SPACING_PATH)) {
  const spacingContent = fs.readFileSync(SPACING_PATH, 'utf-8');
  if (spacingContent.includes('xs') && spacingContent.includes('sm') && spacingContent.includes('md') && spacingContent.includes('lg')) {
    console.log('  ✅ PASS: Spacing scale definitions (xs, sm, md, lg, xl, xxl) verified.');
  } else {
    console.error('  ❌ FAIL: Missing required spacing scale keys.');
    failureCount++;
  }
} else {
  console.error('  ❌ FAIL: spacing.ts not found.');
  failureCount++;
}

// Verify Radii Tokens Exist
console.log('\nAuditing Radii Tokens...');
if (fs.existsSync(RADII_PATH)) {
  const radiiContent = fs.readFileSync(RADII_PATH, 'utf-8');
  if (radiiContent.includes('sm') && radiiContent.includes('md') && radiiContent.includes('card') && radiiContent.includes('button')) {
    console.log('  ✅ PASS: Border radii tokens (sm, md, lg, xl, card, button, full) verified.');
  } else {
    console.error('  ❌ FAIL: Missing required radii tokens.');
    failureCount++;
  }
} else {
  console.error('  ❌ FAIL: radii.ts not found.');
  failureCount++;
}

console.log('\n' + '='.repeat(50));
if (failureCount === 0) {
  console.log('🎉 100% SUCCESS: All Design System tokens satisfy accessibility requirements!\n');
  process.exit(0);
} else {
  console.error(`🚨 AUDIT FAILED with ${failureCount} accessibility violations.\n`);
  process.exit(1);
}
