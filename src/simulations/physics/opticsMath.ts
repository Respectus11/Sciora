/**
 * Pure mathematical functions for geometric optics and refraction simulations.
 */

export const SPEED_OF_LIGHT = 299792458; // m/s

/**
 * Computes the angle of refraction using Snell's Law: n1 * sin(theta1) = n2 * sin(theta2)
 *
 * @param theta1Deg Angle of incidence in degrees
 * @param n1 Refractive index of medium 1
 * @param n2 Refractive index of medium 2
 * @returns Object with angle in degrees, radians, and whether total internal reflection occurred
 */
export function calculateSnellsLaw(
  theta1Deg: number,
  n1: number = 1.0,
  n2: number = 1.5
): {
  theta2Deg: number;
  theta2Rad: number;
  totalInternalReflection: boolean;
  sinTheta2: number;
} {
  const theta1Rad = (theta1Deg * Math.PI) / 180;
  const sinTheta2 = (n1 * Math.sin(theta1Rad)) / n2;

  if (sinTheta2 > 1.0) {
    return {
      theta2Deg: 90,
      theta2Rad: Math.PI / 2,
      totalInternalReflection: true,
      sinTheta2,
    };
  }

  const theta2Rad = Math.asin(Math.min(1, Math.max(-1, sinTheta2)));
  const theta2Deg = (theta2Rad * 180) / Math.PI;

  return {
    theta2Deg,
    theta2Rad,
    totalInternalReflection: false,
    sinTheta2,
  };
}

/**
 * Calculates the critical angle in degrees for total internal reflection between two media.
 * Critical angle is only defined when n1 > n2.
 */
export function calculateCriticalAngle(n1: number, n2: number = 1.0): number | null {
  if (n1 <= n2) return null;
  const rad = Math.asin(n2 / n1);
  return (rad * 180) / Math.PI;
}

/**
 * Calculates speed of light inside a transparent optical medium.
 */
export function calculateSpeedInMedium(n: number): number {
  if (n <= 0) return SPEED_OF_LIGHT;
  return SPEED_OF_LIGHT / n;
}

/**
 * Computes ray deflection or deviation angle: delta = |theta1 - theta2|
 */
export function calculateDeviationAngle(theta1Deg: number, theta2Deg: number): number {
  return Math.abs(theta1Deg - theta2Deg);
}
