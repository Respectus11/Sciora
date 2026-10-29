import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, {
  Circle,
  Text as SvgText,
  G,
  Defs,
  RadialGradient,
  Stop,
} from 'react-native-svg';
import { SimulationWorkspace } from '@/components/simulation/SimulationWorkspace';
import { GlassCard } from '@/components/ui/GlassCard';
import { colors, spacing, typography, radii } from '@/design-system';

interface PlanetData {
  id: string;
  name: string;
  distAU: number;
  period: string;
  periodYears: number;
  velocityKmS: number;
  type: 'Terrestrial' | 'Gas Giant' | 'Ice Giant';
  temp: string;
  moons: number;
  color: string;
  radiusSvg: number;
  orbitRadiusSvg: number;
  atmosphere: string;
}

const PLANETS: PlanetData[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    distAU: 0.39,
    period: '88 days',
    periodYears: 0.24,
    velocityKmS: 47.9,
    type: 'Terrestrial',
    temp: '167°C',
    moons: 0,
    color: '#94A3B8',
    radiusSvg: 3,
    orbitRadiusSvg: 26,
    atmosphere: 'Virtually none (exosphere)',
  },
  {
    id: 'venus',
    name: 'Venus',
    distAU: 0.72,
    period: '225 days',
    periodYears: 0.62,
    velocityKmS: 35.0,
    type: 'Terrestrial',
    temp: '464°C',
    moons: 0,
    color: '#F59E0B',
    radiusSvg: 5,
    orbitRadiusSvg: 42,
    atmosphere: 'Dense CO₂ (96.5%), H₂SO₄ clouds',
  },
  {
    id: 'earth',
    name: 'Earth',
    distAU: 1.00,
    period: '365.25 days',
    periodYears: 1.00,
    velocityKmS: 29.8,
    type: 'Terrestrial',
    temp: '15°C',
    moons: 1,
    color: '#0284C7',
    radiusSvg: 5,
    orbitRadiusSvg: 60,
    atmosphere: 'N₂ (78%), O₂ (21%), H₂O (1%)',
  },
  {
    id: 'mars',
    name: 'Mars',
    distAU: 1.52,
    period: '687 days',
    periodYears: 1.88,
    velocityKmS: 24.1,
    type: 'Terrestrial',
    temp: '-65°C',
    moons: 2,
    color: '#EF4444',
    radiusSvg: 4,
    orbitRadiusSvg: 78,
    atmosphere: 'Thin CO₂ (95%), N₂ (2.6%)',
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    distAU: 5.20,
    period: '11.86 yrs',
    periodYears: 11.86,
    velocityKmS: 13.1,
    type: 'Gas Giant',
    temp: '-110°C',
    moons: 79,
    color: '#D97706',
    radiusSvg: 9,
    orbitRadiusSvg: 100,
    atmosphere: 'H₂ (90%), He (10%), methane traces',
  },
  {
    id: 'saturn',
    name: 'Saturn',
    distAU: 9.58,
    period: '29.45 yrs',
    periodYears: 29.45,
    velocityKmS: 9.7,
    type: 'Gas Giant',
    temp: '-140°C',
    moons: 82,
    color: '#FBBF24',
    radiusSvg: 8,
    orbitRadiusSvg: 118,
    atmosphere: 'H₂ (96%), He (3%), icy rings',
  },
  {
    id: 'uranus',
    name: 'Uranus',
    distAU: 19.22,
    period: '84.01 yrs',
    periodYears: 84.01,
    velocityKmS: 6.8,
    type: 'Ice Giant',
    temp: '-195°C',
    moons: 27,
    color: '#22D3EE',
    radiusSvg: 6,
    orbitRadiusSvg: 134,
    atmosphere: 'H₂, He, Methane ice mantles',
  },
  {
    id: 'neptune',
    name: 'Neptune',
    distAU: 30.05,
    period: '164.8 yrs',
    periodYears: 164.8,
    velocityKmS: 5.4,
    type: 'Ice Giant',
    temp: '-200°C',
    moons: 14,
    color: '#3B82F6',
    radiusSvg: 6,
    orbitRadiusSvg: 148,
    atmosphere: 'H₂, He, Super-sonic winds & methane',
  },
];

