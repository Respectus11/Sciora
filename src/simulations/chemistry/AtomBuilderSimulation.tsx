import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, {
  Circle,
  Text as SvgText,
  G,
} from 'react-native-svg';
import { SimulationWorkspace } from '@/components/simulation/SimulationWorkspace';
import { GlassCard } from '@/components/ui/GlassCard';
import { colors, spacing, typography, radii } from '@/design-system';

interface ElementInfo {
  name: string;
  symbol: string;
  defaultNeutrons: number;
}

const ELEMENTS: Record<number, ElementInfo> = {
  1: { name: 'Hydrogen', symbol: 'H', defaultNeutrons: 0 },
  2: { name: 'Helium', symbol: 'He', defaultNeutrons: 2 },
  3: { name: 'Lithium', symbol: 'Li', defaultNeutrons: 4 },
  4: { name: 'Beryllium', symbol: 'Be', defaultNeutrons: 5 },
  5: { name: 'Boron', symbol: 'B', defaultNeutrons: 6 },
  6: { name: 'Carbon', symbol: 'C', defaultNeutrons: 6 },
  7: { name: 'Nitrogen', symbol: 'N', defaultNeutrons: 7 },
  8: { name: 'Oxygen', symbol: 'O', defaultNeutrons: 8 },
  9: { name: 'Fluorine', symbol: 'F', defaultNeutrons: 10 },
  10: { name: 'Neon', symbol: 'Ne', defaultNeutrons: 10 },
};

