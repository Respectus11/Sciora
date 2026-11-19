/**
 * Pure mathematical functions for atomic structure, Bohr electron shells, and isotopes.
 */

export interface BohrShellConfiguration {
  shell1: number;
  shell2: number;
  shell3: number;
  valenceElectrons: number;
  configString: string;
}

/**
 * Calculates atomic mass number (A = Z + N): total nucleons in the nucleus.
 */
export function calculateMassNumber(protons: number, neutrons: number): number {
  return Math.max(0, protons) + Math.max(0, neutrons);
}

/**
 * Calculates net electrical charge (q = Z - e).
 */
export function calculateNetCharge(protons: number, electrons: number): number {
  return protons - electrons;
}

/**
 * Calculates Bohr electron distribution across the first three energy shells:
 * Shell K (max 2), Shell L (max 8), Shell M (max 8).
 */
export function calculateBohrConfiguration(electrons: number): BohrShellConfiguration {
  const e = Math.max(0, electrons);
  const shell1 = Math.min(2, e);
  const remAfterS1 = Math.max(0, e - 2);
  const shell2 = Math.min(8, remAfterS1);
  const remAfterS2 = Math.max(0, remAfterS1 - 8);
  const shell3 = Math.min(8, remAfterS2);

  const valenceElectrons = shell3 > 0 ? shell3 : shell2 > 0 ? shell2 : shell1;
  const configString =
    shell3 > 0
      ? `${shell1}, ${shell2}, ${shell3}`
      : shell2 > 0
      ? `${shell1}, ${shell2}`
      : `${shell1}`;

  return {
    shell1,
    shell2,
    shell3,
    valenceElectrons,
    configString,
  };
}

/**
 * Classifies an atom's ionic charge state.
 */
export function getIonState(netCharge: number): 'neutral' | 'cation' | 'anion' {
  if (netCharge > 0) return 'cation';
  if (netCharge < 0) return 'anion';
  return 'neutral';
}
