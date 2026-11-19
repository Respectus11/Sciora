/**
 * Pure mathematical functions for circuit analysis and Ohm's Law simulations.
 */

export type CircuitWiringMode = 'single' | 'series' | 'parallel';

export const DEFAULT_BULB_RESISTANCE = 10; // Ohms

/**
 * Calculates equivalent resistance (Req) based on wiring configuration and base resistance.
 */
export function calculateEquivalentResistance(
  mode: CircuitWiringMode,
  bulbResistance: number = DEFAULT_BULB_RESISTANCE
): number {
  switch (mode) {
    case 'series':
      return bulbResistance * 2;
    case 'parallel':
      return bulbResistance / 2;
    case 'single':
    default:
      return bulbResistance;
  }
}

/**
 * Calculates electric current (I = V / R) using Ohm's Law.
 * Returns 0 if switch is open (broken circuit).
 */
export function calculateCircuitCurrent(
  voltage: number,
  resistance: number,
  isClosed: boolean = true
): number {
  if (!isClosed || resistance <= 0) return 0;
  return voltage / resistance;
}

/**
 * Calculates total electric power dissipation: P = V * I = I^2 * R
 */
export function calculateElectricPower(voltage: number, current: number): number {
  return Math.max(0, voltage * current);
}

/**
 * Calculates normalized bulb glow opacity (0.0 to 1.0) based on current.
 */
export function calculateBulbGlow(
  current: number,
  mode: CircuitWiringMode,
  isClosed: boolean = true
): number {
  if (!isClosed || current <= 0) return 0;
  const referenceCurrent = mode === 'parallel' ? 0.6 : 0.3;
  const normalized = (current / referenceCurrent) * 0.8;
  return Math.min(1, Math.max(0.2, normalized));
}
