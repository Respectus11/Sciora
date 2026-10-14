import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, {
  Line,
  Circle,
  Rect,
  Text as SvgText,
  G,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import { SimulationWorkspace } from '@/components/simulation/SimulationWorkspace';
import { GlassCard } from '@/components/ui/GlassCard';
import { colors, spacing, typography, radii } from '@/design-system';

interface RodMaterial {
  id: string;
  name: string;
  k: number; // Thermal conductivity (W/m·K)
  color: string;
  pinsDropped: number; // 0 to 3
}

export const ThermalConductionSimulation: React.FC = () => {
  const [flameTemp, setFlameTemp] = useState(200); // degrees Celsius
  const [timeElapsed, setTimeElapsed] = useState(0); // seconds
  const [isHeating, setIsHeating] = useState(true);

  // Auto-advance heating timer unless paused
  useEffect(() => {
    let interval: any = null;
    if (isHeating && timeElapsed < 60) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => Math.min(60, prev + 1));
      }, 500); // 1 virtual second every 500ms
    }
    return () => clearInterval(interval);
  }, [isHeating, timeElapsed]);

  // Determine dropped pins based on thermal conduction rates (Fourier's law proxy)
  // Pin positions: 5cm (drop threshold ~100°C), 10cm, 15cm
  // Copper conducts fastest, Iron second, Glass third, Wood stays attached
  const copperPins = timeElapsed >= 15 ? 3 : timeElapsed >= 8 ? 2 : timeElapsed >= 3 ? 1 : 0;
  const ironPins = timeElapsed >= 35 ? 3 : timeElapsed >= 20 ? 2 : timeElapsed >= 10 ? 1 : 0;
  const glassPins = timeElapsed >= 50 ? 1 : 0;
  const woodPins = 0; // Insulator, never reaches 60°C at 5cm within 60s

  const svgWidth = 340;
  const svgHeight = 280;

  const rods = [
    { name: 'Copper (Metal)', k: 385, color: '#F97316', dropped: copperPins, y: 70 },
    { name: 'Iron (Metal)', k: 80, color: '#94A3B8', dropped: ironPins, y: 120 },
    { name: 'Glass (Ceramic)', k: 0.8, color: '#38BDF8', dropped: glassPins, y: 170 },
    { name: 'Wood (Organic)', k: 0.15, color: '#A16207', dropped: woodPins, y: 220 },
  ];

  const handleReset = () => {
    setTimeElapsed(0);
    setIsHeating(true);
  };

  return (
    <SimulationWorkspace
      title="Thermal Conduction Lab"
      unitTag="Grade 8 Physics • Unit 7.4"
      onReset={handleReset}
      telemetry={[
        { label: 'Time Elapsed', value: `${timeElapsed}`, unit: 's', color: colors.cyan },
        { label: 'Flame Temp', value: `${flameTemp}`, unit: '°C', color: colors.amber },
        { label: 'Copper Pins', value: `${copperPins} / 3`, color: colors.emerald },
        { label: 'Wood Pins', value: `${woodPins} / 3`, color: colors.rose },
      ]}
      instructions={[
        'Watch heat conduct from left to right along the 4 material rods.',
        'Pins are held by candle wax that melts at 60°C.',
        'Observe how quickly pins fall from Copper (high thermal conductivity) compared to Iron, Glass, and Wood.',
        'Adjust the Flame Temperature slider to see how higher thermal gradients speed up heat diffusion.',
      ]}
      controlsNode={
        <GlassCard variant="base" padding="md" style={styles.controlsCard}>
          <View style={styles.controlsRow}>
            <View style={styles.tempSelector}>
              <Text style={styles.controlHeader}>Flame Heat Source:</Text>
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
              style={[styles.timerToggleBtn, !isHeating ? styles.timerToggleBtnActive : undefined]}
              onPress={() => setIsHeating((prev) => !prev)}
            >
              <Text style={styles.timerToggleText}>{isHeating ? 'Pause Timer' : 'Resume Timer'}</Text>
            </Pressable>
          </View>
        </GlassCard>
      }
    >
      {() => (
        <Svg width="100%" height="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
          <Defs>
            {/* Heat gradient for Copper */}
            <LinearGradient id="copperHeat" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#EF4444" stopOpacity="1" />
              <Stop offset={`${Math.min(100, timeElapsed * 2.5)}%`} stopColor="#F59E0B" stopOpacity="0.8" />
              <Stop offset="100%" stopColor="#78350F" stopOpacity="0.3" />
            </LinearGradient>
          </Defs>

          {/* Left Vertical Flame Heating Manifold */}
          <Rect x="20" y="50" width="16" height="190" rx="4" fill="#EF4444" opacity="0.85" />
          <Circle cx="28" cy="145" r="14" fill="#F59E0B" opacity="0.6" />
          <SvgText x="28" y="255" fill="#EF4444" fontSize="9" fontWeight="bold" textAnchor="middle">
            FLAME ({flameTemp}°C)
          </SvgText>

          {/* Pin Position Guides at 5cm, 10cm, 15cm */}
          {[100, 180, 260].map((xPos, idx) => (
            <G key={xPos}>
              <Line
                x1={xPos}
                y1="40"
                x2={xPos}
                y2="240"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeDasharray="2,3"
              />
              <SvgText x={xPos} y="34" fill={colors.textMuted} fontSize="8" textAnchor="middle">
                {(idx + 1) * 5}cm
              </SvgText>
            </G>
          ))}

          {/* Render 4 Rods */}
          {rods.map((rod) => {
            return (
              <G key={rod.name}>
                {/* Rod Cylinder */}
                <Rect
                  x="36"
                  y={rod.y - 4}
                  width="280"
                  height="8"
                  rx="3"
                  fill={rod.name.startsWith('Copper') ? 'url(#copperHeat)' : rod.color}
                  opacity="0.85"
                />

                {/* Rod Name & Conductivity */}
                <SvgText x="40" y={rod.y - 8} fill={colors.textSecondary} fontSize="9" fontWeight="bold">
                  {rod.name} (k={rod.k})
                </SvgText>

                {/* 3 Wax Pins along the rod */}
                {[100, 180, 260].map((pinX, pIdx) => {
                  const isDropped = pIdx < rod.dropped;
                  const pinHeadY = isDropped ? rod.y + 24 : rod.y + 4;

                  return (
                    <G key={pIdx}>
                      {/* Wax dab */}
                      <Circle cx={pinX} cy={rod.y + 4} r="3" fill="#FEF08A" opacity={isDropped ? 0.2 : 0.9} />
                      {/* Metal Pin (Drops down if melted) */}
                      <Line
                        x1={pinX}
                        y1={pinHeadY}
                        x2={pinX}
                        y2={pinHeadY + 12}
                        stroke={isDropped ? colors.rose : '#E2E8F0'}
                        strokeWidth="1.5"
                      />
                      <Circle
                        cx={pinX}
                        cy={pinHeadY + 12}
                        r="2"
                        fill={isDropped ? colors.rose : '#E2E8F0'}
                      />
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
  controlsCard: {
    borderColor: 'rgba(0, 229, 255, 0.25)',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tempSelector: {
    flex: 1,
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
    paddingHorizontal: 10,
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
    fontSize: 11,
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.cyan,
    fontWeight: '700',
  },
  timerToggleBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radii.sm,
    backgroundColor: colors.spaceElevated,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  timerToggleBtnActive: {
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    borderColor: colors.cyan,
  },
  timerToggleText: {
    ...typography.caption,
    color: colors.cyan,
    fontWeight: '600',
  },
});
