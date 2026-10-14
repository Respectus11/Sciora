/**
 * Sciora Design System — Typography Scale & Font Tokens
 */

import { TextStyle } from 'react-native';

export const typography = {
  // Display styles
  displayHero: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
    letterSpacing: -0.5,
  } as TextStyle,

  heading1: {
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 28,
    letterSpacing: -0.3,
  } as TextStyle,

  heading2: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: -0.2,
  } as TextStyle,

  heading3: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  } as TextStyle,

  // Body styles
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  } as TextStyle,

  bodyMedium: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
  } as TextStyle,

  bodySmall: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
  } as TextStyle,

  // Captions & Microcopy
  caption: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  } as TextStyle,

  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 14,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  } as TextStyle,

  // Scientific Monospace Data & Formulas
  scientificMono: {
    fontSize: 14,
    fontFamily: 'monospace',
    fontWeight: '500',
    lineHeight: 20,
    letterSpacing: 0.2,
  } as TextStyle,

  scientificMonoSmall: {
    fontSize: 12,
    fontFamily: 'monospace',
    fontWeight: '500',
    lineHeight: 16,
  } as TextStyle,
} as const;

export type TypographyStyle = keyof typeof typography;