export const AtomBuilderSimulation: React.FC = () => {
  const [protons, setProtons] = useState(6); // Default Carbon
  const [neutrons, setNeutrons] = useState(6);
  const [electrons, setElectrons] = useState(6);

  const z = protons;
  const a = protons + neutrons;
  const netCharge = protons - electrons;
  const element = ELEMENTS[z] || { name: 'Unknown', symbol: '?', defaultNeutrons: z };

  // Electron shell distribution: Shell 1 holds up to 2; Shell 2 holds up to 8
  const shell1Count = Math.min(2, electrons);
  const shell2Count = Math.min(8, Math.max(0, electrons - 2));

  // SVG parameters
  const svgWidth = 340;
  const svgHeight = 280;
  const originX = svgWidth / 2;
  const originY = svgHeight / 2;
  const shell1Radius = 60;
  const shell2Radius = 100;

  return (
    <SimulationWorkspace
      title="Atom & Subatomic Particle Builder"
      unitTag="Grade 8 Science • Unit 2.1"
      telemetry={[
        { label: 'Element', value: `${element.name} (${element.symbol})`, color: colors.violet },
        { label: 'Atomic Number (Z)', value: `${z}`, color: colors.cyan },
        { label: 'Mass Number (A)', value: `${a}`, color: colors.amber },
        {
          label: 'Net Charge',
          value: netCharge === 0 ? '0 (NEUTRAL)' : netCharge > 0 ? `+${netCharge} (CATION)` : `${netCharge} (ANION)`,
          color: netCharge === 0 ? colors.emerald : netCharge > 0 ? colors.amber : colors.rose,
        },
      ]}
      instructions={[
        'Add or remove Protons (+) to change the element identity on the periodic chart.',
        'Add Neutrons (0) to alter the mass number A without changing element identity or charge.',
        'Add Electrons (-) to see electron shell filling (max 2 in Shell 1, max 8 in Shell 2).',
        'Observe how having equal protons and electrons creates a neutral atom (Charge = 0).',
      ]}
      controlsNode={
        <GlassCard variant="base" padding="md" style={styles.controlsCard}>
          <View style={styles.particleControllersRow}>
            {/* Protons Control */}
            <View style={styles.particleCol}>
              <Text style={[styles.particleHeader, { color: colors.rose }]}>Protons (p⁺)</Text>
              <View style={styles.counterRow}>
                <Pressable
                  style={styles.counterBtn}
                  onPress={() => setProtons((prev) => Math.max(1, prev - 1))}
                >
                  <Text style={styles.counterBtnText}>-</Text>
                </Pressable>
                <Text style={styles.counterVal}>{protons}</Text>
                <Pressable
                  style={styles.counterBtn}
                  onPress={() => setProtons((prev) => Math.min(10, prev + 1))}
                >
                  <Text style={styles.counterBtnText}>+</Text>
                </Pressable>
              </View>
            </View>

            {/* Neutrons Control */}
            <View style={styles.particleCol}>
              <Text style={[styles.particleHeader, { color: colors.textSecondary }]}>Neutrons (n⁰)</Text>
              <View style={styles.counterRow}>
                <Pressable
                  style={styles.counterBtn}
                  onPress={() => setNeutrons((prev) => Math.max(0, prev - 1))}
                >
                  <Text style={styles.counterBtnText}>-</Text>
                </Pressable>
                <Text style={styles.counterVal}>{neutrons}</Text>
                <Pressable
                  style={styles.counterBtn}
                  onPress={() => setNeutrons((prev) => Math.min(12, prev + 1))}
                >
                  <Text style={styles.counterBtnText}>+</Text>
                </Pressable>
              </View>
            </View>

            {/* Electrons Control */}
            <View style={styles.particleCol}>
              <Text style={[styles.particleHeader, { color: colors.cyan }]}>Electrons (e⁻)</Text>
              <View style={styles.counterRow}>
                <Pressable
                  style={styles.counterBtn}
                  onPress={() => setElectrons((prev) => Math.max(0, prev - 1))}
                >
                  <Text style={styles.counterBtnText}>-</Text>
                </Pressable>
                <Text style={styles.counterVal}>{electrons}</Text>
                <Pressable
                  style={styles.counterBtn}
                  onPress={() => setElectrons((prev) => Math.min(10, prev + 1))}
                >
                  <Text style={styles.counterBtnText}>+</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </GlassCard>
      }
    >
      {() => (
        <Svg width="100%" height="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
          {/* Shell 2 Orbit (L Shell: Max 8) */}
          <Circle
            cx={originX}
            cy={originY}
            r={shell2Radius}
            fill="none"
            stroke="rgba(0, 229, 255, 0.2)"
            strokeWidth="1.5"
            strokeDasharray="4,4"
          />
          <SvgText x={originX} y={originY - shell2Radius - 6} fill={colors.textMuted} fontSize="8" textAnchor="middle">
            Shell 2 (L: {shell2Count}/8)
          </SvgText>

          {/* Shell 1 Orbit (K Shell: Max 2) */}
          <Circle
            cx={originX}
            cy={originY}
            r={shell1Radius}
            fill="none"
            stroke="rgba(0, 229, 255, 0.35)"
            strokeWidth="1.5"
            strokeDasharray="4,4"
          />
          <SvgText x={originX} y={originY - shell1Radius - 6} fill={colors.textMuted} fontSize="8" textAnchor="middle">
            Shell 1 (K: {shell1Count}/2)
          </SvgText>

          {/* Central Nucleus Disk */}
          <Circle cx={originX} cy={originY} r="28" fill="rgba(244, 63, 94, 0.25)" stroke="#F43F5E" strokeWidth="1.5" />
          <SvgText x={originX} y={originY - 6} fill="#FFFFFF" fontSize="12" fontWeight="bold" textAnchor="middle">
            {element.symbol}
          </SvgText>
          <SvgText x={originX} y={originY + 8} fill={colors.amber} fontSize="8" textAnchor="middle">
            {protons}p⁺ {neutrons}n⁰
          </SvgText>

          {/* Shell 1 Electrons */}
          {Array.from({ length: shell1Count }).map((_, i) => {
            const angle = (i * 2 * Math.PI) / 2;
            const ex = originX + shell1Radius * Math.cos(angle);
            const ey = originY + shell1Radius * Math.sin(angle);
            return (
              <G key={`s1-${i}`}>
                <Circle cx={ex} cy={ey} r="5" fill="#00E5FF" />
                <SvgText x={ex} y={ey + 3} fill="#000000" fontSize="7" fontWeight="bold" textAnchor="middle">
                  -
                </SvgText>
              </G>
            );
          })}

          {/* Shell 2 Electrons */}
          {Array.from({ length: shell2Count }).map((_, i) => {
            const angle = (i * 2 * Math.PI) / shell2Count;
            const ex = originX + shell2Radius * Math.cos(angle);
            const ey = originY + shell2Radius * Math.sin(angle);
            return (
              <G key={`s2-${i}`}>
                <Circle cx={ex} cy={ey} r="5" fill="#00E5FF" />
                <SvgText x={ex} y={ey + 3} fill="#000000" fontSize="7" fontWeight="bold" textAnchor="middle">
                  -
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
    borderColor: 'rgba(139, 92, 246, 0.25)',
  },
  particleControllersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  particleCol: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  particleHeader: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.spaceElevated,
    borderRadius: radii.button,
    borderWidth: 1,
    borderColor: colors.glassBorderSubtle,
    padding: 2,
  },
  counterBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radii.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  counterBtnText: {
    ...typography.bodyLarge,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  counterVal: {
    ...typography.scientificMono,
    fontSize: 14,
    fontWeight: '700',
    color: colors.cyan,
    paddingHorizontal: 10,
  },
});
