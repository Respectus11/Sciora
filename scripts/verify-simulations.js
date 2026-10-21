#!/usr/bin/env node

/**
 * Automated Verification Script: Simulation Registry & Contract Audit
 * Validates that all curriculum simulations exist, export valid components,
 * and implement standard telemetry and instructional contracts.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const REGISTRY_PATH = path.join(ROOT_DIR, 'src', 'simulations', 'registry.ts');

console.log('\n🧪 === SCIORA SIMULATION CONTRACT AUDIT ===');

let failureCount = 0;

if (!fs.existsSync(REGISTRY_PATH)) {
  console.error('❌ Registry file not found:', REGISTRY_PATH);
  process.exit(1);
}

const registryContent = fs.readFileSync(REGISTRY_PATH, 'utf-8');

const SIMULATIONS = [
  {
    id: 'sim-1-density',
    name: 'Density & Water Displacement Lab',
    file: 'src/simulations/investigation/DensityMeasurementSimulation.tsx',
    unit: 'Unit 1.1',
  },
  {
    id: 'sim-7-1-reflection',
    name: 'Light Reflection & Plane Mirror Lab',
    file: 'src/simulations/physics/LightReflectionSimulation.tsx',
    unit: 'Unit 7.1A',
  },
  {
    id: 'sim-7-1-refraction',
    name: 'Light Refraction & Snell Law Lab',
    file: 'src/simulations/physics/LightRefractionSimulation.tsx',
    unit: 'Unit 7.1B',
  },
  {
    id: 'sim-7-3-sound',
    name: 'Sound Wave Propagation & Bell Jar Lab',
    file: 'src/simulations/physics/SoundWaveSimulation.tsx',
    unit: 'Unit 7.3',
  },
  {
    id: 'sim-7-4-heat',
    name: 'Thermal Conduction & Molecular Kinetics',
    file: 'src/simulations/physics/ThermalConductionSimulation.tsx',
    unit: 'Unit 7.4',
  },
  {
    id: 'sim-7-5-circuit',
    name: 'DC Circuit Builder & Ohm Law Lab',
    file: 'src/simulations/physics/CircuitBuilderSimulation.tsx',
    unit: 'Unit 7.5',
  },
  {
    id: 'sim-7-6-magnetism',
    name: 'Bar Magnet & Magnetic Susceptibility',
    file: 'src/simulations/physics/MagnetismSimulation.tsx',
    unit: 'Unit 7.6',
  },
  {
    id: 'sim-2-atom',
    name: 'Subatomic Particle & Bohr Shell Lab',
    file: 'src/simulations/chemistry/AtomBuilderSimulation.tsx',
    unit: 'Unit 2.1',
  },
  {
    id: 'sim-6-solar',
    name: 'Keplerian Planetary Dynamics Lab',
    file: 'src/simulations/astronomy/SolarSystemSimulation.tsx',
    unit: 'Unit 6.1',
  },
];

console.log(`Checking ${SIMULATIONS.length} registered simulation components...\n`);

SIMULATIONS.forEach((sim, idx) => {
  const filePath = path.join(ROOT_DIR, sim.file);
  const exists = fs.existsSync(filePath);

  if (!exists) {
    console.error(`  [${idx + 1}/${SIMULATIONS.length}] ❌ MISSING FILE: ${sim.file}`);
    failureCount++;
    return;
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');

  // Verify Contract Requirements
  const usesSimulationWorkspace = fileContent.includes('SimulationWorkspace');
  const hasTelemetry = fileContent.includes('telemetry=');
  const hasInstructions = fileContent.includes('instructions=');
  const hasSvg = fileContent.includes('react-native-svg');

  if (!usesSimulationWorkspace) {
    console.error(`  [${idx + 1}/${SIMULATIONS.length}] ❌ Missing SimulationWorkspace wrapper in ${sim.file}`);
    failureCount++;
    return;
  }

  if (!hasTelemetry || !hasInstructions) {
    console.error(`  [${idx + 1}/${SIMULATIONS.length}] ❌ Incomplete telemetry or instructions contract in ${sim.file}`);
    failureCount++;
    return;
  }

  if (!hasSvg) {
    console.warn(`  [${idx + 1}/${SIMULATIONS.length}] ⚠️ No SVG rendering detected in ${sim.file}`);
  }

  // Registry linkage check
  const inRegistry = registryContent.includes(sim.id);
  if (!inRegistry) {
    console.error(`  [${idx + 1}/${SIMULATIONS.length}] ❌ Simulation id '${sim.id}' not declared in registry.ts`);
    failureCount++;
    return;
  }

  console.log(`  [${idx + 1}/${SIMULATIONS.length}] ✅ PASS: ${sim.id} (${sim.unit}) • ${sim.name}`);
});

console.log('\n' + '='.repeat(50));
if (failureCount === 0) {
  console.log('🎉 100% SUCCESS: All 9 simulations pass contract and registry checks!\n');
  process.exit(0);
} else {
  console.error(`🚨 AUDIT FAILED with ${failureCount} contract violations.\n`);
  process.exit(1);
}
