/**
 * Pure mathematical functions for density, volume displacement, and Archimedes buoyancy.
 */

export const WATER_DENSITY_G_PER_CM3 = 1.0;

/**
 * Calculates mass from density and volume: m = rho * V
 */
export function calculateMass(density: number, volume: number): number {
  return Math.round(density * volume * 10) / 10;
}

/**
 * Calculates density from mass and volume: rho = m / V
 */
export function calculateDensity(mass: number, volume: number): number {
  if (volume <= 0) return 0;
  return Math.round((mass / volume) * 100) / 100;
}

/**
 * Determines whether an object floats in a fluid of specified density.
 */
export function isFloatingInFluid(
  density: number,
  fluidDensity: number = WATER_DENSITY_G_PER_CM3
): boolean {
  return density < fluidDensity;
}

/**
 * Computes fluid volume displaced according to Archimedes' Principle.
 * Floating objects displace a mass of fluid equal to their own mass (V_disp = m / rho_fluid).
 * Sinking objects displace their entire physical volume (V_disp = V).
 */
export function calculateDisplacedVolume(
  density: number,
  volume: number,
  fluidDensity: number = WATER_DENSITY_G_PER_CM3
): number {
  const mass = calculateMass(density, volume);
  if (isFloatingInFluid(density, fluidDensity)) {
    return mass / fluidDensity;
  }
  return volume;
}

/**
 * Calculates buoyant force (in milliNewtons) for displaced fluid volume.
 * F_b = rho * V * g (where g ~ 9.81 m/s^2)
 */
export function calculateBuoyantForce(
  displacedVolumeCm3: number,
  fluidDensityGcm3: number = WATER_DENSITY_G_PER_CM3
): number {
  // 1 cm3 of water has mass 0.001 kg. F_b = 0.001 * V * 9.80665 N
  return displacedVolumeCm3 * fluidDensityGcm3 * 9.81;
}
