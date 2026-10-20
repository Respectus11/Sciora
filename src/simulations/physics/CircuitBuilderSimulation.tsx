import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Line, Circle, Rect, Text as SvgText, G, Defs, RadialGradient, Stop } from 'react-native-svg';
import { SimulationWorkspace } from '@/components/simulation/SimulationWorkspace';
import { GlassCard } from '@/components/ui/GlassCard';
import { colors, spacing, radii } from '@/design-system';

type CircuitMode = 'single' | 'series' | 'parallel';

export const CircuitBuilderSimulation: React.FC = () => {
  const [voltage, setVoltage] = useState(3.0);
  const [isSwitchClosed, setIsSwitchClosed] = useState(true);
  const [circuitMode, setCircuitMode] = useState<CircuitMode>('single');

  const bulbResistance = 10;
  const eqResistance = circuitMode === 'single' ? bulbResistance : circuitMode === 'series' ? bulbResistance * 2 : bulbResistance / 2;
  const current = isSwitchClosed ? voltage / eqResistance : 0;
  const power = isSwitchClosed ? voltage * current : 0;
  const glowOpacity = isSwitchClosed ? Math.min(1, Math.max(0.2, (current / (circuitMode === 'parallel' ? 0.6 : 0.3)) * 0.8)) : 0;

  const svgWidth = 340;
  const svgHeight = 280;

  return (
    <SimulationWorkspace
      title="Electric Circuit Builder & Ohms Law"
      unitTag='Grade 8 Physics • Unit 7.5'
      onReset={() => {
        setVoltage(3.0);
        setIsSwitchClosed(true);
        setCircuitMode('single');
      }}
      telemetry={[
        { label: 'Voltage (V)', value: voltage.toFixed(1), unit: 'V', color: colors.cyan },
        { label: 'Current (I)', value: current.toFixed(2), unit: 'A', color: isSwitchClosed ? colors.amber : colors.rose },
        { label: 'Req (Ohm)', value: eqResistance.toFixed(1), unit: 'Ω', color: colors.violet },
        { label: 'Total Power', value: power.toFixed(2), unit: 'W', color: isSwitchClosed ? colors.emerald : colors.rose },
      ]}
      instructions={[
        'Compare Single, Series, and Parallel bulb arrangements in Unit 7.5.',
        'In Series: equivalent resistance doubles (20 Ω), current halves, and bulbs dim.',
        'In Parallel: equivalent resistance halves (5 Ω), total current doubles, and bulbs shine at full brightness.',
        'Toggle the knife switch to observe complete vs broken electrical circuits.',
      ]}
      controlsNode={
        <GlassCard variant='base' padding='md' style={styles.controlsCard}>
          <Text style={styles.controlHeader}>Circuit Configuration:</Text>
          <View style={styles.btnRow}>
            {(['single', 'series', 'parallel'] as CircuitMode[]).map((mode) => (
              <Pressable
                key={mode}
                style={[styles.chip, circuitMode === mode ? styles.chipActive : undefined]}
                onPress={() => setCircuitMode(mode)}
              >
                <Text style={[styles.chipText, circuitMode === mode ? styles.chipTextActive : undefined]}>
                  {mode.toUpperCase()} BULB{mode !== 'single' ? 'S' : ''}
                </Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.controlsRow}>
            <View style={styles.voltageGroup}>
              <Text style={styles.controlHeader}>Battery Voltage (DC Cells):</Text>
              <View style={styles.btnRow}>
                {[1.5, 3.0, 4.5, 6.0].map((v) => (
                  <Pressable
                    key={v}
                    style={[styles.chip, voltage === v ? styles.chipActive : undefined]}
                    onPress={() => setVoltage(v)}
                  >
                    <Text style={[styles.chipText, voltage === v ? styles.chipTextActive : undefined]}>
                      {v.toFixed(1)}V
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
            <Pressable
              style={[styles.switchToggleBtn, isSwitchClosed ? styles.switchBtnClosed : styles.switchBtnOpen]}
              onPress={() => setIsSwitchClosed(!isSwitchClosed)}
              accessibilityRole='button'
            >
              <Text style={styles.switchBtnText}>{isSwitchClosed ? 'Open Switch' : 'Close Switch'}</Text>
            </Pressable>
          </View>
        </GlassCard>
      }
    >
      {() => (
        <Svg width='100%' height='100%' viewBox={'0 0 ' + svgWidth + ' ' + svgHeight}>
          <Defs>
            <RadialGradient id='bulbGlow' cx='50%' cy='50%' r='50%'>
              <Stop offset='0%' stopColor='#FDE047' stopOpacity={glowOpacity} />
              <Stop offset='60%' stopColor='#F59E0B' stopOpacity={glowOpacity * 0.5} />
              <Stop offset='100%' stopColor='#F59E0B' stopOpacity='0' />
            </RadialGradient>
          </Defs>
          <Line x1='40' y1='40' x2='300' y2='40' stroke={colors.cyan} strokeWidth='3' />
          <Line x1='300' y1='40' x2='300' y2='240' stroke={colors.cyan} strokeWidth='3' />
          <Line x1='300' y1='240' x2='40' y2='240' stroke={colors.cyan} strokeWidth='3' />
          <Line x1='40' y1='240' x2='40' y2='160' stroke={colors.cyan} strokeWidth='3' />
          <Line x1='40' y1='100' x2='40' y2='40' stroke={colors.cyan} strokeWidth='3' />
          <G>
            <Rect x='28' y='100' width='24' height='60' rx='4' fill='#1E293B' stroke='#F59E0B' strokeWidth='2' />
            <Rect x='36' y='94' width='8' height='6' rx='2' fill='#F59E0B' />
            <SvgText x='40' y='135' fill='#FDE047' fontSize='10' fontWeight='bold' textAnchor='middle'>{voltage.toFixed(1) + 'V'}</SvgText>
            <SvgText x='15' y='135' fill='#00E5FF' fontSize='12' fontWeight='bold'>+</SvgText>
            <SvgText x='15' y='155' fill='#94A3B8' fontSize='12' fontWeight='bold'>-</SvgText>
          </G>
          <G>
            <Circle cx='120' cy='240' r='4' fill={colors.amber} />
            <Circle cx='180' cy='240' r='4' fill={colors.amber} />
            {isSwitchClosed ? (
              <Line x1='120' y1='240' x2='180' y2='240' stroke='#10B981' strokeWidth='4' />
            ) : (
              <Line x1='120' y1='240' x2='165' y2='215' stroke='#EF4444' strokeWidth='4' />
            )}
            <SvgText x='150' y='265' fill={isSwitchClosed ? '#10B981' : '#EF4444'} fontSize='10' fontWeight='bold' textAnchor='middle'>
              {isSwitchClosed ? 'SWITCH CLOSED (ON)' : 'SWITCH OPEN (OFF)'}
            </SvgText>
          </G>
          <G>
            <Circle cx='300' cy='120' r='40' fill='url(#bulbGlow)' />
            <Circle cx='300' cy='120' r='18' fill={isSwitchClosed ? '#FEF08A' : 'rgba(255,255,255,0.1)'} stroke='#E2E8F0' strokeWidth='2' />
            <Line x1='292' y1='125' x2='300' y2='110' stroke='#F59E0B' strokeWidth='2' />
            <Line x1='300' y1='110' x2='308' y2='125' stroke='#F59E0B' strokeWidth='2' />
            <SvgText x='300' y='160' fill='#E2E8F0' fontSize='10' fontWeight='600' textAnchor='middle'>
              {circuitMode === 'single' ? 'Lamp (10 Ω)' : 'Lamp 1 (10 Ω)'}
            </SvgText>
          </G>
          {circuitMode !== 'single' && (
            <G>
              <Circle cx='220' cy='120' r='40' fill='url(#bulbGlow)' />
              <Circle cx='220' cy='120' r='18' fill={isSwitchClosed ? '#FEF08A' : 'rgba(255,255,255,0.1)'} stroke='#E2E8F0' strokeWidth='2' />
              <Line x1='212' y1='125' x2='220' y2='110' stroke='#F59E0B' strokeWidth='2' />
              <Line x1='220' y1='110' x2='228' y2='125' stroke='#F59E0B' strokeWidth='2' />
              <SvgText x='220' y='160' fill='#E2E8F0' fontSize='10' fontWeight='600' textAnchor='middle'>Lamp 2 (10 Ω)</SvgText>
            </G>
          )}
          {isSwitchClosed && (
            <G>
              <Circle cx='170' cy='40' r='3' fill='#FDE047' />
              <Circle cx='240' cy='40' r='3' fill='#FDE047' />
              <Circle cx='40' cy='190' r='3' fill='#FDE047' />
              <SvgText x='170' y='30' fill='#FDE047' fontSize='9' textAnchor='middle'>Current Flow →</SvgText>
            </G>
          )}
        </Svg>
      )}
    </SimulationWorkspace>
  );
};

const styles = StyleSheet.create({
  controlsCard: { marginTop: spacing.sm },
  controlsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.xs },
  voltageGroup: { flex: 1 },
  controlHeader: { fontSize: 11, color: colors.textMuted, marginBottom: spacing.xs },
  btnRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.xs },
  chip: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: radii.sm, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'transparent' },
  chipActive: { backgroundColor: 'rgba(0,229,255,0.12)', borderColor: colors.cyan },
  chipText: { fontSize: 11, color: colors.textSecondary },
  chipTextActive: { color: colors.textPrimary, fontWeight: 'bold' },
  switchToggleBtn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: radii.sm },
  switchBtnClosed: { backgroundColor: '#10B981' },
  switchBtnOpen: { backgroundColor: '#EF4444' },
  switchBtnText: { fontSize: 12, fontWeight: 'bold', color: '#FFFFFF' },
});