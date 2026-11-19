/**
 * Pure mathematical functions for orbital mechanics and Kepler's Laws in planetary simulations.
 */

export const AU_TO_KM = 149597870.7; // Kilometers per Astronomical Unit
export const EARTH_ORBITAL_VELOCITY_KMS = 29.78; // km/s

/**
 * Calculates Kepler's Third Law ratio: T^2 / a^3
 * In our solar system with T in Earth years and a in AU, this ratio equals ~1.00.
 */
export function calculateKeplerRatio(periodYears: number, semiMajorAxisAU: number): number {
  if (semiMajorAxisAU <= 0) return 0;
  const a3 = Math.pow(semiMajorAxisAU, 3);
  const t2 = Math.pow(periodYears, 2);
  return t2 / a3;
}

/**
 * Estimates orbital period in Earth years from semi-major axis using Kepler's 3rd Law: T = a^(3/2)
 */
export function estimateOrbitalPeriodYears(semiMajorAxisAU: number): number {
  if (semiMajorAxisAU <= 0) return 0;
  return Math.pow(semiMajorAxisAU, 1.5);
}

/**
 * Estimates mean circular orbital velocity in km/s: v = v_earth / sqrt(a)
 */
export function estimateOrbitalVelocityKmS(semiMajorAxisAU: number): number {
  if (semiMajorAxisAU <= 0) return 0;
  return EARTH_ORBITAL_VELOCITY_KMS / Math.sqrt(semiMajorAxisAU);
}

/**
 * Determines whether an orbital radius lies within the Sun's circumstellar habitable zone
 * (approximately 0.95 AU to 1.37 AU for a G-type main sequence star like our Sun).
 */
export function isInHabitableZone(semiMajorAxisAU: number): boolean {
  return semiMajorAxisAU >= 0.95 && semiMajorAxisAU <= 1.37;
}
