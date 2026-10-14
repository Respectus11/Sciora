import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, {
  Line,
  Circle,
  Rect,
  Text as SvgText,
  G,
  Defs,
  RadialGradient,
  Stop,
} from 'react-native-svg';
import { SimulationWorkspace } from '@/components/simulation/SimulationWorkspace';
import { GlassCard } from '@/components/ui/GlassCard';
import { colors, spacing, typography, radii } from '@/design-system';

export const CircuitBuilderSimulation: React.FC = () => {
  const [voltage, setVoltage] = useState(3.0); // Volts (1.5, 3.0, 4.5)
  const [isSwitchClosed, setIsSwitchClosed] = useState(true);
  const resistance = 10; // Ohms (fixed bulb resistance)

  // Ohm's Law: I = V / R
  const current = isSwitchClosed ? voltage / resistance : 0;
  const power = isSwitchClosed ? voltage * current : 0; // P = V * I in Watts

  // SVG dimensions
  const svgWidth = 340;
  const svgHeight = 280;

  // Circuit loop geometry corners
  const leftX = 50;
  const rightX = 290;
  const topY = 60;
  const bottomY = 220;

  return (
    <SimulationWorkspace
      title="Electric Circuit Builder Lab"
      unitTag="Grade 8 Physics • Unit 7.5"
      telemetry={[
        { label: 'Battery Voltage (V)', value: `${voltage.toFixed(1)}`, unit: 'V', color: colors.cyan },
        { label: 'Electric Current (I)', value: `${current.toFixed(2)}`, unit: 'A', color: isSwitchClosed ? colors.amber : colors.rose },
        { label: 'Bulb Resistance (R)', value: `${resistance}`, unit: 'Ω', color: colors.violet },
        { label: 'Circuit State', value: isSwitchClosed ? 'CLOSED (ACTIVE)' : 'OPEN (BROKEN)', color: isSwitchClosed ? colors.emerald : colors.rose },
      ]}
      instructions={[
        'Tap the Knife Switch in the diagram or controls to toggle between OPEN and CLOSED states.',
        'Observe how an open circuit completely stops electric charge flow (I = 0.00 A).',
        'Adjust the Battery Voltage (1.5V, 3.0V, 4.5V) and observe how Current I increases proportionally (I = V/R).',
        'Watch the incandescent lamp filament radiance brighten as electrical power increases.',
      ]}
      controlsNode={
        <GlassCard variant="base" padding="md" style={styles.controlsCard}>
          <View style={styles.controlsRow}>
            {/* Voltage Stepper Chips */}
            <View style={styles.voltageGroup}>
              <Text style={styles.controlHeader}>Battery Voltage (DC Cells):</Text>
              <View style={styles.btnRow}>
                {[1.5, 3.0, 4.5].map((v) => (
                  <Pressable
                    key={v}
                    style={[styles.chip, voltage === v ? styles.chipActive : undefined]}
                    onPress={() => setVoltage(v)}
                  >
                    <Text style={[styles.chipText, voltage === v ? styles.chipTextActive : undefined]}>
                      {v.toFixed(1)}V ({Math.round(v / 1.5)} {v === 1.5 ? 'Cell' : 'Cells'})
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Knife Switch Button */}
            <Pressable
              style={[styles.switchToggleBtn, isSwitchClosed ? styles.switchBtnClosed : styles.switchBtnOpen]}
              onPress={() => setIsSwitchClosed((prev) => !prev)}
            >
              <Text style={styles.switchBtnText}>
                {isSwitchClosed ? 'Open Switch' : 'Close Switch'}
              </Text>
            </Pressable>
          </View>
        </GlassCard>
      }
    >
      {() => (
        <Svg width="100%" height="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
          <Defs>
            {/* Bulb Radiant Glow Gradient */}
            <RadialGradient id="bulbGlow" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#FEF08A" stopOpacity={Math.min(1, current * 2.2)} />
              <Stop offset="60%" stopColor="#F59E0B" stopOpacity={Math.min(0.8, current * 1.5)} />
              <Stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
            </RadialGradient>
          </Defs>

          {/* 1. Copper Wire Rectangular Conducting Loop */}
          {/* Top wire (broken at switch position) */}
          <Line x1={leftX} y1={topY} x2={140} y2={topY} stroke="#38BDF8" strokeWidth="4" />
          <Line x1={200} y1={topY} x2={rightX} y2={topY} stroke="#38BDF8" strokeWidth="4" />

          {/* Right vertical wire (with light bulb load) */}
          <Line x1={rightX} y1={topY} x2={rightX} y2={100} stroke="#38BDF8" strokeWidth="4" />
          <Line x1={rightX} y1={180} x2={rightX} y2={bottomY} stroke="#38BDF8" strokeWidth="4" />

          {/* Bottom wire (with Ammeter gauge) */}
          <Line x1={rightX} y1={bottomY} x2={200} y2={bottomY} stroke="#38BDF8" strokeWidth="4" />
          <Line x1={140} y1={bottomY} x2={leftX} y2={bottomY} stroke="#38BDF8" strokeWidth="4" />

          {/* Left vertical wire (with dry cell battery) */}
          <Line x1={leftX} y1={bottomY} x2={leftX} y2={170} stroke="#38BDF8" strokeWidth="4" />
          <Line x1={leftX} y1={110} x2={leftX} y2={topY} stroke="#38BDF8" strokeWidth="4" />

          {/* 2. Dry Cell Battery Symbol (Left side) */}
          <G>
            {/* Battery Body */}
            <Rect x={leftX - 12} y={115} width="24" height="50" rx="4" fill="#334155" stroke="#64748B" strokeWidth="1.5" />
            <Rect x={leftX - 6} y={110} width="12" height="6" rx="2" fill="#F59E0B" />
            <SvgText x={leftX - 20} y={126} fill="#EF4444" fontSize="12" fontWeight="bold">
              +
            </SvgText>
            <SvgText x={leftX - 18} y={160} fill="#38BDF8" fontSize="12" fontWeight="bold">
              -
            </SvgText>
            <SvgText x={leftX - 22} y={142} fill={colors.textSecondary} fontSize="8" textAnchor="end">
              {voltage.toFixed(1)}V DC
            </SvgText>
          </G>

          {/* 3. Knife Switch (Top branch: x=140 to x=200) */}
          <G>
            {/* Terminal contact posts */}
            <Circle cx={140} cy={topY} r="5" fill="#E2E8F0" />
            <Circle cx={200} cy={topY} r="5" fill="#E2E8F0" />
            {/* Switch arm (angled up if open, horizontal if closed) */}
            <Line
              x1={140}
              y1={topY}
              x2={isSwitchClosed ? 200 : 185}
              y2={isSwitchClosed ? topY : topY - 30}
              stroke={isSwitchClosed ? colors.emerald : colors.rose}
              strokeWidth="4"
            />
            <SvgText x={170} y={topY - 36} fill={isSwitchClosed ? colors.emerald : colors.rose} fontSize="10" fontWeight="bold" textAnchor="middle">
              {isSwitchClosed ? 'SWITCH CLOSED' : 'SWITCH OPEN'}
            </SvgText>
          </G>

          {/* 4. Light Bulb Load (Right branch: y=100 to y=180) */}
          <G>
            {/* Radiance glow disc */}
            {isSwitchClosed && (
              <Circle cx={rightX} cy={140} r={28 + current * 20} fill="url(#bulbGlow)" />
            )}
            {/* Glass envelope circle */}
            <Circle
              cx={rightX}
              cy={140}
              r="22"
              fill={isSwitchClosed ? 'rgba(254, 240, 138, 0.25)' : 'rgba(255, 255, 255, 0.05)'}
              stroke="#94A3B8"
              strokeWidth="1.5"
            />
            {/* Filament */}
            <Line
              x1={rightX - 8}
              y1={145}
              x2={rightX}
              y2={135}
              stroke={isSwitchClosed ? '#FEF08A' : '#64748B'}
              strokeWidth="2"
            />
            <Line
              x1={rightX}
              y1={135}
              x2={rightX + 8}
              y2={145}
              stroke={isSwitchClosed ? '#FEF08A' : '#64748B'}
              strokeWidth="2"
            />
            <SvgText x={rightX + 32} y={144} fill={colors.textSecondary} fontSize="9" fontWeight="bold">
              LAMP ({resistance}Ω)
            </SvgText>
            {isSwitchClosed && (
              <SvgText x={rightX + 32} y={158} fill={colors.amber} fontSize="8">
                {power.toFixed(2)} W
              </SvgText>
            )}
          </G>

          {/* 5. In-line Ammeter (Bottom branch: x=140 to x=200) */}
          <G>
            <Circle cx={170} cy={bottomY} r="18" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
            <SvgText x={170} y={bottomY - 4} fill={colors.cyan} fontSize="11" fontWeight="bold" textAnchor="middle">
              A
            </SvgText>
            <SvgText x={170} y={bottomY + 10} fill={colors.cyan} fontSize="8" textAnchor="middle">
              {current.toFixed(2)}A
            </SvgText>
          </G>

          {/* 6. Animated Electron Dots around loop (if switch closed) */}
          {isSwitchClosed && (
            <G>
              {[
                { x: 90, y: topY },
                { x: 250, y: topY },
                { x: rightX, y: 80 },
                { x: rightX, y: 200 },
                { x: 250, y: bottomY },
                { x: 90, y: bottomY },
                { x: leftX, y: 200 },
                { x: leftX, y: 80 },
              ].map((pos, idx) => (
                <Circle key={idx} cx={pos.x} cy={pos.y} r="3" fill="#60A5FA" />
              ))}
              <SvgText x={svgWidth / 2} y={140} fill="#60A5FA" fontSize="9" textAnchor="middle" opacity="0.6">
                ← Real Electron Flow (-) to (+) ←
              </SvgText>
            </G>
          )}
        </Svg>
      )}
    </SimulationWorkspace>
  );
};

const styles = StyleSheet.create({
  controlsCard: {
    borderColor: 'rgba(0, 229, 255, 0.25)',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  voltageGroup: {
    flex: 1,
    marginRight: spacing.sm,
  },
  controlHeader: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  btnRow: {
    flexDirection: 'row',
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: radii.sm,
    backgroundColor: colors.spaceElevated,
    borderWidth: 1,
    borderColor: colors.glassBorderSubtle,
    marginRight: 6,
  },
  chipActive: {
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    borderColor: colors.cyan,
  },
  chipText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.cyan,
    fontWeight: '700',
  },
  switchToggleBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: radii.button,
    borderWidth: 1,
  },
  switchBtnOpen: {
    backgroundColor: 'rgba(244, 63, 94, 0.15)',
    borderColor: colors.rose,
  },
  switchBtnClosed: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: colors.emerald,
  },
  switchBtnText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});
