/**
 * Sciora Design System — Elevation & Ambient Glow Tokens
 */

import { ViewStyle } from 'react-native';
import { colors } from './colors';

export const elevation = {
  glassBase: {
    backgroundColor: colors.glassSurface,
    borderColor: colors.glassBorder,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  } as ViewStyle,

  glassRaised: {
    backgroundColor: colors.glassSurfaceRaised,
    borderColor: colors.glassBorder,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  } as ViewStyle,

  glowCyan: {
    shadowColor: colors.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 6,
  } as ViewStyle,

  glowViolet: {
    shadowColor: colors.violet,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.40,
    shadowRadius: 12,
    elevation: 6,
  } as ViewStyle,

  // Budget Android Opaque Fallback
  opaqueFallback: {
    backgroundColor: colors.opaqueCard,
    borderColor: colors.opaqueCardBorder,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  } as ViewStyle,
} as const;