export const SolarSystemSimulation: React.FC = () => {
  const [selectedPlanetId, setSelectedPlanetId] = useState<string>('earth');
  const [filterGroup, setFilterGroup] = useState<'all' | 'terrestrial' | 'jovian'>('all');
  const [showHabitableZone, setShowHabitableZone] = useState<boolean>(true);

  const selectedPlanet = PLANETS.find((p) => p.id === selectedPlanetId) || PLANETS[2];

  // Filtered planet list
  const filteredPlanets = PLANETS.filter((p) => {
    if (filterGroup === 'terrestrial') return p.type === 'Terrestrial';
    if (filterGroup === 'jovian') return p.type === 'Gas Giant' || p.type === 'Ice Giant';
    return true;
  });

  // Kepler's Third Law Verification (T^2 / a^3 should equal ~1.00)
  const a3 = Math.pow(selectedPlanet.distAU, 3);
  const t2 = Math.pow(selectedPlanet.periodYears, 2);
  const keplerRatio = t2 / a3;

  const svgWidth = 360;
  const svgHeight = 310;
  const originX = svgWidth / 2;
  const originY = svgHeight / 2 - 10;

  return (
    <SimulationWorkspace
      title="Planetary Dynamics & Keplerian Solar System Lab"
      unitTag="Grade 8 Science • Unit 6.1"
      onReset={() => {
        setSelectedPlanetId('earth');
        setFilterGroup('all');
        setShowHabitableZone(true);
      }}
      telemetry={[
        { label: 'Planet', value: selectedPlanet.name, color: selectedPlanet.color },
        { label: 'Classification', value: selectedPlanet.type, color: colors.cyan },
        { label: 'Orbital Speed', value: `${selectedPlanet.velocityKmS} km/s`, color: colors.emerald },
        { label: 'Semi-major Axis', value: `${selectedPlanet.distAU} AU`, color: colors.amber },
        { label: 'Period (T)', value: selectedPlanet.period, color: colors.violet },
        { label: "Kepler's Law (T²/a³)", value: `${keplerRatio.toFixed(2)} (Constant)`, color: colors.emerald },
      ]}
      instructions={[
        'Tap any planet chip to examine orbital parameters and atmospheric composition.',
        'Observe how orbital speed drops from Mercury (47.9 km/s) to Neptune (5.4 km/s), verifying Keplerian 2nd & 3rd orbital laws.',
        'Toggle "Habitable Zone" to see the circumstellar Goldilocks corridor where liquid water can stably exist.',
        'Contrast inner rocky Terrestrial planets with outer Jovian Gas and Ice Giants.',
      ]}
      controlsNode={
        <GlassCard variant="base" padding="md" style={styles.controlsCard}>
          {/* Planet Group Filter Buttons */}
          <View style={styles.filterRow}>
            <Pressable
              style={[styles.filterBtn, filterGroup === 'all' && styles.filterBtnActive]}
              onPress={() => setFilterGroup('all')}
            >
              <Text style={[styles.filterBtnText, filterGroup === 'all' && styles.filterBtnTextActive]}>
                All 8 Worlds
              </Text>
            </Pressable>
            <Pressable
              style={[styles.filterBtn, filterGroup === 'terrestrial' && styles.filterBtnActive]}
              onPress={() => setFilterGroup('terrestrial')}
            >
              <Text style={[styles.filterBtnText, filterGroup === 'terrestrial' && styles.filterBtnTextActive]}>
                Terrestrial (Inner)
              </Text>
            </Pressable>
            <Pressable
              style={[styles.filterBtn, filterGroup === 'jovian' && styles.filterBtnActive]}
              onPress={() => setFilterGroup('jovian')}
            >
              <Text style={[styles.filterBtnText, filterGroup === 'jovian' && styles.filterBtnTextActive]}>
                Jovian (Outer)
              </Text>
            </Pressable>
          </View>

          {/* Planet Chips */}
          <View style={styles.btnRow}>
            {filteredPlanets.map((planet) => {
              const isSelected = selectedPlanetId === planet.id;
              return (
                <Pressable
                  key={planet.id}
                  style={[
                    styles.chip,
                    isSelected && styles.chipActive,
                    isSelected && { borderColor: planet.color },
                  ]}
                  onPress={() => setSelectedPlanetId(planet.id)}
                >
                  <View style={[styles.planetDot, { backgroundColor: planet.color }]} />
                  <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                    {planet.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Habitable Zone & Atmosphere Card */}
          <View style={styles.detailsCard}>
            <View style={styles.detailsTopRow}>
              <Text style={styles.detailsTitle}>
                {selectedPlanet.name} ({selectedPlanet.type})
              </Text>
              <Pressable
                style={[styles.hzToggle, showHabitableZone && styles.hzToggleActive]}
                onPress={() => setShowHabitableZone((prev) => !prev)}
              >
                <Text style={[styles.hzToggleText, showHabitableZone && styles.hzToggleTextActive]}>
                  {showHabitableZone ? 'Hide Goldilocks Zone' : 'Show Goldilocks Zone'}
                </Text>
              </Pressable>
            </View>
            <Text style={styles.detailsAtmosphere}>
              Atmosphere: {selectedPlanet.atmosphere}
            </Text>
            <Text style={styles.detailsTemp}>
              Surface Temp: {selectedPlanet.temp} • Moons: {selectedPlanet.moons}
            </Text>
          </View>
        </GlassCard>
      }
    >
      {() => (
        <Svg width="100%" height="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
          <Defs>
            <RadialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#FEF08A" stopOpacity="1" />
              <Stop offset="40%" stopColor="#F59E0B" stopOpacity="0.8" />
              <Stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
            </RadialGradient>
          </Defs>

          {/* Habitable Goldilocks Zone (Around 1.0 AU / 60px SVG) */}
          {showHabitableZone && (
            <G id="habitable-zone" opacity="0.35">
              <Circle
                cx={originX}
                cy={originY}
                r="60"
                fill="none"
                stroke="#10B981"
                strokeWidth="14"
              />
              <SvgText x={originX} y={originY + 74} fill="#10B981" fontSize="8" fontWeight="bold" textAnchor="middle">
                Circumstellar Habitable Zone (Liquid H₂O)
              </SvgText>
            </G>
          )}

          {/* Central Sun */}
          <Circle cx={originX} cy={originY} r="20" fill="url(#sunGlow)" />
          <Circle cx={originX} cy={originY} r="12" fill="#FEF08A" />
          <SvgText x={originX} y={originY + 3} fill="#78350F" fontSize="8" fontWeight="bold" textAnchor="middle">
            SUN
          </SvgText>

          {/* Planetary Orbital Tracks & Worlds */}
          {PLANETS.map((p, idx) => {
            const isSelected = selectedPlanetId === p.id;
            // Angle spread for clear planetary layout
            const angle = idx * 0.8 + 0.4;
            const px = originX + p.orbitRadiusSvg * Math.cos(angle);
            const py = originY + p.orbitRadiusSvg * Math.sin(angle);

            return (
              <G key={p.id}>
                {/* Orbital Ring */}
                <Circle
                  cx={originX}
                  cy={originY}
                  r={p.orbitRadiusSvg}
                  fill="none"
                  stroke={isSelected ? p.color : 'rgba(255, 255, 255, 0.12)'}
                  strokeWidth={isSelected ? 1.5 : 0.8}
                  strokeDasharray={isSelected ? undefined : '2,3'}
                />

                {/* Planet Body */}
                <Circle
                  cx={px}
                  cy={py}
                  r={p.radiusSvg}
                  fill={p.color}
                  stroke={isSelected ? '#FFFFFF' : 'transparent'}
                  strokeWidth={1.5}
                />

                {/* Planet Name Tag */}
                <SvgText
                  x={px}
                  y={py - p.radiusSvg - 4}
                  fill={isSelected ? '#FFFFFF' : colors.textMuted}
                  fontSize={isSelected ? 9 : 7}
                  fontWeight={isSelected ? 'bold' : 'normal'}
                  textAnchor="middle"
                >
                  {p.name}
                </SvgText>
              </G>
            );
          })}
        </Svg>
      )}
    </SimulationWorkspace>
  );
};

const styles = StyleSheet.create({
  controlsCard: {
    gap: spacing.sm,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 6,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: radii.button,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: colors.glassBorderSubtle,
    alignItems: 'center',
  },
  filterBtnActive: {
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    borderColor: colors.cyan,
  },
  filterBtnText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 10,
  },
  filterBtnTextActive: {
    color: colors.cyan,
    fontWeight: '700',
  },
  btnRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: radii.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: colors.glassBorderSubtle,
    gap: 5,
  },
  chipActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  planetDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  chipText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  detailsCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: radii.sm,
    padding: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.amber,
  },
  detailsTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailsTitle: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.amber,
    fontSize: 12,
  },
  hzToggle: {
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: radii.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  hzToggleActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  hzToggleText: {
    ...typography.caption,
    fontSize: 9,
    color: colors.textSecondary,
  },
  hzToggleTextActive: {
    color: colors.emerald,
    fontWeight: '700',
  },
  detailsAtmosphere: {
    ...typography.caption,
    color: colors.textPrimary,
    fontSize: 11,
    marginBottom: 2,
  },
  detailsTemp: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 10,
  },
});
