/**
 * Sciora Design System — Corner Radii Tokens
 */

export const radii = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  card: 16,
  chip: 20,
  button: 24,
  full: 9999,
} as const;

export type RadiiToken = keyof typeof radii;
