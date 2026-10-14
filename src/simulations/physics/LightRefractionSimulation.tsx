import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, {
  Line,
  Circle,
  Polygon,
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

interface MediumConfig {
  name: string;
  n: number; // refractive index
  speed: string;
  color: string;
  fillOpacity: number;
}

const MEDIA: Record<'water' | 'glass' | 'diamond', MediumConfig> = {
  water: {
    name: 'Water',
    n: 1.333,
    speed: '2.25 × 10⁸ m/s',
    color: '#0284C7',
    fillOpacity: 0.25,
  },
  glass: {
    name: 'Crown Glass',
    n: 1.52,
    speed: '1.97 × 10⁸ m/s',
    color: '#38BDF8',
    fillOpacity: 0.35,
  },
  diamond: {
    name: 'Dense Diamond',
    n: 2.42,
    speed: '1.24 × 10⁸ m/s',
    color: '#A855F7',
    fillOpacity: 0.45,
  },
};

export const LightRefractionSimulation: React.FC = () => {
  const [angle1, setAngle1] = useState(45); // Angle of incidence (degrees)
  const [selectedMediumKey, setSelectedMediumKey] = useState<'water' | 'glass' | 'diamond'>('glass');
  const [labMode, setLabMode] = useState<'boundary' | 'prism'>('boundary');

  const selectedMedium = MEDIA[selectedMediumKey];
  const n1 = 1.0; // Air
  const n2 = selectedMedium.n;

  // Snell's Law calculation: n1 * sin(θ1) = n2 * sin(θ2)
  const rad1 = (angle1 * Math.PI) / 180;
  const sinTheta2 = (n1 * Math.sin(rad1)) / n2;
  const rad2 = Math.asin(Math.min(1, Math.max(-1, sinTheta2)));
  const angle2Deg = (rad2 * 180) / Math.PI;

  // SVG dimensions
  const svgWidth = 340;
  const svgHeight = 280;
  const boundaryY = 140; // Horizontal boundary between air and medium
  const originX = svgWidth / 2;
  const rayLength = 120;

  // Boundary coordinates
  const incX = originX - rayLength * Math.sin(rad1);
  const incY = boundaryY - rayLength * Math.cos(rad1);

  // Refracted ray travels down into medium (originX + rayLength * sin(rad2), boundaryY + rayLength * cos(rad2))
  const refX = originX + rayLength * Math.sin(rad2);
  const refY = boundaryY + rayLength * Math.cos(rad2);

  // Partial reflected ray back into air
  const partRefX = originX + rayLength * 0.7 * Math.sin(rad1);
  const partRefY = boundaryY - rayLength * 0.7 * Math.cos(rad1);

  return (
    <SimulationWorkspace
      title="Light Refraction & Prism Lab"
      unitTag="Grade 8 Physics • Unit 7.1B"
      telemetry={[
        { label: 'Incident Angle (θ₁)', value: `${angle1}°`, color: colors.cyan },
        { label: 'Refracted Angle (θ₂)', value: `${angle2Deg.toFixed(1)}°`, color: colors.amber },
        { label: 'Speed in Medium', value: selectedMedium.speed, color: colors.emerald },
        { label: 'Refractive Index (n₂)', value: `${selectedMedium.n}`, color: colors.violet },
      ]}
      instructions={[
        'Adjust the incident beam angle (θ₁) and observe how the ray bends upon entering the denser medium.',
        'Compare Water (n=1.33) vs Crown Glass (n=1.52) vs Diamond (n=2.42) to see how greater optical density increases bending.',
        'Observe that at θ₁ = 0° (normal incidence), light slows down but does NOT bend.',
        'Switch to "Prism Dispersion" mode to see how triangular geometry separates white light into the 7 rainbow spectrum colors.',
      ]}
      controlsNode={
        <GlassCard variant="base" padding="md" style={styles.controlsCard}>
          {/* Mode Switcher */}
          <View style={styles.tabRow}>
            <Pressable
              style={[styles.tabBtn, labMode === 'boundary' ? styles.tabBtnActive : undefined]}
              onPress={() => setLabMode('boundary')}
            >
              <Text
                style={[styles.tabBtnText, labMode === 'boundary' ? styles.tabBtnTextActive : undefined]}
              >
                Snell's Law Boundary
              </Text>
            </Pressable>
            <Pressable
              style={[styles.tabBtn, labMode === 'prism' ? styles.tabBtnActive : undefined]}
              onPress={() => setLabMode('prism')}
            >
              <Text
                style={[styles.tabBtnText, labMode === 'prism' ? styles.tabBtnTextActive : undefined]}
              >
                Prism Dispersion
              </Text>
            </Pressable>
          </View>

          {/* Stepper Controls (for Boundary Mode) */}
          {labMode === 'boundary' && (
            <>
              <View style={styles.stepperRow}>
                <Pressable
                  style={styles.stepBtn}
                  onPress={() => setAngle1((prev) => Math.max(0, prev - 5))}
                >
                  <Text style={styles.stepBtnText}>-5°</Text>
                </Pressable>
                <View style={styles.angleInfo}>
                  <Text style={styles.angleVal}>{angle1}°</Text>
                  <Text style={styles.angleLabel}>Angle of Incidence (θ₁)</Text>
                </View>
                <Pressable
                  style={styles.stepBtn}
                  onPress={() => setAngle1((prev) => Math.min(75, prev + 5))}
                >
                  <Text style={styles.stepBtnText}>+5°</Text>
                </Pressable>
              </View>

              {/* Medium Selection Chips */}
              <Text style={styles.mediumHeader}>Select Medium 2:</Text>
              <View style={styles.mediaRow}>
                {(['water', 'glass', 'diamond'] as const).map((key) => {
                  const m = MEDIA[key];
                  const isActive = selectedMediumKey === key;
                  return (
                    <Pressable
                      key={key}
                      style={[styles.mediumChip, isActive ? styles.mediumChipActive : undefined]}
                      onPress={() => setSelectedMediumKey(key)}
                    >
                      <Text style={[styles.mediumChipTitle, isActive ? styles.mediumChipTitleActive : undefined]}>
                        {m.name}
                      </Text>
                      <Text style={styles.mediumChipN}>n = {m.n}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </>
          )}
        </GlassCard>
      }
    >
      {() => (
        <Svg width="100%" height="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
          <Defs>
            <LinearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={selectedMedium.color} stopOpacity={selectedMedium.fillOpacity} />
              <Stop offset="100%" stopColor={selectedMedium.color} stopOpacity={selectedMedium.fillOpacity * 1.5} />
            </LinearGradient>
          </Defs>

          {labMode === 'boundary' ? (
            <G>
              {/* Top Half: Air (n=1.00) */}
              <Rect x="0" y="0" width={svgWidth} height={boundaryY} fill="rgba(15, 23, 42, 0.4)" />
              <SvgText x="14" y="24" fill={colors.textMuted} fontSize="11" fontWeight="bold">
                MEDIUM 1: AIR (n₁ = 1.000)
              </SvgText>

              {/* Bottom Half: Refracting Medium */}
              <Rect
                x="0"
                y={boundaryY}
                width={svgWidth}
                height={svgHeight - boundaryY}
                fill="url(#waterGrad)"
              />
              <SvgText x="14" y={boundaryY + 24} fill="#38BDF8" fontSize="11" fontWeight="bold">
                MEDIUM 2: {selectedMedium.name.toUpperCase()} (n₂ = {selectedMedium.n})
              </SvgText>

              {/* Boundary Interface Line */}
              <Line
                x1="0"
                y1={boundaryY}
                x2={svgWidth}
                y2={boundaryY}
                stroke="#64748B"
                strokeWidth="2"
              />

              {/* Normal Line (Perpendicular) */}
              <Line
                x1={originX}
                y1="10"
                x2={originX}
                y2={svgHeight - 10}
                stroke="#FDE047"
                strokeWidth="1.5"
                strokeDasharray="4,4"
              />
              <SvgText x={originX + 6} y="22" fill="#FDE047" fontSize="9" fontWeight="bold">
                NORMAL
              </SvgText>

              {/* Incident Ray (Cyan) */}
              <Line
                x1={incX}
                y1={incY}
                x2={originX}
                y2={boundaryY}
                stroke="#00E5FF"
                strokeWidth="3"
              />
              <Circle cx={incX} cy={incY} r="5" fill="#00E5FF" />
              <SvgText x={incX - 8} y={incY - 6} fill="#00E5FF" fontSize="10" textAnchor="end">
                θ₁={angle1}°
              </SvgText>

              {/* Partial Reflected Ray (Weak yellow) */}
              <Line
                x1={originX}
                y1={boundaryY}
                x2={partRefX}
                y2={partRefY}
                stroke="#F59E0B"
                strokeWidth="1.5"
                opacity="0.4"
                strokeDasharray="3,3"
              />

              {/* Refracted Ray (Amber, bent toward normal) */}
              <Line
                x1={originX}
                y1={boundaryY}
                x2={refX}
                y2={refY}
                stroke="#F59E0B"
                strokeWidth="3.5"
              />
              <Circle cx={refX} cy={refY} r="4" fill="#F59E0B" />
              <SvgText x={refX + 8} y={refY} fill="#F59E0B" fontSize="10" fontWeight="bold">
                θ₂={angle2Deg.toFixed(1)}°
              </SvgText>

              {/* Central Point of Incidence */}
              <Circle cx={originX} cy={boundaryY} r="4" fill="#FDE047" />
            </G>
          ) : (
            /* Prism Dispersion Lab Mode */
            <G>
              {/* Triangular Prism Geometry */}
              <Polygon
                points="170,40 70,240 270,240"
                fill="rgba(56, 189, 248, 0.18)"
                stroke="#38BDF8"
                strokeWidth="2"
              />
              <SvgText x="170" y="160" fill="rgba(255, 255, 255, 0.3)" fontSize="11" textAnchor="middle">
                GLASS PRISM
              </SvgText>

              {/* Incoming White Light Beam */}
              <Line x1="10" y1="180" x2="115" y2="150" stroke="#FFFFFF" strokeWidth="4" />
              <SvgText x="40" y="170" fill="#FFFFFF" fontSize="10" fontWeight="bold">
                WHITE LIGHT
              </SvgText>

              {/* Dispersed Colors Emerging on Right */}
              {[
                { name: 'Red', color: '#EF4444', endY: 130, dev: 'Least (Long λ)' },
                { name: 'Orange', color: '#F97316', endY: 145, dev: '' },
                { name: 'Yellow', color: '#EAB308', endY: 160, dev: '' },
                { name: 'Green', color: '#22C55E', endY: 175, dev: '' },
                { name: 'Blue', color: '#06B6D4', endY: 190, dev: '' },
                { name: 'Indigo', color: '#6366F1', endY: 205, dev: '' },
                { name: 'Violet', color: '#A855F7', endY: 220, dev: 'Most (Short λ)' },
              ].map((spectrum, idx) => (
                <G key={spectrum.name}>
                  {/* Inside prism ray */}
                  <Line
                    x1="115"
                    y1="150"
                    x2="215"
                    y2={130 + idx * 4}
                    stroke={spectrum.color}
                    strokeWidth="1.5"
                    opacity="0.8"
                  />
                  {/* Emerging spectrum ray */}
                  <Line
                    x1="215"
                    y1={130 + idx * 4}
                    x2={320}
                    y2={spectrum.endY}
                    stroke={spectrum.color}
                    strokeWidth="2"
                  />
                  <SvgText
                    x="325"
                    y={spectrum.endY + 3}
                    fill={spectrum.color}
                    fontSize="9"
                    fontWeight="bold"
                  >
                    {spectrum.name}
                  </SvgText>
                </G>
              ))}

              <SvgText x="270" y="115" fill="#EF4444" fontSize="8">
                Bends Least
              </SvgText>
              <SvgText x="270" y="245" fill="#A855F7" fontSize="8">
                Bends Most
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
  tabRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: radii.sm,
    backgroundColor: colors.spaceElevated,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    marginHorizontal: 3,
  },
  tabBtnActive: {
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    borderColor: colors.cyan,
  },
  tabBtnText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
  },
  tabBtnTextActive: {
    color: colors.cyan,
    fontWeight: '700',
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  stepBtn: {
    width: 44,
    height: 44,
    borderRadius: radii.button,
    backgroundColor: colors.spaceElevated,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepBtnText: {
    ...typography.scientificMono,
    fontSize: 14,
    fontWeight: '700',
    color: colors.cyan,
  },
  angleInfo: {
    alignItems: 'center',
  },
  angleVal: {
    ...typography.displayHero,
    fontSize: 26,
    color: colors.cyan,
    lineHeight: 30,
  },
  angleLabel: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textMuted,
  },
  mediumHeader: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  mediaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mediumChip: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: radii.sm,
    backgroundColor: colors.spaceElevated,
    borderWidth: 1,
    borderColor: colors.glassBorderSubtle,
    marginHorizontal: 3,
    alignItems: 'center',
  },
  mediumChipActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.18)',
    borderColor: colors.cyan,
  },
  mediumChipTitle: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  mediumChipTitleActive: {
    color: colors.cyan,
  },
  mediumChipN: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
});
