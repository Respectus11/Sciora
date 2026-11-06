import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Line, Circle, Rect, Text as SvgText, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { SimulationWorkspace } from '@/components/simulation/SimulationWorkspace';
import { GlassCard } from '@/components/ui/GlassCard';
import { colors, spacing, radii } from '@/design-system';

interface RodMaterial {
  id: string;
  name: string;
  k: number;
  color: string;
  dropped: number;
  y: number;
}

export const ThermalConductionSimulation: React.FC = () => {
  const [flameTemp, setFlameTemp] = useState(200);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isHeating, setIsHeating] = useState(true);

  useEffect(() => {
    let interval: any = null;
    if (isHeating && timeElapsed < 60) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => Math.min(60, prev + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isHeating, timeElapsed]);

  const tempFactor = flameTemp / 200;
  const effectiveTime = timeElapsed * tempFactor;
  const copperPins = effectiveTime >= 12 ? 3 : effectiveTime >= 7 ? 2 : effectiveTime >= 3 ? 1 : 0;
  const ironPins = effectiveTime >= 32 ? 3 : effectiveTime >= 18 ? 2 : effectiveTime >= 9 ? 1 : 0;
  const glassPins = effectiveTime >= 48 ? 1 : 0;
  const woodPins = 0;

  const svgWidth = 340;
  const svgHeight = 280;

  const rods: RodMaterial[] = [
    { id: 'copper', name: 'Copper (k = 385)', k: 385, color: '#F97316', dropped: copperPins, y: 70 },
    { id: 'iron', name: 'Iron (k = 80)', k: 80, color: '#94A3B8', dropped: ironPins, y: 120 },
    { id: 'glass', name: 'Glass (k = 0.8)', k: 0.8, color: '#38BDF8', dropped: glassPins, y: 170 },
    { id: 'wood', name: 'Wood (k = 0.15)', k: 0.15, color: '#A16207', dropped: woodPins, y: 220 },
  ];

  const handleReset = () => {
    setFlameTemp(200);
    setTimeElapsed(0);
    setIsHeating(true);
  };

  return (
    <SimulationWorkspace
      title='Thermal Conduction Lab'
      unitTag='Grade 8 Physics • Unit 7.4'
      onReset={handleReset}
      telemetry={[
        { label: 'Time Elapsed', value: String(timeElapsed), unit: 's', color: colors.cyan },
        { label: 'Flame Temp', value: String(flameTemp), unit: '°C', color: colors.amber },
        { label: 'Copper Pins', value: copperPins + ' / 3', color: colors.emerald },
        { label: 'Wood Pins', value: woodPins + ' / 3', color: colors.rose },
      ]}
      instructions={[
        'Watch heat conduct from the left flame source through 4 material rods simultaneously.',
        'Pins attached by candle wax melt and drop when rod temperature reaches 60°C.',
        'Copper drops all 3 pins first due to high thermal conductivity (k = 385 W/m·K).',
        'Wood and glass serve as thermal insulators, keeping wax below melting temperature.',
      ]}
      controlsNode={
        <GlassCard variant='base' padding='md' style={styles.controlsCard}>
          <View style={styles.controlsRow}>
            <View style={styles.tempSelector}>
              <Text style={styles.controlHeader}>Flame Heat Source (°C):</Text>
              <View style={styles.btnRow}>
                {[100, 200, 300].map((t) => (
                  <Pressable
                    key={t}
                    style={[styles.chip, flameTemp === t ? styles.chipActive : undefined]}
                    onPress={() => setFlameTemp(t)}
                  >
                    <Text style={[styles.chipText, flameTemp === t ? styles.chipTextActive : undefined]}>
                      {t}°C
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
            <Pressable
              style={[styles.playButton, isHeating ? styles.pauseBtn : styles.playBtn]}
              onPress={() => setIsHeating(!isHeating)}
              accessibilityRole='button'
            >
              <Text style={styles.playBtnText}>{isHeating ? '❚❚ Pause' : '▶ Heat'}</Text>
            </Pressable>
          </View>
        </GlassCard>
      }
    >
      {() => (
        <Svg width='100%' height='100%' viewBox={'0 0 ' + svgWidth + ' ' + svgHeight}>
          <Defs>
            <LinearGradient id='heatGlow' x1='0' y1='0' x2='1' y2='0'>
              <Stop offset='0%' stopColor='#EF4444' stopOpacity='0.9' />
              <Stop offset='40%' stopColor='#F59E0B' stopOpacity='0.7' />
              <Stop offset='100%' stopColor='#3B82F6' stopOpacity='0.2' />
            </LinearGradient>
          </Defs>
          <Rect x='15' y='50' width='18' height='190' rx='4' fill='#EF4444' opacity='0.85' />
          <SvgText x='24' y='42' fill='#EF4444' fontSize='9' fontWeight='bold' textAnchor='middle'>FLAME</SvgText>
          <SvgText x='24' y='255' fill='#F59E0B' fontSize='8' textAnchor='middle'>{flameTemp + '°C'}</SvgText>
          {rods.map((rod) => {
            const heatProgress = Math.min(1, (effectiveTime * rod.k) / (385 * 25));
            const heatLen = Math.round(heatProgress * 230);
            return (
              <G key={rod.id}>
                <Rect x='33' y={rod.y - 6} width='250' height='12' rx='3' fill={rod.color} opacity='0.35' />
                <Rect x='33' y={rod.y - 6} width={heatLen} height='12' rx='3' fill='url(#heatGlow)' opacity='0.75' />
                <SvgText x='38' y={rod.y + 18} fill='#E2E8F0' fontSize='9' fontWeight='600'>{rod.name}</SvgText>
                {[1, 2, 3].map((pinIndex) => {
                  const pinX = 75 + pinIndex * 60;
                  const isDropped = rod.dropped >= pinIndex;
                  const pinHeadY = isDropped ? rod.y + 24 : rod.y + 6;
                  return (
                    <G key={pinIndex}>
                      <Line x1={pinX} y1={rod.y + 6} x2={pinX} y2={pinHeadY + 10} stroke={isDropped ? colors.rose : '#E2E8F0'} strokeWidth='1.5' />
                      <Circle cx={pinX} cy={pinHeadY + 12} r='2' fill={isDropped ? colors.rose : '#E2E8F0'} />
                    </G>
                  );
                })}
              </G>
            );
          })}
        </Svg>
      )}
    </SimulationWorkspace>
  );
};

const styles = StyleSheet.create({
  controlsCard: { borderColor: 'rgba(0, 229, 255, 0.25)', marginTop: spacing.sm },
  controlsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tempSelector: { flex: 1 },
  controlHeader: { fontSize: 11, color: colors.textMuted, marginBottom: spacing.xs },
  btnRow: { flexDirection: 'row' },
  chip: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: radii.sm, backgroundColor: colors.spaceElevated, borderWidth: 1, borderColor: colors.glassBorderSubtle, marginRight: 6 },
  chipActive: { backgroundColor: 'rgba(0, 229, 255, 0.15)', borderColor: colors.cyan },
  chipText: { fontSize: 11, color: colors.textSecondary },
  chipTextActive: { color: colors.textPrimary, fontWeight: 'bold' },
  playButton: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: radii.sm },
  playBtn: { backgroundColor: colors.cyan },
  pauseBtn: { backgroundColor: '#334155' },
  playBtnText: { fontSize: 12, fontWeight: 'bold', color: '#0F172A' },
});