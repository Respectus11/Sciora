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
  name: string;
  distAU: number;
  period: string;
  type: 'Terrestrial' | 'Gas Giant' | 'Ice Giant';
  temp: string;
  moons: number;
  color: string;
  radiusSvg: number;
  orbitRadiusSvg: number;
}

const PLANETS: PlanetData[] = [
  { name: 'Mercury', distAU: 0.39, period: '88 days', type: 'Terrestrial', temp: '167°C', moons: 0, color: '#94A3B8', radiusSvg: 3, orbitRadiusSvg: 30 },
  { name: 'Venus', distAU: 0.72, period: '225 days', type: 'Terrestrial', temp: '464°C', moons: 0, color: '#F59E0B', radiusSvg: 5, orbitRadiusSvg: 48 },
  { name: 'Earth', distAU: 1.00, period: '365.25 days', type: 'Terrestrial', temp: '15°C', moons: 1, color: '#0284C7', radiusSvg: 5, orbitRadiusSvg: 68 },
  { name: 'Mars', distAU: 1.52, period: '687 days', type: 'Terrestrial', temp: '-65°C', moons: 2, color: '#EF4444', radiusSvg: 4, orbitRadiusSvg: 88 },
  { name: 'Jupiter', distAU: 5.20, period: '11.86 years', type: 'Gas Giant', temp: '-110°C', moons: 79, color: '#D97706', radiusSvg: 9, orbitRadiusSvg: 110 },
  { name: 'Saturn', distAU: 9.58, period: '29.45 years', type: 'Gas Giant', temp: '-140°C', moons: 82, color: '#FBBF24', radiusSvg: 8, orbitRadiusSvg: 130 },
];

export const SolarSystemSimulation: React.FC = () => {
  const [selectedPlanetName, setSelectedPlanetName] = useState<string>('Earth');

  const selectedPlanet = PLANETS.find((p) => p.name === selectedPlanetName) || PLANETS[2];

  const svgWidth = 340;
  const svgHeight = 280;
  const originX = svgWidth / 2;
  const originY = svgHeight / 2;

  return (
    <SimulationWorkspace
      title="Planetary Dynamics & Solar System Lab"
      unitTag="Grade 8 Science • Unit 6.1"
      telemetry={[
        { label: 'Selected Planet', value: selectedPlanet.name, color: colors.amber },
        { label: 'Orbital Period', value: selectedPlanet.period, color: colors.cyan },
        { label: 'Distance from Sun', value: `${selectedPlanet.distAU}`, unit: 'AU', color: colors.violet },
        { label: 'Mean Surface Temp', value: selectedPlanet.temp, color: colors.rose },
      ]}
      instructions={[
        'Tap any planetary orbit or selection chip to view its astronomical properties.',
        'Compare Terrestrial rocky worlds (Mercury, Venus, Earth, Mars) with Gas Giants (Jupiter, Saturn).',
        'Observe how inner planets travel around the Sun much faster than outer planets, obeying Keplerian gravitation.',
        'Notice that Venus has a higher surface temperature than Mercury due to runaway CO₂ greenhouse trapping.',
      ]}
      controlsNode={
        <GlassCard variant="base" padding="md" style={styles.controlsCard}>
          <Text style={styles.controlHeader}>Select Planet to Inspect:</Text>
          <View style={styles.btnRow}>
            {PLANETS.map((planet) => {
              const isSelected = selectedPlanetName === planet.name;
              return (
                <Pressable
                  key={planet.name}
                  style={[styles.chip, isSelected ? styles.chipActive : undefined]}
                  onPress={() => setSelectedPlanetName(planet.name)}
                >
                  <Text style={[styles.chipText, isSelected ? styles.chipTextActive : undefined]}>
                    {planet.name}
                  </Text>
                </Pressable>
              );
            })}
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

          {/* Central Sun */}
          <Circle cx={originX} cy={originY} r="20" fill="url(#sunGlow)" />
          <Circle cx={originX} cy={originY} r="12" fill="#FEF08A" />
          <SvgText x={originX} y={originY + 3} fill="#78350F" fontSize="8" fontWeight="bold" textAnchor="middle">
            SUN
          </SvgText>

          {/* Planetary Orbital Tracks & Planets */}
          {PLANETS.map((p, idx) => {
            const isSelected = selectedPlanetName === p.name;
            // Angle spread for aesthetic visual clarity
            const angle = (idx * 1.1) + 0.5;
            const px = originX + p.orbitRadiusSvg * Math.cos(angle);
            const py = originY + p.orbitRadiusSvg * Math.sin(angle);

            return (
              <G key={p.name}>
                {/* Orbital Ring */}
                <Circle
                  cx={originX}
                  cy={originY}
                  r={p.orbitRadiusSvg}
                  fill="none"
                  stroke={isSelected ? colors.cyan : 'rgba(255, 255, 255, 0.15)'}
                  strokeWidth={isSelected ? 1.5 : 1}
                  strokeDasharray={isSelected ? undefined : '3,3'}
                />

                {/* Planet Body */}
                <Circle
                  cx={px}
                  cy={py}
                  r={isSelected ? p.radiusSvg + 3 : p.radiusSvg}
                  fill={p.color}
                />

                {/* Selection halo */}
                {isSelected && (
                  <Circle
                    cx={px}
                    cy={py}
                    r={p.radiusSvg + 7}
                    fill="none"
                    stroke={colors.cyan}
                    strokeWidth="1.5"
                  />
                )}

                {/* Planet Label */}
                <SvgText
                  x={px + 8}
                  y={py + 3}
                  fill={isSelected ? colors.cyan : colors.textMuted}
                  fontSize={isSelected ? '9' : '7'}
                  fontWeight={isSelected ? 'bold' : 'normal'}
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
    borderColor: 'rgba(245, 158, 11, 0.25)',
  },
  controlHeader: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  btnRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: radii.sm,
    backgroundColor: colors.spaceElevated,
    borderWidth: 1,
    borderColor: colors.glassBorderSubtle,
    marginRight: 6,
    marginBottom: 6,
  },
  chipActive: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: colors.amber,
  },
  chipText: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.amber,
    fontWeight: '700',
  },
});
