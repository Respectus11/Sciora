import React from 'react';
import { DensityMeasurementSimulation } from './investigation/DensityMeasurementSimulation';
import { LightReflectionSimulation } from './physics/LightReflectionSimulation';
import { LightRefractionSimulation } from './physics/LightRefractionSimulation';
import { SoundWaveSimulation } from './physics/SoundWaveSimulation';
import { ThermalConductionSimulation } from './physics/ThermalConductionSimulation';
import { CircuitBuilderSimulation } from './physics/CircuitBuilderSimulation';
import { MagnetismSimulation } from './physics/MagnetismSimulation';
import { AtomBuilderSimulation } from './chemistry/AtomBuilderSimulation';
import { SolarSystemSimulation } from './astronomy/SolarSystemSimulation';

export interface SimulationRegistration {
  id: string;
  title: string;
  unitId: string;
  unitLabel: string;
  component: React.ComponentType;
}

const simulationsRegistry: Record<string, SimulationRegistration> = {
  'sim-1-density': {
    id: 'sim-1-density',
    title: 'Water Displacement & Density Balance',
    unitId: 'unit-01',
    unitLabel: 'Unit 1.1',
    component: DensityMeasurementSimulation,
  },
  'sim-7-1-reflection': {
    id: 'sim-7-1-reflection',
    title: 'Law of Reflection & Plane Mirrors',
    unitId: 'unit-07',
    unitLabel: 'Unit 7.1A',
    component: LightReflectionSimulation,
  },
  'sim-7-1-refraction': {
    id: 'sim-7-1-refraction',
    title: 'Light Refraction & Prism Dispersion',
    unitId: 'unit-07',
    unitLabel: 'Unit 7.1B',
    component: LightRefractionSimulation,
  },
  'sim-7-3-sound': {
    id: 'sim-7-3-sound',
    title: 'Sound Vibration & Acoustic Waves',
    unitId: 'unit-07',
    unitLabel: 'Unit 7.3',
    component: SoundWaveSimulation,
  },
  'sim-7-4-heat': {
    id: 'sim-7-4-heat',
    title: 'Thermal Conduction & Insulation',
    unitId: 'unit-07',
    unitLabel: 'Unit 7.4',
    component: ThermalConductionSimulation,
  },
  'sim-7-5-circuit': {
    id: 'sim-7-5-circuit',
    title: 'Electric Circuit Builder',
    unitId: 'unit-07',
    unitLabel: 'Unit 7.5',
    component: CircuitBuilderSimulation,
  },
  'sim-7-6-magnetism': {
    id: 'sim-7-6-magnetism',
    title: 'Bar Magnet & Magnetic Field Lines',
    unitId: 'unit-07',
    unitLabel: 'Unit 7.6',
    component: MagnetismSimulation,
  },
  'sim-2-atom': {
    id: 'sim-2-atom',
    title: 'Atom Structure & Subatomic Particles',
    unitId: 'unit-02',
    unitLabel: 'Unit 2.1',
    component: AtomBuilderSimulation,
  },
  'sim-6-solar': {
    id: 'sim-6-solar',
    title: 'The Solar System & Planetary Dynamics',
    unitId: 'unit-06',
    unitLabel: 'Unit 6.1',
    component: SolarSystemSimulation,
  },
};

export const getSimulationById = (id: string): SimulationRegistration | undefined => {
  return simulationsRegistry[id];
};

export const getAllSimulations = (): SimulationRegistration[] => {
  return Object.values(simulationsRegistry);
};
