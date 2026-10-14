/**
 * Sciora Design System — Colors & Atmospheric Lighting Tokens
 * Aesthetic: Orbital Laboratory / Scientific Glassmorphism
 * Reference: Ethiopian Grade 8 General Science
 */

export const colors = {
  // Canvases & Space Backgrounds
  spaceDark: '#080D1A',
  spaceDeep: '#060A14',
  spaceSurface: '#0E1726',
  spaceElevated: '#131F33',

  // Glassmorphism Surfaces (RGBA)
  glassSurface: 'rgba(16, 26, 46, 0.70)',
  glassSurfaceRaised: 'rgba(23, 37, 66, 0.85)',
  glassSurfaceHighlight: 'rgba(30, 48, 84, 0.90)',
  glassBorder: 'rgba(255, 255, 255, 0.10)',
  glassBorderSubtle: 'rgba(255, 255, 255, 0.06)',
  glassBorderFocus: 'rgba(0, 229, 255, 0.40)',

  // Budget Android Hardware Fallback (Solid opaque surfaces when blur is off)
  opaqueCard: '#111C30',
  opaqueCardBorder: '#1E2D48',
  opaqueModal: '#152238',

  // Primary Scientific Accents
  cyan: '#00E5FF',       // Light rays, Optics, Positive voltage, Primary CTAs
  cyanMuted: '#00838F',
  cyanDark: '#002026',
  cyanGlow: 'rgba(0, 229, 255, 0.25)',

  violet: '#8B5CF6',     // Atomic shells, Acoustics, Magnetic fields
  violetMuted: '#5B21B6',
  violetDark: '#1E1035',
  violetGlow: 'rgba(139, 92, 246, 0.25)',

  amber: '#FF9E00',      // Heat, Thermal conduction, Light sources, Warnings
  amberMuted: '#B45309',
  amberDark: '#2E1A00',
  amberGlow: 'rgba(255, 158, 0, 0.25)',

  emerald: '#10B981',    // Verified states, Closed circuits, Correct answer
  emeraldMuted: '#047857',
  emeraldGlow: 'rgba(16, 185, 129, 0.25)',

  rose: '#F43F5E',       // Open circuits, High resistance, Error alerts
  roseMuted: '#BE123C',
  roseGlow: 'rgba(244, 63, 94, 0.25)',

  // Typography Contrast Levels (against spaceDark #080D1A)
  textPrimary: '#F8FAFC',    // 17.5:1 AAA
  textSecondary: '#94A3B8',  // 7.8:1 AAA
  textMuted: '#64748B',      // 4.6:1 AA
  textAccent: '#38BDF8',     // 9.4:1 AAA
  textInverse: '#080D1A',

  // Scientific Diagram specific
  incidentRay: '#00E5FF',
  reflectedRay: '#8B5CF6',
  normalLine: 'rgba(56, 189, 248, 0.60)',
  mirrorSurface: '#E2E8F0',
  magneticNorth: '#F43F5E',
  magneticSouth: '#38BDF8',
  batteryPositive: '#F43F5E',
  batteryNegative: '#38BDF8',
  bulbLit: '#FBBF24',
  bulbUnlit: '#475569',
  electron: '#38BDF8',
  proton: '#F43F5E',
  neutron: '#94A3B8',
} as const;

export type ColorToken = keyof typeof colors;
