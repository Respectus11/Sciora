import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Switch } from 'react-native';
import Svg, { Line, Circle, Rect, Path, Text as SvgText, G } from 'react-native-svg';
import { SimulationWorkspace } from '@/components/simulation/SimulationWorkspace';
import { GlassCard } from '@/components/ui/GlassCard';
import { colors, spacing, radii } from '@/design-system';

interface SoundMedium {
  id: string;
  name: string;
  speed: number;
  particleColor: string;
}

const MEDIA: SoundMedium[] = [
  { id: 'air', name: 'Air (20°C)', speed: 343, particleColor: 'rgba(255, 255, 255, 0.3)' },
  { id: 'water', name: 'Fresh Water', speed: 1482, particleColor: 'rgba(56, 189, 248, 0.5)' },
  { id: 'steel', name: 'Steel Rail', speed: 5960, particleColor: 'rgba(148, 163, 184, 0.8)' },
];

export const SoundWaveSimulation: React.FC = () => {
  const [frequency, setFrequency] = useState(440);
  const [amplitude, setAmplitude] = useState(5);
  const [isVacuum, setIsVacuum] = useState(false);
  const [selectedMedium, setSelectedMedium] = useState<SoundMedium>(MEDIA[0]);

  const speedOfSound = isVacuum ? 0 : selectedMedium.speed;
  const wavelength = isVacuum ? 0 : speedOfSound / frequency;
  const decibels = isVacuum ? 0 : Math.round(40 + amplitude * 5);
  const svgWidth = 340;
  const svgHeight = 280;
  const cycleCount = Math.max(2, Math.min(8, Math.round(frequency / 120)));

  return (
    <SimulationWorkspace
      title='Acoustic Vibration & Medium Lab'
      unitTag='Grade 8 Physics • Unit 7.3'
      onReset={() => {
        setFrequency(440);
        setAmplitude(5);
        setIsVacuum(false);
        setSelectedMedium(MEDIA[0]);
      }}
      telemetry={[
        { label: 'Frequency (f)', value: String(frequency), unit: 'Hz', color: colors.cyan },
        { label: 'Wave Speed (v)', value: isVacuum ? '0' : String(speedOfSound), unit: 'm/s', color: colors.amber },
        { label: 'Wavelength (λ)', value: isVacuum ? '0.00' : wavelength.toFixed(2), unit: 'm', color: colors.violet },
        { label: 'Sound Output', value: isVacuum ? '0 (SILENCE)' : String(decibels) + ' dB', color: isVacuum ? colors.rose : colors.emerald },
      ]}
      instructions={[
        'Adjust Frequency (150–880 Hz) to observe pitch: higher frequency creates shorter wavelengths (λ = v / f).',
        'Compare propagation speed across Air (343 m/s), Water (1482 m/s), and Steel (5960 m/s).',
        'Observe how sound travels fastest in dense solids where particles are tightly coupled.',
        'Toggle the Vacuum Chamber switch to verify that sound cannot propagate without a material medium.',
      ]}
      controlsNode={
        <GlassCard variant='base' padding='md' style={styles.controlsCard}>
          <Text style={styles.controlHeader}>Transmission Medium:</Text>
          <View style={styles.btnRow}>
            {MEDIA.map((m) => (
              <Pressable
                key={m.id}
                disabled={isVacuum}
                style={[styles.chip, !isVacuum && selectedMedium.id === m.id ? styles.chipActive : undefined, isVacuum ? styles.chipDisabled : undefined]}
                onPress={() => setSelectedMedium(m)}
              >
                <Text style={[styles.chipText, !isVacuum && selectedMedium.id === m.id ? styles.chipTextActive : undefined]}>
                  {m.name} ({m.speed} m/s)
                </Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.controlHeader}>Frequency / Pitch (Hz):</Text>
          <View style={styles.btnRow}>
            {[150, 300, 440, 600, 880].map((f) => (
              <Pressable key={f} style={[styles.chip, frequency === f ? styles.chipActive : undefined]} onPress={() => setFrequency(f)}>
                <Text style={[styles.chipText, frequency === f ? styles.chipTextActive : undefined]}>{f} Hz</Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.controlHeader}>Vibration Amplitude (Loudness):</Text>
          <View style={styles.btnRow}>
            {[2, 4, 6, 8, 10].map((a) => (
              <Pressable key={a} style={[styles.chip, amplitude === a ? styles.chipActive : undefined]} onPress={() => setAmplitude(a)}>
                <Text style={[styles.chipText, amplitude === a ? styles.chipTextActive : undefined]}>{a} mm</Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.vacuumRow}>
            <View style={styles.vacuumTextGroup}>
              <Text style={styles.vacuumTitle}>Evacuate Chamber (Vacuum Pump)</Text>
              <Text style={styles.vacuumSub}>Remove all molecules around the sound source</Text>
            </View>
            <Switch
              value={isVacuum}
              onValueChange={setIsVacuum}
              thumbColor={isVacuum ? colors.rose : colors.textMuted}
              trackColor={{ false: colors.spaceElevated, true: 'rgba(244, 63, 94, 0.4)' }}
            />
          </View>
        </GlassCard>
      }
    >
      {() => (
        <Svg width='100%' height='100%' viewBox={'0 0 ' + svgWidth + ' ' + svgHeight}>
          <Rect
            x='15'
            y='20'
            width={svgWidth - 30}
            height={svgHeight - 40}
            rx='16'
            fill={isVacuum ? 'rgba(15, 23, 42, 0.95)' : 'rgba(15, 23, 42, 0.5)'}
            stroke={isVacuum ? colors.rose : 'rgba(56, 189, 248, 0.4)'}
            strokeWidth='2'
          />
          <SvgText x='28' y='42' fill={isVacuum ? colors.rose : colors.cyan} fontSize='10' fontWeight='bold'>
            {isVacuum ? 'VACUUM CHAMBER (NO MEDIUM • 0 m/s)' : selectedMedium.name.toUpperCase() + ' (v = ' + selectedMedium.speed + ' m/s)'}
          </SvgText>
          <Rect x='30' y='80' width='16' height='120' rx='4' fill='#78350F' stroke='#F59E0B' strokeWidth='2' />
          <Line x1='46' y1='85' x2='46' y2='195' stroke='#FDE047' strokeWidth={amplitude * 0.8} opacity='0.9' />
          <SvgText x='38' y='220' fill='#FDE047' fontSize='9' fontWeight='bold' textAnchor='middle'>DRUM</SvgText>
          {!isVacuum ? (
            <G>
              {Array.from({ length: cycleCount * 3 }).map((_, i) => {
                const spacingPx = (svgWidth - 140) / (cycleCount * 3);
                const xPos = 65 + i * spacingPx;
                const isCompression = i % 3 === 0;
                return (
                  <G key={i}>
                    {Array.from({ length: 9 }).map((_, row) => (
                      <Circle
                        key={row}
                        cx={xPos + (isCompression ? 0 : Math.sin(row) * 4)}
                        cy={90 + row * 12}
                        r={isCompression ? 2.5 : 1.2}
                        fill={isCompression ? colors.cyan : selectedMedium.particleColor}
                      />
                    ))}
                    {isCompression && (
                      <Line x1={xPos} y1='82' x2={xPos} y2='200' stroke='rgba(0, 229, 255, 0.4)' strokeWidth='1.5' strokeDasharray='2,3' />
                    )}
                  </G>
                );
              })}
              <SvgText x='90' y='72' fill={colors.cyan} fontSize='9' fontWeight='bold'>C (Compression)</SvgText>
              <SvgText x='150' y='72' fill={colors.textMuted} fontSize='9'>R (Rarefaction)</SvgText>
              <Path
                d={'M 65 240 Q ' + (65 + 30) + ' ' + (240 - amplitude * 2) + ' ' + (65 + 60) + ' 240 T ' + (65 + 120) + ' 240 T ' + (65 + 180) + ' 240'}
                fill='none'
                stroke={colors.amber}
                strokeWidth='2'
              />
              <SvgText x='65' y='260' fill={colors.amber} fontSize='8'>Pressure Waveform</SvgText>
            </G>
          ) : (
            <G>
              <SvgText x={svgWidth / 2 + 10} y='135' fill={colors.rose} fontSize='14' fontWeight='bold' textAnchor='middle'>
                NO PARTICLES IN VACUUM
              </SvgText>
              <SvgText x={svgWidth / 2 + 10} y='155' fill={colors.textSecondary} fontSize='10' textAnchor='middle'>
                Sound waves require a material medium to propagate
              </SvgText>
              <SvgText x={svgWidth / 2 + 10} y='175' fill={colors.textMuted} fontSize='9' textAnchor='middle'>
                Bell jar test: Silence in vacuum (v = 0 m/s)
              </SvgText>
            </G>
          )}
        </Svg>
      )}
    </SimulationWorkspace>
  );
};

const styles = StyleSheet.create({
  controlsCard: { marginTop: spacing.sm },
  controlHeader: { fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginBottom: spacing.xs, marginTop: spacing.xs },
  btnRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.xs },
  chip: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: radii.sm, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'transparent' },
  chipActive: { backgroundColor: 'rgba(0,229,255,0.12)', borderColor: colors.cyan },
  chipDisabled: { opacity: 0.3 },
  chipText: { fontSize: 11, color: colors.textSecondary },
  chipTextActive: { color: colors.textPrimary, fontWeight: 'bold' },
  vacuumRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)' },
  vacuumTextGroup: { flex: 1, marginRight: spacing.sm },
  vacuumTitle: { fontSize: 12, fontWeight: 'bold', color: colors.textPrimary },
  vacuumSub: { fontSize: 10, color: colors.textMuted, marginTop: 2 },
});