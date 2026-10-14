/**
 * Sciora Design System — Spacing Tokens
 * 4px / 8px Grid System
 */

export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  screenPadding: 16,
  cardPadding: 16,
  minTouchTarget: 48, // Accessibility minimum touch target
} as const;

export type SpacingToken = keyof typeof spacing;
