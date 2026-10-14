import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
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

export const MagnetismSimulation: React.FC = () => {
  const [compassAngleIndex, setCompassAngleIndex] = useState(1); // 0 to 4
  const [isBrokenInHalf, setIsBrokenInHalf] = useState(false);

  // Compass test positions around the bar magnet
  const compassPositions = [
    { label: 'Off North Pole', x: 50, y: 140, needleAngle: 180, desc: 'Repels compass N, attracts S' },
    { label: 'Top Field Loop', x: 170, y: 60, needleAngle: 0, desc: 'Parallel to magnet body (N → S)' },
    { label: 'Off South Pole', x: 290, y: 140, needleAngle: 0, desc: 'Attracts compass N, repels S' },
    { label: 'Bottom Field Loop', x: 170, y: 220, needleAngle: 0, desc: 'Parallel to magnet body (N → S)' },
  ];

  const currentCompass = compassPositions[compassAngleIndex];

  // SVG parameters
  const svgWidth = 340;
  const svgHeight = 280;
  const originX = svgWidth / 2;
  const originY = svgHeight / 2;

  return (
    <SimulationWorkspace
      title="Bar Magnet & Field Lines Lab"
      unitTag="Grade 8 Physics • Unit 7.6"
      telemetry={[
        { label: 'Compass Position', value: currentCompass.label, color: colors.cyan },
        { label: 'Field Direction', value: 'N (Out) → S (In)', color: colors.amber },
        { label: 'Magnetic Monopoles', value: 'IMPOSSIBLE', color: colors.rose },
        { label: 'Magnet State', value: isBrokenInHalf ? '2 Dipoles Formed' : 'Single Bar Dipole', color: colors.emerald },
      ]}
      instructions={[
        'Move the test compass to different locations around the bar magnet.',
        'Observe how the compass needle always points along the curved magnetic field lines from North to South.',
        'Tap "Cut Magnet in Half" to see whether a separate North or South pole can ever be created.',
        'Notice how two new North and South poles immediately appear at the cut boundary.',
      ]}
      controlsNode={
        <GlassCard variant="base" padding="md" style={styles.controlsCard}>
          {/* Compass Position Selector */}
          <Text style={styles.controlHeader}>Test Compass Position:</Text>
          <View style={styles.btnRow}>
            {compassPositions.map((pos, idx) => (
              <Pressable
                key={pos.label}
                style={[styles.chip, compassAngleIndex === idx ? styles.chipActive : undefined]}
                onPress={() => setCompassAngleIndex(idx)}
              >
                <Text style={[styles.chipText, compassAngleIndex === idx ? styles.chipTextActive : undefined]}>
                  {pos.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Cut Magnet in Half Toggle */}
          <View style={styles.cutRow}>
            <View style={styles.cutTextGroup}>
              <Text style={styles.cutTitle}>Cut Magnet in Half (Monopole Test)</Text>
              <Text style={styles.cutSub}>Physically divide the bar magnet across its center</Text>
            </View>
            <Pressable
              style={[styles.cutBtn, isBrokenInHalf ? styles.cutBtnBroken : styles.cutBtnIntact]}
              onPress={() => setIsBrokenInHalf((prev) => !prev)}
            >
              <Text style={styles.cutBtnText}>
                {isBrokenInHalf ? 'Rejoin Magnet' : 'Cut in Half'}
              </Text>
            </Pressable>
          </View>
        </GlassCard>
      }
    >
      {() => (
        <Svg width="100%" height="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
          {/* 1. Curved Magnetic Field Lines (Outer Loops) */}
          <G opacity="0.45">
            {/* Top wide loop */}
            <Path
              d="M 100 120 C 60 20 280 20 240 120"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="1.5"
              strokeDasharray="4,3"
            />
            {/* Top tight loop */}
            <Path
              d="M 115 120 C 90 60 250 60 225 120"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="1.5"
              strokeDasharray="4,3"
            />
            {/* Bottom tight loop */}
            <Path
              d="M 115 160 C 90 220 250 220 225 160"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="1.5"
              strokeDasharray="4,3"
            />
            {/* Bottom wide loop */}
            <Path
              d="M 100 160 C 60 260 280 260 240 160"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="1.5"
              strokeDasharray="4,3"
            />
            {/* Field directional arrowheads */}
            <SvgText x="170" y="32" fill="#38BDF8" fontSize="10" textAnchor="middle">
              → Magnetic Field (N to S) →
            </SvgText>
            <SvgText x="170" y="258" fill="#38BDF8" fontSize="10" textAnchor="middle">
              → Magnetic Field (N to S) →
            </SvgText>
          </G>

          {/* 2. Bar Magnet(s) Display */}
          {!isBrokenInHalf ? (
            /* Single Intact Bar Magnet */
            <G>
              {/* North Pole Half (Red, Left) */}
              <Rect x="90" y="120" width="80" height="40" rx="4" fill="#EF4444" stroke="#DC2626" strokeWidth="1.5" />
              <SvgText x="130" y="145" fill="#FFFFFF" fontSize="16" fontWeight="bold" textAnchor="middle">
                NORTH (N)
              </SvgText>

              {/* South Pole Half (Blue, Right) */}
              <Rect x="170" y="120" width="80" height="40" rx="4" fill="#2563EB" stroke="#1D4ED8" strokeWidth="1.5" />
              <SvgText x="210" y="145" fill="#FFFFFF" fontSize="16" fontWeight="bold" textAnchor="middle">
                SOUTH (S)
              </SvgText>

              <SvgText x="170" y="180" fill={colors.textSecondary} fontSize="10" textAnchor="middle">
                Permanent Bar Magnet (Magnetic Dipole)
              </SvgText>
            </G>
          ) : (
            /* Broken in Half: TWO Complete Dipole Magnets! */
            <G>
              {/* Left Magnet: [N | S] */}
              <Rect x="50" y="120" width="55" height="40" rx="3" fill="#EF4444" />
              <SvgText x="77" y="145" fill="#FFFFFF" fontSize="12" fontWeight="bold" textAnchor="middle">
                N
              </SvgText>
              <Rect x="105" y="120" width="55" height="40" rx="3" fill="#2563EB" />
              <SvgText x="132" y="145" fill="#FFFFFF" fontSize="12" fontWeight="bold" textAnchor="middle">
                S
              </SvgText>

              {/* Cut gap with scissors indicator */}
              <Line x1="165" y1="110" x2="165" y2="170" stroke="#FDE047" strokeWidth="2" strokeDasharray="3,2" />
              <SvgText x="170" y="105" fill="#FDE047" fontSize="9" fontWeight="bold" textAnchor="middle">
                FRACTURE
              </SvgText>

              {/* Right Magnet: [N | S] */}
              <Rect x="180" y="120" width="55" height="40" rx="3" fill="#EF4444" />
              <SvgText x="207" y="145" fill="#FFFFFF" fontSize="12" fontWeight="bold" textAnchor="middle">
                N
              </SvgText>
              <Rect x="235" y="120" width="55" height="40" rx="3" fill="#2563EB" />
              <SvgText x="262" y="145" fill="#FFFFFF" fontSize="12" fontWeight="bold" textAnchor="middle">
                S
              </SvgText>

              <SvgText x="170" y="180" fill={colors.emerald} fontSize="10" fontWeight="bold" textAnchor="middle">
                Two New Dipoles Created • No Monopoles Exist!
              </SvgText>
            </G>
          )}

          {/* 3. Interactive Test Compass */}
          <G>
            {/* Compass housing */}
            <Circle cx={currentCompass.x} cy={currentCompass.y} r="22" fill="#0F172A" stroke="#F59E0B" strokeWidth="2" />
            {/* Compass Needle (Red North tip, Silver South tip) */}
            <Line
              x1={currentCompass.x - 14}
              y1={currentCompass.y}
              x2={currentCompass.x}
              y2={currentCompass.y}
              stroke="#EF4444"
              strokeWidth="4"
            />
            <Line
              x1={currentCompass.x}
              y1={currentCompass.y}
              x2={currentCompass.x + 14}
              y2={currentCompass.y}
              stroke="#94A3B8"
              strokeWidth="4"
            />
            <Circle cx={currentCompass.x} cy={currentCompass.y} r="3" fill="#FEF08A" />
            <SvgText x={currentCompass.x - 10} y={currentCompass.y - 6} fill="#EF4444" fontSize="8" fontWeight="bold">
              N
            </SvgText>
            <SvgText x={currentCompass.x + 6} y={currentCompass.y - 6} fill="#94A3B8" fontSize="8" fontWeight="bold">
              S
            </SvgText>
          </G>
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
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: radii.sm,
    backgroundColor: colors.spaceElevated,
    borderWidth: 1,
    borderColor: colors.glassBorderSubtle,
    marginRight: 6,
    marginBottom: 6,
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
  cutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.glassBorderSubtle,
  },
  cutTextGroup: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  cutTitle: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  cutSub: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
  },
  cutBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radii.button,
    borderWidth: 1,
  },
  cutBtnIntact: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: colors.amber,
  },
  cutBtnBroken: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: colors.emerald,
  },
  cutBtnText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});
