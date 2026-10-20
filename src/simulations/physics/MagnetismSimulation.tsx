import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, {
  Line,
  Circle,
  Rect,
  Path,
  Text as SvgText,
  G,
  Polygon,
} from 'react-native-svg';
import { SimulationWorkspace } from '@/components/simulation/SimulationWorkspace';
import { GlassCard } from '@/components/ui/GlassCard';
import { colors, spacing, typography, radii } from '@/design-system';

interface TestMaterial {
  id: string;
  name: string;
  symbol: string;
  category: 'Ferromagnetic' | 'Paramagnetic' | 'Diamagnetic' | 'Non-magnetic';
  isAttracted: boolean;
  attractionForce: number; // 0 to 100
  color: string;
  explanation: string;
}

const MATERIALS: TestMaterial[] = [
  {
    id: 'iron',
    name: 'Iron Nail',
    symbol: 'Fe',
    category: 'Ferromagnetic',
    isAttracted: true,
    attractionForce: 98,
    color: '#94A3B8',
    explanation: 'Contains permanent magnetic domains that align strongly with the external field.',
  },
  {
    id: 'nickel',
    name: 'Nickel Coin',
    symbol: 'Ni',
    category: 'Ferromagnetic',
    isAttracted: true,
    attractionForce: 72,
    color: '#CBD5E1',
    explanation: 'Ferromagnetic transition metal; experiences strong magnetic attraction.',
  },
  {
    id: 'aluminum',
    name: 'Aluminum Foil',
    symbol: 'Al',
    category: 'Paramagnetic',
    isAttracted: false,
    attractionForce: 0,
    color: '#E2E8F0',
    explanation: 'Paramagnetic with negligible susceptibility; will not cling to a bar magnet.',
  },
  {
    id: 'copper',
    name: 'Copper Wire',
    symbol: 'Cu',
    category: 'Diamagnetic',
    isAttracted: false,
    attractionForce: 0,
    color: '#F97316',
    explanation: 'Diamagnetic; weakly repelled by magnetic fields in laboratory micro-scales, effectively non-magnetic.',
  },
  {
    id: 'wood',
    name: 'Wood Splint',
    symbol: 'Wood',
    category: 'Non-magnetic',
    isAttracted: false,
    attractionForce: 0,
    color: '#B45309',
    explanation: 'Organic insulator with completely paired electrons and zero magnetic domains.',
  },
];

