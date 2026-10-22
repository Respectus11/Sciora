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
  id: string;
  name: string;
  n: number;
  speed: string;
  color: string;
  criticalAngleDeg: number;
  fillOpacity: number;
}

const MEDIA: MediumConfig[] = [
  {
    id: 'water',
    name: 'Water',
    n: 1.333,
    speed: '2.25 × 10⁸ m/s',
    color: '#0284C7',
    criticalAngleDeg: 48.6,
    fillOpacity: 0.25,
  },
  {
    id: 'crown-glass',
    name: 'Crown Glass',
    n: 1.520,
    speed: '1.97 × 10⁸ m/s',
    color: '#38BDF8',
    criticalAngleDeg: 41.1,
    fillOpacity: 0.35,
  },
  {
    id: 'flint-glass',
    name: 'Flint Glass',
    n: 1.660,
    speed: '1.81 × 10⁸ m/s',
    color: '#818CF8',
    criticalAngleDeg: 37.0,
    fillOpacity: 0.40,
  },
  {
    id: 'diamond',
    name: 'Diamond',
    n: 2.417,
    speed: '1.24 × 10⁸ m/s',
    color: '#C084FC',
    criticalAngleDeg: 24.4,
    fillOpacity: 0.48,
  },
];

export const LightRefractionSimulation: React.FC = () => {
  const [angle1, setAngle1] = useState(45); // Angle of incidence (degrees)
  const [selectedMediumId, setSelectedMediumId] = useState<string>('crown-glass');
  const [labMode, setLabMode] = useState<'boundary' | 'prism'>('boundary');

  const selectedMedium = MEDIA.find((m) => m.id === selectedMediumId) || MEDIA[1];
  const n1 = 1.0; // Air
  const n2 = selectedMedium.n;

  // Snell's Law calculation: n1 * sin(θ1) = n2 * sin(θ2)
  const rad1 = (angle1 * Math.PI) / 180;
  const sinTheta2 = (n1 * Math.sin(rad1)) / n2;
  const rad2 = Math.asin(Math.min(1, Math.max(-1, sinTheta2)));
  const angle2Deg = (rad2 * 180) / Math.PI;

  // SVG dimensions
  const svgWidth = 360;
  const svgHeight = 290;
  const boundaryY = 145; // Horizontal boundary
  const originX = svgWidth / 2;
  const rayLength = 125;

  // Boundary coordinates
  const incX = originX - rayLength * Math.sin(rad1);
  const incY = boundaryY - rayLength * Math.cos(rad1);

  // Refracted ray travels down into medium
  const refX = originX + rayLength * Math.sin(rad2);
  const refY = boundaryY + rayLength * Math.cos(rad2);

  // Partial reflected ray back into air
  const partRefX = originX + rayLength * 0.75 * Math.sin(rad1);
  const partRefY = boundaryY - rayLength * 0.75 * Math.cos(rad1);

  // Optical bending delta
  const bendingDelta = Math.abs(angle1 - angle2Deg);

  return (
    <SimulationWorkspace
      title="Light Refraction, Snell's Law & Prism Lab"
      unitTag="Grade 8 Physics • Unit 7.1B"
      telemetry={[
        { label: 'Incidence (θ₁)', value: `${angle1}°`, color: colors.cyan },
        { label: 'Refraction (θ₂)', value: `${angle2Deg.toFixed(1)}°`, color: colors.amber },
        { label: 'Bending Toward Normal', value: `Δθ = -${bendingDelta.toFixed(1)}°`, color: colors.emerald },
        { label: 'Light Speed in Medium', value: selectedMedium.speed, color: colors.emerald },
        { label: 'Critical Angle (θc)', value: `${selectedMedium.criticalAngleDeg}°`, color: colors.violet },
      ]}
      instructions={[
        'Adjust the incident beam angle (θ₁) and observe the light bend towards the normal as it slows down.',
        'Compare Water (n=1.33) vs Crown Glass (n=1.52) vs Flint Glass (n=1.66) vs Diamond (n=2.42).',
        'Notice that at normal incidence (θ₁ = 0°), the ray does NOT bend even though velocity decreases.',
        'Toggle to "Prism Dispersion" to explore chromatic dispersion, where violet bends more than red.',
      ]}
      controlsNode={
        <GlassCard variant="base" padding="md" style={styles.controlsCard}>
          {/* Mode Switcher */}
          <View style={styles.tabRow}>
            <Pressable
              style={[styles.tabBtn, labMode === 'boundary' && styles.tabBtnActive]}
              onPress={() => setLabMode('boundary')}
            >
              <Text style={[styles.tabBtnText, labMode === 'boundary' && styles.tabBtnTextActive]}>
                Snell&apos;s Law Boundary
              </Text>
            </Pressable>
            <Pressable
              style={[styles.tabBtn, labMode === 'prism' && styles.tabBtnActive]}
              onPress={() => setLabMode('prism')}
            >
              <Text style={[styles.tabBtnText, labMode === 'prism' && styles.tabBtnTextActive]}>
                Prism Dispersion (Rainbow)
              </Text>
            </Pressable>
          </View>

          {labMode === 'boundary' ? (
            <>
              {/* Stepper Controls */}
              <View style={styles.stepperRow}>
                <Pressable
                  style={styles.stepBtn}
                  onPress={() => setAngle1((prev) => Math.max(0, prev - 5))}
                >
                  <Text style={styles.stepBtnText}>-5°</Text>
                </Pressable>
                <Pressable
                  style={styles.stepBtn}
                  onPress={() => setAngle1((prev) => Math.max(0, prev - 1))}
                >
                  <Text style={styles.stepBtnText}>-1°</Text>
                </Pressable>

                <View style={styles.angleDisplayBox}>
                  <Text style={styles.angleDisplayText}>{angle1}°</Text>
                  <Text style={styles.angleDisplayLabel}>Incidence (Air)</Text>
                </View>

                <Pressable
                  style={styles.stepBtn}
                  onPress={() => setAngle1((prev) => Math.min(80, prev + 1))}
                >
                  <Text style={styles.stepBtnText}>+1°</Text>
                </Pressable>
                <Pressable
                  style={styles.stepBtn}
                  onPress={() => setAngle1((prev) => Math.min(80, prev + 5))}
                >
                  <Text style={styles.stepBtnText}>+5°</Text>
                </Pressable>
              </View>

              {/* Medium Selector Chips */}
              <Text style={styles.selectorHeading}>Select Refractive Medium (n₂):</Text>
              <View style={styles.chipsRow}>
                {MEDIA.map((m) => {
                  const isSelected = m.id === selectedMediumId;
                  return (
                    <Pressable
                      key={m.id}
                      style={[styles.chip, isSelected && styles.chipActive]}
                      onPress={() => setSelectedMediumId(m.id)}
                    >
                      <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                        {m.name} (n={m.n})
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </>
          ) : (
            <View style={styles.prismInfoBox}>
              <Text style={styles.prismInfoTitle}>Newton&apos;s Prism Dispersion Experiment</Text>
              <Text style={styles.prismInfoBody}>
                White light contains all spectral frequencies. Because shorter wavelengths (violet, λ≈400nm)
                experience a higher refractive index in glass than longer wavelengths (red, λ≈700nm), violet light
                refracts at a steeper angle, dispersing the beam into the continuous visible spectrum.
              </Text>
            </View>
          )}
        </GlassCard>
      }
    >
      {() => (
        <Svg width="100%" height="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
          <Defs>
            <LinearGradient id="airGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#0B132B" stopOpacity="0.4" />
              <Stop offset="100%" stopColor="#1C2541" stopOpacity="0.1" />
            </LinearGradient>
            <LinearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#00E5FF" stopOpacity="0.5" />
              <Stop offset="100%" stopColor="#00E5FF" stopOpacity="1" />
            </LinearGradient>
          </Defs>

          {labMode === 'boundary' ? (
            <G id="boundary-simulation">
              {/* Air Medium (Top Half) */}
              <Rect x="0" y="0" width={svgWidth} height={boundaryY} fill="url(#airGrad)" />
              <SvgText x="16" y="24" fill="#94A3B8" fontSize="11" fontWeight="bold">
                MEDIUM 1: Air (n₁ = 1.000)
              </SvgText>
              <SvgText x="16" y="40" fill="#64748B" fontSize="9">
                v₁ = 3.00 × 10⁸ m/s (Fast)
              </SvgText>

              {/* Denser Medium (Bottom Half) */}
              <Rect
                x="0"
                y={boundaryY}
                width={svgWidth}
                height={svgHeight - boundaryY}
                fill={selectedMedium.color}
                opacity={selectedMedium.fillOpacity}
              />
              <SvgText x="16" y={boundaryY + 24} fill="#F8FAFC" fontSize="11" fontWeight="bold">
                MEDIUM 2: {selectedMedium.name} (n₂ = {selectedMedium.n})
              </SvgText>
              <SvgText x="16" y={boundaryY + 40} fill="#E2E8F0" fontSize="9">
                v₂ = {selectedMedium.speed} (Slow, Optically Dense)
              </SvgText>

              {/* Horizontal Boundary Interface Line */}
              <Line x1="0" y1={boundaryY} x2={svgWidth} y2={boundaryY} stroke="#FFFFFF" strokeWidth="1.5" />

              {/* Normal Line (Perpendicular) */}
              <Line
                x1={originX}
                y1="10"
                x2={originX}
                y2={svgHeight - 10}
                stroke="#FDE047"
                strokeWidth="1.5"
                strokeDasharray="5,4"
              />
              <SvgText x={originX + 6} y="22" fill="#FDE047" fontSize="9" fontWeight="bold">
                NORMAL (0°)
              </SvgText>

              {/* Incident Light Beam (in Air) */}
              <Line
                x1={incX}
                y1={incY}
                x2={originX}
                y2={boundaryY}
                stroke="#00E5FF"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* Emitter indicator */}
              <Circle cx={incX} cy={incY} r="5" fill="#00E5FF" />
              <SvgText x={incX - 10} y={incY - 10} fill="#00E5FF" fontSize="10" fontWeight="bold">
                θ₁ = {angle1}°
              </SvgText>

              {/* Refracted Light Beam (in Medium - Bends toward normal) */}
              <Line
                x1={originX}
                y1={boundaryY}
                x2={refX}
                y2={refY}
                stroke="#FF9E00"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <SvgText x={refX + 10} y={refY + 4} fill="#FF9E00" fontSize="10" fontWeight="bold">
                θ₂ = {angle2Deg.toFixed(1)}°
              </SvgText>

              {/* Partial Reflection Ray back into Air */}
              {angle1 > 0 && (
                <G opacity="0.4">
                  <Line
                    x1={originX}
                    y1={boundaryY}
                    x2={partRefX}
                    y2={partRefY}
                    stroke="#00E5FF"
                    strokeWidth="1.5"
                    strokeDasharray="3,3"
                  />
                  <SvgText x={partRefX + 6} y={partRefY - 6} fill="#00E5FF" fontSize="8">
                    Partial Reflection
                  </SvgText>
                </G>
              )}

              {/* Incidence Point Dot */}
              <Circle cx={originX} cy={boundaryY} r="4" fill="#FFFFFF" />
            </G>
          ) : (
            <G id="prism-simulation">
              {/* Triangular Glass Prism */}
              <Polygon
                points="180,45 80,240 280,240"
                fill="#38BDF8"
                opacity="0.3"
                stroke="#38BDF8"
                strokeWidth="2"
              />
              <SvgText x="180" y="160" fill="#E0F2FE" fontSize="12" fontWeight="bold" textAnchor="middle">
                Dispersive Prism (Glass)
              </SvgText>

              {/* White Incident Beam from left */}
              <Line x1="10" y1="170" x2="120" y2="160" stroke="#FFFFFF" strokeWidth="4" />
              <SvgText x="20" y="155" fill="#FFFFFF" fontSize="10" fontWeight="bold">
                White Light Beam
              </SvgText>

              {/* Dispersed Spectral Colors exiting prism */}
              {[
                { name: 'Red (700nm)', color: '#EF4444', yEnd: 150 },
                { name: 'Orange', color: '#F97316', yEnd: 165 },
                { name: 'Yellow', color: '#FBBF24', yEnd: 180 },
                { name: 'Green', color: '#10B981', yEnd: 195 },
                { name: 'Blue', color: '#3B82F6', yEnd: 210 },
                { name: 'Indigo', color: '#6366F1', yEnd: 225 },
                { name: 'Violet (400nm - Most Bent)', color: '#A855F7', yEnd: 240 },
              ].map((spectrum, idx) => (
                <G key={idx}>
                  <Line
                    x1="225"
                    y1="165"
                    x2="335"
                    y2={spectrum.yEnd}
                    stroke={spectrum.color}
                    strokeWidth="2.5"
                  />
                  <Circle cx="335" cy={spectrum.yEnd} r="3" fill={spectrum.color} />
                  {(idx === 0 || idx === 6) && (
                    <SvgText x="345" y={spectrum.yEnd + 3} fill={spectrum.color} fontSize="8" fontWeight="bold">
                      {spectrum.name}
                    </SvgText>
                  )}
                </G>
              ))}
            </G>
          )}
        </Svg>
      )}
    </SimulationWorkspace>
  );
};

const styles = StyleSheet.create({
  controlsCard: {
    gap: spacing.sm,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: radii.button,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: colors.glassBorderSubtle,
    alignItems: 'center',
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
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  stepBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: colors.glassBorderSubtle,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: radii.button,
  },
  stepBtnText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  angleDisplayBox: {
    alignItems: 'center',
    minWidth: 90,
  },
  angleDisplayText: {
    ...typography.heading1,
    color: colors.cyan,
    fontWeight: '700',
  },
  angleDisplayLabel: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textMuted,
  },
  selectorHeading: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: radii.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: colors.glassBorderSubtle,
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
  prismInfoBox: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: radii.sm,
    padding: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.violet,
  },
  prismInfoTitle: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.violet,
    marginBottom: 4,
  },
  prismInfoBody: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 15,
  },
});
