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
  stableN: number;
  group: string;
}

const ELEMENTS: Record<number, ElementInfo> = {
  1: { name: 'Hydrogen', symbol: 'H', stableN: 0, group: 'Reactive Nonmetal' },
  2: { name: 'Helium', symbol: 'He', stableN: 2, group: 'Noble Gas' },
  3: { name: 'Lithium', symbol: 'Li', stableN: 4, group: 'Alkali Metal' },
  4: { name: 'Beryllium', symbol: 'Be', stableN: 5, group: 'Alkaline Earth Metal' },
  5: { name: 'Boron', symbol: 'B', stableN: 6, group: 'Metalloid' },
  6: { name: 'Carbon', symbol: 'C', stableN: 6, group: 'Nonmetal' },
  7: { name: 'Nitrogen', symbol: 'N', stableN: 7, group: 'Pnictogen' },
  8: { name: 'Oxygen', symbol: 'O', stableN: 8, group: 'Chalcogen' },
  9: { name: 'Fluorine', symbol: 'F', stableN: 10, group: 'Halogen' },
  10: { name: 'Neon', symbol: 'Ne', stableN: 10, group: 'Noble Gas' },
  11: { name: 'Sodium', symbol: 'Na', stableN: 12, group: 'Alkali Metal' },
  12: { name: 'Magnesium', symbol: 'Mg', stableN: 12, group: 'Alkaline Earth Metal' },
  13: { name: 'Aluminum', symbol: 'Al', stableN: 14, group: 'Post-transition Metal' },
  14: { name: 'Silicon', symbol: 'Si', stableN: 14, group: 'Metalloid' },
  15: { name: 'Phosphorus', symbol: 'P', stableN: 16, group: 'Pnictogen' },
  16: { name: 'Sulfur', symbol: 'S', stableN: 16, group: 'Chalcogen' },
  17: { name: 'Chlorine', symbol: 'Cl', stableN: 18, group: 'Halogen' },
  18: { name: 'Argon', symbol: 'Ar', stableN: 22, group: 'Noble Gas' },
};