export const MagnetismSimulation: React.FC = () => {
  const [compassAngleIndex, setCompassAngleIndex] = useState(1); // 0 to 3
  const [isBrokenInHalf, setIsBrokenInHalf] = useState(false);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('iron');
  const [materialDistance, setMaterialDistance] = useState<'far' | 'near'>('near');

  // Compass test positions around the bar magnet
  const compassPositions = [
    { label: 'Off North Pole', x: 50, y: 140, needleAngle: 180, desc: 'Repels compass N, attracts S' },
    { label: 'Top Field Loop', x: 170, y: 60, needleAngle: 0, desc: 'Parallel to magnet body (N -> S)' },
    { label: 'Off South Pole', x: 290, y: 140, needleAngle: 0, desc: 'Attracts compass N, repels S' },
    { label: 'Bottom Field Loop', x: 170, y: 220, needleAngle: 0, desc: 'Parallel to magnet body (N -> S)' },
  ];

  const currentCompass = compassPositions[compassAngleIndex];
  const activeMaterial = MATERIALS.find((m) => m.id === selectedMaterialId) || MATERIALS[0];

  // SVG parameters
  const svgWidth = 360;
  const svgHeight = 290;

  // Material coordinate based on distance
  const matX = materialDistance === 'near' ? 275 : 325;
  const matY = 195;

  return (
    <SimulationWorkspace
      title="Bar Magnet, Field Lines & Materials Lab"
      unitTag="Grade 8 Physics • Unit 7.6"
      telemetry={[
        { label: 'Compass Position', value: currentCompass.label, color: colors.cyan },
        { label: 'Test Sample', value: activeMaterial.name, color: colors.amber },
        { label: 'Classification', value: activeMaterial.category, color: activeMaterial.isAttracted ? colors.emerald : colors.rose },
        { label: 'Attraction Force', value: `${activeMaterial.attractionForce}%`, color: activeMaterial.isAttracted ? colors.emerald : colors.textMuted },
        { label: 'Monopole Rule', value: isBrokenInHalf ? '2 Dipoles Formed' : 'Single Dipole', color: colors.violet },
      ]}
      instructions={[
        'Move the test compass to different locations around the bar magnet to trace field vectors.',
        'Observe how the compass needle always aligns tangentially with field lines from North to South.',
        'Select different materials (Iron, Nickel, Aluminum, Copper, Wood) to test magnetic susceptibility.',
        'Tap "Cut Magnet in Half" to verify whether isolated magnetic monopoles can ever exist.',
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

          {/* Materials Tray */}
          <Text style={[styles.controlHeader, { marginTop: spacing.xs }]}>
            Materials Tray (Magnetic Susceptibility Test):
          </Text>
          <View style={styles.btnRow}>
            {MATERIALS.map((mat) => {
              const isSelected = mat.id === selectedMaterialId;
              return (
                <Pressable
                  key={mat.id}
                  style={[
                    styles.chip,
                    isSelected ? styles.chipActive : undefined,
                    isSelected && mat.isAttracted ? { borderColor: colors.emerald } : undefined,
                  ]}
                  onPress={() => setSelectedMaterialId(mat.id)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      isSelected ? styles.chipTextActive : undefined,
                      isSelected && mat.isAttracted ? { color: colors.emerald } : undefined,
                    ]}
                  >
                    {mat.name} ({mat.symbol})
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Proximity Toggle */}
          <View style={styles.distanceRow}>
            <Text style={styles.distanceLabel}>Sample Distance to Pole:</Text>
            <View style={styles.toggleGroup}>
              <Pressable
                style={[styles.toggleBtn, materialDistance === 'near' && styles.toggleBtnActive]}
                onPress={() => setMaterialDistance('near')}
              >
                <Text style={[styles.toggleText, materialDistance === 'near' && styles.toggleTextActive]}>
                  Near (5 cm)
                </Text>
              </Pressable>
              <Pressable
                style={[styles.toggleBtn, materialDistance === 'far' && styles.toggleBtnActive]}
                onPress={() => setMaterialDistance('far')}
              >
                <Text style={[styles.toggleText, materialDistance === 'far' && styles.toggleTextActive]}>
                  Far (20 cm)
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Explanation Banner */}
          <View style={styles.explanationBox}>
            <Text style={styles.explanationTitle}>
              {activeMaterial.name} ({activeMaterial.category}):
            </Text>
            <Text style={styles.explanationBody}>{activeMaterial.explanation}</Text>
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
          <G opacity="0.5">
            {/* Top wide loop */}
            <Path
              d="M 100 120 C 60 15 280 15 240 120"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="1.5"
              strokeDasharray="4,3"
            />
            {/* Top tight loop */}
            <Path
              d="M 115 120 C 90 55 250 55 225 120"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="1.5"
              strokeDasharray="4,3"
            />
            {/* Bottom tight loop */}
            <Path
              d="M 115 160 C 90 225 250 225 225 160"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="1.5"
              strokeDasharray="4,3"
            />
            {/* Bottom wide loop */}
            <Path
              d="M 100 160 C 60 265 280 265 240 160"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="1.5"
              strokeDasharray="4,3"
            />
            {/* Tangent arrows on loops */}
            <Polygon points="170,23 175,28 165,28" fill="#38BDF8" transform="rotate(90, 170, 26)" />
            <Polygon points="170,63 175,68 165,68" fill="#38BDF8" transform="rotate(90, 170, 66)" />
            <Polygon points="170,217 175,222 165,222" fill="#38BDF8" transform="rotate(90, 170, 220)" />
            <Polygon points="170,257 175,262 165,262" fill="#38BDF8" transform="rotate(90, 170, 260)" />

            <SvgText x="170" y="20" fill="#38BDF8" fontSize="9" textAnchor="middle">
              Field Direction: North -&gt; South
            </SvgText>
          </G>

          {/* 2. Primary Bar Magnet(s) */}
          {!isBrokenInHalf ? (
            <G id="single-magnet">
              {/* North Pole (Red) */}
              <Rect x="90" y="120" width="80" height="40" fill="#EF4444" rx="4" />
              <SvgText x="130" y="145" fill="#FFFFFF" fontSize="16" fontWeight="bold" textAnchor="middle">
                N
              </SvgText>
              {/* South Pole (Blue) */}
              <Rect x="170" y="120" width="80" height="40" fill="#3B82F6" rx="4" />
              <SvgText x="210" y="145" fill="#FFFFFF" fontSize="16" fontWeight="bold" textAnchor="middle">
                S
              </SvgText>
            </G>
          ) : (
            <G id="broken-magnets">
              {/* Left Half (became complete dipole) */}
              <Rect x="60" y="120" width="45" height="40" fill="#EF4444" rx="3" />
              <SvgText x="82" y="145" fill="#FFFFFF" fontSize="13" fontWeight="bold" textAnchor="middle">
                N
              </SvgText>
              <Rect x="105" y="120" width="45" height="40" fill="#3B82F6" rx="3" />
              <SvgText x="127" y="145" fill="#FFFFFF" fontSize="13" fontWeight="bold" textAnchor="middle">
                S
              </SvgText>

              {/* Right Half (became complete dipole) */}
              <Rect x="190" y="120" width="45" height="40" fill="#EF4444" rx="3" />
              <SvgText x="212" y="145" fill="#FFFFFF" fontSize="13" fontWeight="bold" textAnchor="middle">
                N
              </SvgText>
              <Rect x="235" y="120" width="45" height="40" fill="#3B82F6" rx="3" />
              <SvgText x="257" y="145" fill="#FFFFFF" fontSize="13" fontWeight="bold" textAnchor="middle">
                S
              </SvgText>

              {/* Cut gap indicator */}
              <Line x1="170" y1="105" x2="170" y2="175" stroke="#F59E0B" strokeWidth="2" strokeDasharray="3,3" />
              <SvgText x="170" y="100" fill="#F59E0B" fontSize="9" textAnchor="middle">
                Cut Surface
              </SvgText>
            </G>
          )}

          {/* 3. Materials Test Station */}
          <G id="materials-test-station">
            {/* Sample holder */}
            <Rect
              x={matX}
              y={matY}
              width="44"
              height="36"
              fill={activeMaterial.color}
              rx="4"
              stroke={activeMaterial.isAttracted ? '#10B981' : '#64748B'}
              strokeWidth="2"
              opacity="0.9"
            />
            <SvgText
              x={matX + 22}
              y={matY + 22}
              fill="#0F172A"
              fontSize="11"
              fontWeight="bold"
              textAnchor="middle"
            >
              {activeMaterial.symbol}
            </SvgText>
            <SvgText
              x={matX + 22}
              y={matY + 46}
              fill="#94A3B8"
              fontSize="8"
              textAnchor="middle"
            >
              {activeMaterial.name}
            </SvgText>

            {/* Attraction Force Lines if ferromagnetic & near */}
            {activeMaterial.isAttracted && (
              <G opacity={materialDistance === 'near' ? '1' : '0.4'}>
                <Line
                  x1="250"
                  y1="150"
                  x2={matX}
                  y2={matY + 18}
                  stroke="#10B981"
                  strokeWidth="2"
                  strokeDasharray="2,2"
                />
                <SvgText
                  x={(250 + matX) / 2}
                  y={(150 + matY) / 2 - 4}
                  fill="#10B981"
                  fontSize="8"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  F = {materialDistance === 'near' ? activeMaterial.attractionForce : Math.round(activeMaterial.attractionForce * 0.25)}%
                </SvgText>
              </G>
            )}
          </G>

          {/* 4. Movable Testing Compass */}
          <G transform={`translate(${currentCompass.x}, ${currentCompass.y})`}>
            {/* Compass Outer Ring */}
            <Circle cx="0" cy="0" r="24" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />
            <Circle cx="0" cy="0" r="2" fill="#FFFFFF" />

            {/* Needle Pivot Group */}
            <G transform={`rotate(${currentCompass.needleAngle})`}>
              {/* North Needle (Red - points towards magnetic south) */}
              <Polygon points="0,-20 5,-2 -5,-2" fill="#EF4444" />
              {/* South Needle (Silver/Blue - points away) */}
              <Polygon points="0,20 5,2 -5,2" fill="#94A3B8" />
            </G>
            <SvgText x="0" y="32" fill="#FFFFFF" fontSize="8" textAnchor="middle">
              Compass
            </SvgText>
          </G>
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
  btnRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: radii.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
  distanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  distanceLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
  },
  toggleGroup: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: radii.sm,
    padding: 2,
  },
  toggleBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radii.sm - 2,
  },
  toggleBtnActive: {
    backgroundColor: colors.cyan,
  },
  toggleText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textSecondary,
  },
  toggleTextActive: {
    color: colors.spaceDark,
    fontWeight: '700',
  },
  explanationBox: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: radii.sm,
    padding: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.cyan,
  },
  explanationTitle: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.cyan,
    marginBottom: 2,
  },
  explanationBody: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 15,
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
