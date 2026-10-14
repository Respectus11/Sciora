import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Switch } from 'react-native';
import Svg, {
  Line,
  Circle,
  Rect,
  Path,
  Text as SvgText,
  G,
} from 'react-native-svg';
import { SimulationWorkspace } from '@/components/simulation/SimulationWorkspace';
import { GlassCard } from '@/components/ui/GlassCard';
import { colors, spacing, typography, radii } from '@/design-system';

export const SoundWaveSimulation: React.FC = () => {
  const [frequency, setFrequency] = useState(440); // Standard concert A (Hz)
  const [amplitude, setAmplitude] = useState(5); // Amplitude in mm (1 to 10)
  const [isVacuum, setIsVacuum] = useState(false); // Bell-jar vacuum chamber toggle

  // Physical wave calculations
  const speedOfSound = 340; // m/s in air
  const wavelength = isVacuum ? 0 : speedOfSound / frequency; // λ = v / f in meters
  const decibels = isVacuum ? 0 : Math.round(40 + amplitude * 5); // Rough dB estimate

  // SVG parameters
  const svgWidth = 340;
  const svgHeight = 280;

  // Number of wave cycles visible on screen (proportional to frequency)
  const cycleCount = Math.max(2, Math.min(8, Math.round(frequency / 100)));

  return (
    <SimulationWorkspace
      title="Acoustic Vibration & Vacuum Lab"
      unitTag="Grade 8 Physics • Unit 7.3"
      telemetry={[
        { label: 'Frequency (Pitch)', value: `${frequency}`, unit: 'Hz', color: colors.cyan },
        { label: 'Amplitude (Loudness)', value: `${amplitude}`, unit: 'mm', color: colors.amber },
        { label: 'Wavelength (λ)', value: isVacuum ? '0.00' : `${wavelength.toFixed(2)}`, unit: 'm', color: colors.violet },
        { label: 'Sound Output', value: isVacuum ? '0 (SILENCE)' : `${decibels} dB`, color: isVacuum ? colors.rose : colors.emerald },
      ]}
      instructions={[
        'Adjust Frequency (100–1000 Hz) to observe pitch: higher frequency produces tightly packed waves.',
        'Adjust Amplitude (1–10 mm) to see loudness: greater amplitude produces more vigorous vibrations.',
        'Toggle the "Evacuate Air (Vacuum Chamber)" switch to test whether sound can travel without a medium.',
      ]}
      controlsNode={
        <GlassCard variant="base" padding="md" style={styles.controlsCard}>
          {/* Frequency (Pitch) Controller */}
          <Text style={styles.controlHeader}>Frequency / Pitch (Hz):</Text>
          <View style={styles.btnRow}>
            {[150, 300, 440, 600, 880].map((f) => (
              <Pressable
                key={f}
                style={[styles.chip, frequency === f ? styles.chipActive : undefined]}
                onPress={() => setFrequency(f)}
              >
                <Text style={[styles.chipText, frequency === f ? styles.chipTextActive : undefined]}>
                  {f} Hz
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Amplitude (Loudness) Controller */}
          <Text style={styles.controlHeader}>Vibration Amplitude (Loudness):</Text>
          <View style={styles.btnRow}>
            {[2, 4, 6, 8, 10].map((a) => (
              <Pressable
                key={a}
                style={[styles.chip, amplitude === a ? styles.chipActive : undefined]}
                onPress={() => setAmplitude(a)}
              >
                <Text style={[styles.chipText, amplitude === a ? styles.chipTextActive : undefined]}>
                  {a} mm {a >= 8 ? '(Loud)' : a <= 2 ? '(Soft)' : ''}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Bell-jar Vacuum Chamber Switch */}
          <View style={styles.vacuumRow}>
            <View style={styles.vacuumTextGroup}>
              <Text style={styles.vacuumTitle}>Evacuate Chamber (Vacuum Pump)</Text>
              <Text style={styles.vacuumSub}>Remove all air molecules around the sound source</Text>
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
        <Svg width="100%" height="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
          {/* Vacuum Glass Bell Jar Outline */}
          <Rect
            x="15"
            y="20"
            width={svgWidth - 30}
            height={svgHeight - 40}
            rx="16"
            fill={isVacuum ? 'rgba(15, 23, 42, 0.95)' : 'rgba(15, 23, 42, 0.5)'}
            stroke={isVacuum ? colors.rose : 'rgba(56, 189, 248, 0.4)'}
            strokeWidth="2"
          />
          <SvgText
            x="28"
            y="42"
            fill={isVacuum ? colors.rose : colors.cyan}
            fontSize="10"
            fontWeight="bold"
          >
            {isVacuum ? 'VACUUM CHAMBER (AIR EVACUATED • 0 kPa)' : 'NORMAL AIR PRESSURE (101.3 kPa)'}
          </SvgText>

          {/* Left: Ethiopian Kebero Drumhead / Vibrating Source */}
          <Rect x="30" y="80" width="16" height="120" rx="4" fill="#78350F" stroke="#F59E0B" strokeWidth="2" />
          <Line
            x1="46"
            y1="85"
            x2="46"
            y2="195"
            stroke="#FDE047"
            strokeWidth={amplitude * 0.8}
            opacity="0.9"
          />
          <SvgText x="38" y="220" fill="#FDE047" fontSize="9" fontWeight="bold" textAnchor="middle">
            DRUM
          </SvgText>

          {/* Longitudinal Pressure Waves or Vacuum State */}
          {!isVacuum ? (
            <G>
              {/* Compressions (dark dense vertical lines) & Rarefactions (faint sparse lines) */}
              {Array.from({ length: cycleCount * 3 }).map((_, i) => {
                const spacingPx = (svgWidth - 140) / (cycleCount * 3);
                const xPos = 65 + i * spacingPx;
                const isCompression = i % 3 === 0;

                return (
                  <G key={i}>
                    {/* Air particle dots in this wavefront */}
                    {Array.from({ length: 9 }).map((_, row) => {
                      const yPos = 90 + row * 12;
                      return (
                        <Circle
                          key={row}
                          cx={xPos + (isCompression ? 0 : Math.sin(row) * 4)}
                          cy={yPos}
                          r={isCompression ? 2.5 : 1.2}
                          fill={isCompression ? colors.cyan : 'rgba(255, 255, 255, 0.25)'}
                        />
                      );
                    })}

                    {/* Compression wavefront indicator line */}
                    {isCompression && (
                      <Line
                        x1={xPos}
                        y1="82"
                        x2={xPos}
                        y2="200"
                        stroke="rgba(0, 229, 255, 0.4)"
                        strokeWidth="1.5"
                        strokeDasharray="2,3"
                      />
                    )}
                  </G>
                );
              })}

              {/* Compression / Rarefaction Labels */}
              <SvgText x="90" y="72" fill={colors.cyan} fontSize="9" fontWeight="bold">
                C (Compression)
              </SvgText>
              <SvgText x="145" y="72" fill={colors.textMuted} fontSize="9">
                R (Rarefaction)
              </SvgText>

              {/* Sine Wave Curve Representation Underneath */}
              <Path
                d={`M 65 240 Q ${65 + 30} ${240 - amplitude * 2} ${65 + 60} 240 T ${65 + 120} 240 T ${65 + 180} 240`}
                fill="none"
                stroke={colors.amber}
                strokeWidth="2"
              />
              <SvgText x="65" y="260" fill={colors.amber} fontSize="8">
                Pressure Waveform
              </SvgText>
            </G>
          ) : (
            /* Vacuum State Display */
            <G>
              <SvgText
                x={svgWidth / 2 + 10}
                y="135"
                fill={colors.rose}
                fontSize="14"
                fontWeight="bold"
                textAnchor="middle"
              >
                NO PARTICLES IN VACUUM
              </SvgText>
              <SvgText
                x={svgWidth / 2 + 10}
                y="155"
                fill={colors.textSecondary}
                fontSize="10"
                textAnchor="middle"
              >
                Vibrations cannot propagate without a material medium
              </SvgText>
              <SvgText
                x={svgWidth / 2 + 10}
                y="175"
                fill={colors.textMuted}
                fontSize="9"
                textAnchor="middle"
              >
                Sound Energy = 0.00 Joules at Listener
              </SvgText>
            </G>
          )}

          {/* Right: Human Ear / Sensor Icon */}
          <Path
            d="M 285 110 C 300 110 305 125 300 140 C 295 155 300 165 292 170"
            fill="none"
            stroke={isVacuum ? colors.textMuted : colors.emerald}
            strokeWidth="3"
          />
          <SvgText
            x="294"
            y="185"
            fill={isVacuum ? colors.textMuted : colors.emerald}
            fontSize="9"
            fontWeight="bold"
            textAnchor="middle"
          >
            {isVacuum ? 'SILENCE' : 'HEARS SOUND'}
          </SvgText>
        </Svg>
      )}
    </SimulationWorkspace>
  );
};

const styles = StyleSheet.create({
  controlsCard: {
    borderColor: 'rgba(0, 229, 255, 0.25)',
  },
  controlHeader: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: radii.sm,
    backgroundColor: colors.spaceElevated,
    borderWidth: 1,
    borderColor: colors.glassBorderSubtle,
    alignItems: 'center',
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
  vacuumRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.glassBorderSubtle,
  },
  vacuumTextGroup: {
    flex: 1,
    paddingRight: spacing.md,
  },
  vacuumTitle: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  vacuumSub: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
  },
});