export const AtomBuilderSimulation: React.FC = () => {
  const [protons, setProtons] = useState(6); // Default Carbon
  const [neutrons, setNeutrons] = useState(6);
  const [electrons, setElectrons] = useState(6);

  const z = protons;
  const a = protons + neutrons;
  const netCharge = protons - electrons;
  const element = ELEMENTS[z] || { name: 'Synthetic Element', symbol: `E${z}`, stableN: z, group: 'Heavy Element' };

  // 3-Shell Bohr Model: K (2), L (8), M (8)
  const shell1 = Math.min(2, electrons);
  const remAfterS1 = Math.max(0, electrons - 2);
  const shell2 = Math.min(8, remAfterS1);
  const remAfterS2 = Math.max(0, remAfterS1 - 8);
  const shell3 = Math.min(8, remAfterS2);

  // Valence configuration
  const electronConfigStr = shell3 > 0 ? `${shell1}, ${shell2}, ${shell3}` : shell2 > 0 ? `${shell1}, ${shell2}` : `${shell1}`;
  const valenceElectrons = shell3 > 0 ? shell3 : shell2 > 0 ? shell2 : shell1;

  // Nuclear stability
  const nDelta = Math.abs(neutrons - element.stableN);
  const stabilityStatus =
    nDelta === 0 ? 'Stable Isotope' : nDelta === 1 ? 'Semi-Stable' : 'Unstable (Radioactive)';
  const stabilityColor =
    nDelta === 0 ? colors.emerald : nDelta === 1 ? colors.amber : colors.rose;

  // SVG parameters
  const svgWidth = 360;
  const svgHeight = 290;
  const originX = svgWidth / 2;
  const originY = svgHeight / 2 - 10;
  const shell1Radius = 50;
  const shell2Radius = 85;
  const shell3Radius = 120;

  const setPreset = (p: number, n: number, e: number) => {
    setProtons(p);
    setNeutrons(n);
    setElectrons(e);
  };

  return (
    <SimulationWorkspace
      title="Bohr Atomic Model, Isotopes & Ions Lab"
      unitTag="Grade 8 Science • Unit 2.1"
      telemetry={[
        { label: 'Element', value: `${element.name} (${element.symbol})`, color: colors.violet },
        { label: 'Atomic Number (Z)', value: `${z}`, color: colors.cyan },
        { label: 'Mass Number (A)', value: `${a}`, color: colors.amber },
        {
          label: 'Charge State',
          value: netCharge === 0 ? '0 (Neutral)' : netCharge > 0 ? `+${netCharge} (Cation)` : `${netCharge} (Anion)`,
          color: netCharge === 0 ? colors.emerald : netCharge > 0 ? colors.amber : colors.rose,
        },
        { label: 'Valence Config', value: `[${electronConfigStr}] (${valenceElectrons} val)`, color: colors.cyan },
        { label: 'Stability', value: stabilityStatus, color: stabilityColor },
      ]}
      instructions={[
        'Add or remove Protons (p⁺) to select an element from Hydrogen (Z=1) to Argon (Z=18).',
        'Vary Neutrons (n⁰) to synthesize isotopes and observe whether the nucleus is stable or radioactive.',
        'Adjust Electrons (e⁻) to fill Bohr energy shells (K:2, L:8, M:8) and create cations or anions.',
        'Observe how the valence electron count dictates chemical family behavior and reactivity.',
      ]}
      controlsNode={
        <GlassCard variant="base" padding="md" style={styles.controlsCard}>
          {/* Quick Element Presets */}
          <Text style={styles.controlHeader}>Standard Isotope Presets:</Text>
          <View style={styles.presetsRow}>
            {[
              { label: '¹H (Hydrogen)', p: 1, n: 0, e: 1 },
              { label: '⁴He (Helium)', p: 2, n: 2, e: 2 },
              { label: '¹²C (Carbon-12)', p: 6, n: 6, e: 6 },
              { label: '¹⁴C (Carbon-14)', p: 6, n: 8, e: 6 },
              { label: '¹⁶O (Oxygen)', p: 8, n: 8, e: 8 },
              { label: '²³Na⁺ (Sodium Ion)', p: 11, n: 12, e: 10 },
              { label: '³⁵Cl⁻ (Chloride Ion)', p: 17, n: 18, e: 18 },
            ].map((preset) => (
              <Pressable
                key={preset.label}
                style={[
                  styles.presetChip,
                  protons === preset.p && neutrons === preset.n && electrons === preset.e && styles.presetChipActive,
                ]}
                onPress={() => setPreset(preset.p, preset.n, preset.e)}
              >
                <Text
                  style={[
                    styles.presetText,
                    protons === preset.p && neutrons === preset.n && electrons === preset.e && styles.presetTextActive,
                  ]}
                >
                  {preset.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Subatomic Particle Counters */}
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
                  onPress={() => setProtons((prev) => Math.min(18, prev + 1))}
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
                  onPress={() => setNeutrons((prev) => Math.min(24, prev + 1))}
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
                  onPress={() => setElectrons((prev) => Math.min(18, prev + 1))}
                >
                  <Text style={styles.counterBtnText}>+</Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Group Classification Banner */}
          <View style={styles.groupBanner}>
            <Text style={styles.groupTitle}>
              {element.name} ({element.symbol}) • Group: {element.group}
            </Text>
            <Text style={styles.groupSub}>
              {stabilityStatus} • Valence Electrons: {valenceElectrons} / 8 octet
            </Text>
          </View>
        </GlassCard>
      }
    >
      {() => (
        <Svg width="100%" height="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
          {/* 1. Concentric Bohr Shell Orbits */}
          {/* Shell 1 (K Shell, capacity 2) */}
          <Circle
            cx={originX}
            cy={originY}
            r={shell1Radius}
            fill="none"
            stroke="rgba(0, 229, 255, 0.35)"
            strokeWidth="1.5"
            strokeDasharray="4,3"
          />
          <SvgText x={originX} y={originY - shell1Radius - 3} fill="#00E5FF" fontSize="8" textAnchor="middle">
            K Shell (n=1, max 2)
          </SvgText>

          {/* Shell 2 (L Shell, capacity 8) */}
          {(shell2 > 0 || electrons > 2) && (
            <G>
              <Circle
                cx={originX}
                cy={originY}
                r={shell2Radius}
                fill="none"
                stroke="rgba(139, 92, 246, 0.35)"
                strokeWidth="1.5"
                strokeDasharray="4,3"
              />
              <SvgText x={originX} y={originY - shell2Radius - 3} fill="#8B5CF6" fontSize="8" textAnchor="middle">
                L Shell (n=2, max 8)
              </SvgText>
            </G>
          )}

          {/* Shell 3 (M Shell, capacity 8) */}
          {(shell3 > 0 || electrons > 10) && (
            <G>
              <Circle
                cx={originX}
                cy={originY}
                r={shell3Radius}
                fill="none"
                stroke="rgba(245, 158, 11, 0.35)"
                strokeWidth="1.5"
                strokeDasharray="4,3"
              />
              <SvgText x={originX} y={originY - shell3Radius - 3} fill="#F59E0B" fontSize="8" textAnchor="middle">
                M Shell (n=3, max 8)
              </SvgText>
            </G>
          )}

          {/* 2. Atomic Nucleus (Protons & Neutrons Cluster) */}
          <Circle cx={originX} cy={originY} r="28" fill="rgba(15, 23, 42, 0.85)" stroke="#38BDF8" strokeWidth="2" />
          <SvgText
            x={originX}
            y={originY - 4}
            fill="#FFFFFF"
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
          >
            {element.symbol}
          </SvgText>
          <SvgText
            x={originX}
            y={originY + 12}
            fill="#94A3B8"
            fontSize="8"
            textAnchor="middle"
          >
            {protons}p | {neutrons}n
          </SvgText>

          {/* 3. Electrons in Shell 1 (K Shell) */}
          {Array.from({ length: shell1 }).map((_, idx) => {
            const angleDeg = (idx / 2) * 360;
            const angleRad = (angleDeg * Math.PI) / 180;
            const ex = originX + shell1Radius * Math.cos(angleRad);
            const ey = originY + shell1Radius * Math.sin(angleRad);
            return (
              <G key={`s1-${idx}`}>
                <Circle cx={ex} cy={ey} r="5" fill="#00E5FF" stroke="#FFFFFF" strokeWidth="1" />
                <SvgText x={ex} y={ey + 3} fill="#0F172A" fontSize="7" fontWeight="bold" textAnchor="middle">
                  -
                </SvgText>
              </G>
            );
          })}

          {/* 4. Electrons in Shell 2 (L Shell) */}
          {Array.from({ length: shell2 }).map((_, idx) => {
            const angleDeg = (idx / 8) * 360 + 22.5;
            const angleRad = (angleDeg * Math.PI) / 180;
            const ex = originX + shell2Radius * Math.cos(angleRad);
            const ey = originY + shell2Radius * Math.sin(angleRad);
            return (
              <G key={`s2-${idx}`}>
                <Circle cx={ex} cy={ey} r="5" fill="#8B5CF6" stroke="#FFFFFF" strokeWidth="1" />
                <SvgText x={ex} y={ey + 3} fill="#FFFFFF" fontSize="7" fontWeight="bold" textAnchor="middle">
                  -
                </SvgText>
              </G>
            );
          })}

          {/* 5. Electrons in Shell 3 (M Shell) */}
          {Array.from({ length: shell3 }).map((_, idx) => {
            const angleDeg = (idx / 8) * 360;
            const angleRad = (angleDeg * Math.PI) / 180;
            const ex = originX + shell3Radius * Math.cos(angleRad);
            const ey = originY + shell3Radius * Math.sin(angleRad);
            return (
              <G key={`s3-${idx}`}>
                <Circle cx={ex} cy={ey} r="5" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="1" />
                <SvgText x={ex} y={ey + 3} fill="#0F172A" fontSize="7" fontWeight="bold" textAnchor="middle">
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
    gap: spacing.sm,
  },
  controlHeader: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  presetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  presetChip: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: radii.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: colors.glassBorderSubtle,
  },
  presetChipActive: {
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    borderColor: colors.cyan,
  },
  presetText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textSecondary,
  },
  presetTextActive: {
    color: colors.cyan,
    fontWeight: '700',
  },
  particleControllersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  particleCol: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: radii.sm,
    padding: spacing.xs,
    borderWidth: 1,
    borderColor: colors.glassBorderSubtle,
  },
  particleHeader: {
    ...typography.caption,
    fontWeight: '700',
    fontSize: 11,
    marginBottom: 4,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  counterBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: colors.glassBorderSubtle,
    width: 28,
    height: 28,
    borderRadius: radii.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterBtnText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textPrimary,
    fontSize: 14,
  },
  counterVal: {
    ...typography.heading3,
    color: colors.textPrimary,
    fontWeight: '700',
    minWidth: 20,
    textAlign: 'center',
  },
  groupBanner: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: radii.sm,
    padding: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.cyan,
  },
  groupTitle: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.cyan,
    marginBottom: 2,
  },
  groupSub: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
  },
});
