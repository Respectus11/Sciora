import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, {
  Line,
  Circle,
  Path,
  Text as SvgText,
  G,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import { SimulationWorkspace } from '@/components/simulation/SimulationWorkspace';
import { GlassCard } from '@/components/ui/GlassCard';
import { colors, spacing, typography, radii } from '@/design-system';

export const LightReflectionSimulation: React.FC = () => {
  const [angle, setAngle] = useState(45); // Angle of incidence in degrees (0 to 80)
  const [surfaceMode, setSurfaceMode] = useState<'mirror' | 'rough'>('mirror');

  // SVG Geometry Dimensions
  const svgWidth = 340;
  const svgHeight = 280;
  const originX = svgWidth / 2; // Center point on the mirror (170)
  const originY = 220; // Y position of the mirror line
  const rayLength = 160; // Length of the incident and reflected rays
  const protractorRadius = 120; // Radius of protractor arc

  // Trigonometric conversion (radians)
  const rad = (angle * Math.PI) / 180;

  // Incident ray start position (coming from top-left towards origin)
  const incidentX = originX - rayLength * Math.sin(rad);
  const incidentY = originY - rayLength * Math.cos(rad);

  // Reflected ray end position (heading towards top-right from origin)
  const reflectedX = originX + rayLength * Math.sin(rad);
  const reflectedY = originY - rayLength * Math.cos(rad);

  // Arc path for protractor scale (semi-circle from left to right above mirror)
  const protractorArc = `M ${originX - protractorRadius} ${originY} A ${protractorRadius} ${protractorRadius} 0 0 1 ${originX + protractorRadius} ${originY}`;

  // Arc path for angle of incidence θi
  const arcRadiusInc = 45;
  const arcIncStartX = originX - arcRadiusInc * Math.sin(rad);
  const arcIncStartY = originY - arcRadiusInc * Math.cos(rad);
  const arcIncPath = `M ${originX} ${originY - arcRadiusInc} A ${arcRadiusInc} ${arcRadiusInc} 0 0 0 ${arcIncStartX} ${arcIncStartY}`;

  // Arc path for angle of reflection θr
  const arcRadiusRef = 55;
  const arcRefEndX = originX + arcRadiusRef * Math.sin(rad);
  const arcRefEndY = originY - arcRadiusRef * Math.cos(rad);
  const arcRefPath = `M ${originX} ${originY - arcRadiusRef} A ${arcRadiusRef} ${arcRadiusRef} 0 0 1 ${arcRefEndX} ${arcRefEndY}`;

  const adjustAngle = (delta: number) => {
    setAngle((prev) => Math.min(80, Math.max(0, prev + delta)));
  };

  return (
    <SimulationWorkspace
      title="Law of Reflection Lab"
      unitTag="Grade 8 Physics • Unit 7.1A"
      telemetry={[
        { label: 'Angle of Incidence (θi)', value: `${angle}°`, color: colors.cyan },
        { label: 'Angle of Reflection (θr)', value: `${angle}°`, color: colors.amber },
        {
          label: 'Law Status',
          value: surfaceMode === 'mirror' ? 'θi = θr (VERIFIED)' : 'DIFFUSE (SCATTERED)',
          color: surfaceMode === 'mirror' ? colors.emerald : colors.rose,
        },
        {
          label: 'Surface Type',
          value: surfaceMode === 'mirror' ? 'Plane Mirror' : 'Rough Paper',
          color: colors.textSecondary,
        },
      ]}
      instructions={[
        'Use the angle adjustment buttons or quick-presets to change the incident ray angle (θi).',
        'Observe how the normal line (dashed yellow) serves as the 0° reference axis.',
        'Verify that θi always equals θr regardless of the angle chosen.',
        'Switch surface mode to "Rough Paper" to observe diffuse scattering where normals point in random directions.',
      ]}
      controlsNode={
        <GlassCard variant="base" padding="md" style={styles.controlsCard}>
          <Text style={styles.controlsHeading}>Adjust Incident Beam (θi)</Text>

          {/* Stepper Buttons */}
          <View style={styles.stepperRow}>
            <Pressable
              style={styles.stepBtn}
              onPress={() => adjustAngle(-5)}
              accessibilityLabel="Decrease angle by 5 degrees"
            >
              <Text style={styles.stepBtnText}>-5°</Text>
            </Pressable>

            <Pressable
              style={styles.stepBtn}
              onPress={() => adjustAngle(-1)}
              accessibilityLabel="Decrease angle by 1 degree"
            >
              <Text style={styles.stepBtnText}>-1°</Text>
            </Pressable>

            <View style={styles.currentAngleDisplay}>
              <Text style={styles.currentAngleNumber}>{angle}°</Text>
              <Text style={styles.currentAngleLabel}>from normal</Text>
            </View>

            <Pressable
              style={styles.stepBtn}
              onPress={() => adjustAngle(1)}
              accessibilityLabel="Increase angle by 1 degree"
            >
              <Text style={styles.stepBtnText}>+1°</Text>
            </Pressable>

            <Pressable
              style={styles.stepBtn}
              onPress={() => adjustAngle(5)}
              accessibilityLabel="Increase angle by 5 degrees"
            >
              <Text style={styles.stepBtnText}>+5°</Text>
            </Pressable>
          </View>

          {/* Quick Preset Chips */}
          <View style={styles.presetsRow}>
            {[0, 30, 45, 60, 75].map((preset) => (
              <Pressable
                key={preset}
                style={[
                  styles.presetChip,
                  angle === preset ? styles.presetChipActive : undefined,
                ]}
                onPress={() => setAngle(preset)}
              >
                <Text
                  style={[
                    styles.presetText,
                    angle === preset ? styles.presetTextActive : undefined,
                  ]}
                >
                  {preset === 0 ? '0° (Normal)' : `${preset}°`}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Surface Mode Toggle */}
          <View style={styles.modeToggleRow}>
            <Text style={styles.modeLabel}>Surface Reflection Mode:</Text>
            <View style={styles.modeButtonsGroup}>
              <Pressable
                style={[
                  styles.modeBtn,
                  surfaceMode === 'mirror' ? styles.modeBtnActive : undefined,
                ]}
                onPress={() => setSurfaceMode('mirror')}
              >
                <Text
                  style={[
                    styles.modeBtnText,
                    surfaceMode === 'mirror' ? styles.modeBtnTextActive : undefined,
                  ]}
                >
                  Specular (Mirror)
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.modeBtn,
                  surfaceMode === 'rough' ? styles.modeBtnActive : undefined,
                ]}
                onPress={() => setSurfaceMode('rough')}
              >
                <Text
                  style={[
                    styles.modeBtnText,
                    surfaceMode === 'rough' ? styles.modeBtnTextActive : undefined,
                  ]}
                >
                  Diffuse (Rough)
                </Text>
              </Pressable>
            </View>
          </View>
        </GlassCard>
      }
    >
      {() => (
        <Svg width="100%" height="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
          <Defs>
            {/* Beam Gradients */}
            <LinearGradient id="incidentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#00E5FF" stopOpacity="0.4" />
              <Stop offset="100%" stopColor="#00E5FF" stopOpacity="1" />
            </LinearGradient>
            <LinearGradient id="reflectedGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#F59E0B" stopOpacity="1" />
              <Stop offset="100%" stopColor="#F59E0B" stopOpacity="0.4" />
            </LinearGradient>
          </Defs>

          {/* 1. Protractor Semicircle & Scale */}
          <Path
            d={protractorArc}
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="1"
            fill="none"
            strokeDasharray="3,3"
          />

          {/* Protractor degree angle tick marks (15, 30, 45, 60, 75 degrees) */}
          {[15, 30, 45, 60, 75].map((deg) => {
            const radTick = (deg * Math.PI) / 180;
            // Left tick (incident side)
            const tickX1Left = originX - (protractorRadius - 6) * Math.sin(radTick);
            const tickY1Left = originY - (protractorRadius - 6) * Math.cos(radTick);
            const tickX2Left = originX - protractorRadius * Math.sin(radTick);
            const tickY2Left = originY - protractorRadius * Math.cos(radTick);

            // Right tick (reflected side)
            const tickX1Right = originX + (protractorRadius - 6) * Math.sin(radTick);
            const tickY1Right = originY - (protractorRadius - 6) * Math.cos(radTick);
            const tickX2Right = originX + protractorRadius * Math.sin(radTick);
            const tickY2Right = originY - protractorRadius * Math.cos(radTick);

            return (
              <G key={deg}>
                <Line
                  x1={tickX1Left}
                  y1={tickY1Left}
                  x2={tickX2Left}
                  y2={tickY2Left}
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth="1"
                />
                <SvgText
                  x={tickX2Left - 8}
                  y={tickY2Left - 4}
                  fill={colors.textMuted}
                  fontSize="8"
                  textAnchor="middle"
                >
                  {deg}°
                </SvgText>

                <Line
                  x1={tickX1Right}
                  y1={tickY1Right}
                  x2={tickX2Right}
                  y2={tickY2Right}
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth="1"
                />
                <SvgText
                  x={tickX2Right + 8}
                  y={tickY2Right - 4}
                  fill={colors.textMuted}
                  fontSize="8"
                  textAnchor="middle"
                >
                  {deg}°
                </SvgText>
              </G>
            );
          })}

          {/* 2. Normal Line (Dashed perpendicular at 90° to mirror) */}
          <Line
            x1={originX}
            y1={originY}
            x2={originX}
            y2={originY - 180}
            stroke="#FDE047"
            strokeWidth="1.5"
            strokeDasharray="5,4"
          />
          <SvgText
            x={originX}
            y={originY - 188}
            fill="#FDE047"
            fontSize="10"
            fontWeight="bold"
            textAnchor="middle"
          >
            NORMAL LINE (0°)
          </SvgText>

          {/* 3. Mirror Surface Line */}
          {surfaceMode === 'mirror' ? (
            <G>
              {/* Glass surface line */}
              <Line
                x1={20}
                y1={originY}
                x2={svgWidth - 20}
                y2={originY}
                stroke="#E2E8F0"
                strokeWidth="4"
              />
              {/* Mirror silver hatching marks underneath */}
              {Array.from({ length: 28 }).map((_, i) => (
                <Line
                  key={i}
                  x1={30 + i * 10}
                  y1={originY + 2}
                  x2={24 + i * 10}
                  y2={originY + 12}
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth="1.5"
                />
              ))}
              <SvgText
                x={svgWidth / 2}
                y={originY + 24}
                fill={colors.textMuted}
                fontSize="11"
                textAnchor="middle"
              >
                PLANE MIRROR (Smooth Reflective Surface)
              </SvgText>
            </G>
          ) : (
            <G>
              {/* Rough Jagged Paper Surface */}
              <Path
                d="M 20 220 Q 40 216 60 222 T 100 218 T 140 223 T 170 219 T 200 224 T 240 217 T 280 222 T 320 219"
                stroke="#94A3B8"
                strokeWidth="4"
                fill="none"
              />
              <SvgText
                x={svgWidth / 2}
                y={originY + 24}
                fill={colors.rose}
                fontSize="11"
                textAnchor="middle"
              >
                ROUGH PAPER (Microscopic Irregularities)
              </SvgText>
            </G>
          )}

          {/* 4. Incident Ray (Cyan) */}
          <Line
            x1={incidentX}
            y1={incidentY}
            x2={originX}
            y2={originY}
            stroke="#00E5FF"
            strokeWidth="3"
          />
          {/* Laser source pointer */}
          <Circle cx={incidentX} cy={incidentY} r="7" fill="#00E5FF" opacity="0.3" />
          <Circle cx={incidentX} cy={incidentY} r="4" fill="#00E5FF" />
          <SvgText
            x={incidentX - 12}
            y={incidentY - 8}
            fill="#00E5FF"
            fontSize="9"
            fontWeight="bold"
            textAnchor="end"
          >
            LASER
          </SvgText>

          {/* Incident Angle Arc & Label (if angle > 5) */}
          {angle > 5 && (
            <G>
              <Path d={arcIncPath} stroke="#00E5FF" strokeWidth="1.5" fill="none" />
              <SvgText
                x={originX - 18}
                y={originY - arcRadiusInc + 8}
                fill="#00E5FF"
                fontSize="10"
                fontWeight="bold"
                textAnchor="end"
              >
                θi={angle}°
              </SvgText>
            </G>
          )}

          {/* 5. Reflected Rays */}
          {surfaceMode === 'mirror' ? (
            <G>
              {/* Single Specular Reflected Ray */}
              <Line
                x1={originX}
                y1={originY}
                x2={reflectedX}
                y2={reflectedY}
                stroke="#F59E0B"
                strokeWidth="3"
              />
              <Circle cx={reflectedX} cy={reflectedY} r="5" fill="#F59E0B" opacity="0.5" />

              {/* Reflected Angle Arc & Label */}
              {angle > 5 && (
                <G>
                  <Path d={arcRefPath} stroke="#F59E0B" strokeWidth="1.5" fill="none" />
                  <SvgText
                    x={originX + 22}
                    y={originY - arcRadiusRef + 10}
                    fill="#F59E0B"
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="start"
                  >
                    θr={angle}°
                  </SvgText>
                </G>
              )}
            </G>
          ) : (
            <G>
              {/* Diffuse Reflection: Scatters in 5 randomized directions */}
              {[-35, -10, 20, 50, 75].map((scatAngle, idx) => {
                const scatRad = (scatAngle * Math.PI) / 180;
                const scatLen = 130 - Math.abs(scatAngle) * 0.4;
                const sx = originX + scatLen * Math.sin(scatRad);
                const sy = originY - scatLen * Math.cos(scatRad);
                return (
                  <Line
                    key={idx}
                    x1={originX}
                    y1={originY}
                    x2={sx}
                    y2={sy}
                    stroke="#F43F5E"
                    strokeWidth="1.5"
                    strokeDasharray="4,2"
                    opacity={0.8}
                  />
                );
              })}
              <SvgText
                x={originX + 60}
                y={originY - 80}
                fill="#F43F5E"
                fontSize="9"
                fontWeight="bold"
              >
                Diffuse Scattering
              </SvgText>
            </G>
          )}

          {/* Point of Incidence Central Dot */}
          <Circle cx={originX} cy={originY} r="5" fill="#FDE047" />
        </Svg>
      )}
    </SimulationWorkspace>
  );
};

const styles = StyleSheet.create({
  controlsCard: {
    borderColor: 'rgba(0, 229, 255, 0.25)',
  },
  controlsHeading: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: '700',
    marginBottom: spacing.sm,
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
  currentAngleDisplay: {
    alignItems: 'center',
  },
  currentAngleNumber: {
    ...typography.displayHero,
    fontSize: 28,
    color: colors.cyan,
    lineHeight: 32,
  },
  currentAngleLabel: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textMuted,
  },
  presetsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  presetChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: radii.chip,
    backgroundColor: colors.spaceElevated,
    borderWidth: 1,
    borderColor: colors.glassBorderSubtle,
  },
  presetChipActive: {
    backgroundColor: 'rgba(0, 229, 255, 0.2)',
    borderColor: colors.cyan,
  },
  presetText: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textSecondary,
  },
  presetTextActive: {
    color: colors.cyan,
    fontWeight: '700',
  },
  modeToggleRow: {
    marginTop: spacing.xs,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.glassBorderSubtle,
  },
  modeLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  modeButtonsGroup: {
    flexDirection: 'row',
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: radii.sm,
    backgroundColor: colors.spaceElevated,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    marginRight: 6,
  },
  modeBtnActive: {
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    borderColor: colors.cyan,
  },
  modeBtnText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  modeBtnTextActive: {
    color: colors.cyan,
    fontWeight: '700',
  },
});
