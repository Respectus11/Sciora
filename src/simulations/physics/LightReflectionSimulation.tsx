import React, { useState } from 'react';
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
  Polygon,
  Rect,
} from 'react-native-svg';
import { SimulationWorkspace } from '@/components/simulation/SimulationWorkspace';
import { GlassCard } from '@/components/ui/GlassCard';
import { colors, spacing, typography, radii } from '@/design-system';

interface LaserColor {
  id: string;
  name: string;
  wavelength: string;
  hex: string;
}

const LASER_SOURCES: LaserColor[] = [
  { id: 'cyan', name: 'Argon (Cyan)', wavelength: '488 nm', hex: '#00E5FF' },
  { id: 'green', name: 'DPSS (Green)', wavelength: '532 nm', hex: '#10B981' },
  { id: 'red', name: 'He-Ne (Red)', wavelength: '650 nm', hex: '#EF4444' },
  { id: 'violet', name: 'Diode (Violet)', wavelength: '405 nm', hex: '#8B5CF6' },
];

export const LightReflectionSimulation: React.FC = () => {
  const [angle, setAngle] = useState(45); // Angle of incidence in degrees (0 to 80)
  const [surfaceMode, setSurfaceMode] = useState<'mirror' | 'rough'>('mirror');
  const [selectedLaserId, setSelectedLaserId] = useState<string>('cyan');

  const activeLaser = LASER_SOURCES.find((l) => l.id === selectedLaserId) || LASER_SOURCES[0];

  // SVG Geometry Dimensions
  const svgWidth = 360;
  const svgHeight = 290;
  const originX = svgWidth / 2; // Center point on mirror (180)
  const originY = 220; // Y position of mirror line
  const rayLength = 160;
  const protractorRadius = 130;

  // Trigonometric conversion (radians from normal)
  const rad = (angle * Math.PI) / 180;

  // Incident ray start position (coming from top-left towards origin)
  const incidentX = originX - rayLength * Math.sin(rad);
  const incidentY = originY - rayLength * Math.cos(rad);

  // Reflected ray end position (heading towards top-right from origin)
  const reflectedX = originX + rayLength * Math.sin(rad);
  const reflectedY = originY - rayLength * Math.cos(rad);

  // Arc path for protractor scale
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

  const detectedIntensity = surfaceMode === 'mirror' ? 99 : 18;

  return (
    <SimulationWorkspace
      title="Law of Reflection & Specular Optics Lab"
      unitTag="Grade 8 Physics • Unit 7.1A"
      telemetry={[
        { label: 'Incidence (θi)', value: `${angle}°`, color: activeLaser.hex },
        { label: 'Reflection (θr)', value: surfaceMode === 'mirror' ? `${angle}°` : 'Scattered', color: colors.amber },
        {
          label: 'Law Status',
          value: surfaceMode === 'mirror' ? 'θi = θr (VERIFIED)' : 'DIFFUSE SCATTERING',
          color: surfaceMode === 'mirror' ? colors.emerald : colors.rose,
        },
        { label: 'Laser Source', value: `${activeLaser.name} (${activeLaser.wavelength})`, color: activeLaser.hex },
        { label: 'Detected Flux', value: `${detectedIntensity}%`, color: detectedIntensity > 50 ? colors.emerald : colors.amber },
      ]}
      instructions={[
        'Adjust the incident angle (θi) using the stepper buttons or one-touch degree presets.',
        'Observe how the normal line (0° vertical reference) bisects the incident and reflected rays.',
        'Verify that θi = θr holds exactly across all angles on a smooth plane mirror (specular reflection).',
        'Switch to "Rough Paper" to observe diffuse reflection, where microscopic surface irregularities scatter light.',
      ]}
      controlsNode={
        <GlassCard variant="base" padding="md" style={styles.controlsCard}>
          {/* Laser Source Selector */}
          <Text style={styles.controlsHeading}>Laser Source & Wavelength:</Text>
          <View style={styles.laserRow}>
            {LASER_SOURCES.map((laser) => (
              <Pressable
                key={laser.id}
                style={[
                  styles.laserChip,
                  selectedLaserId === laser.id && { borderColor: laser.hex, backgroundColor: 'rgba(255,255,255,0.08)' },
                ]}
                onPress={() => setSelectedLaserId(laser.id)}
              >
                <Circle cx="4" cy="4" r="4" />
                <View style={[styles.laserDot, { backgroundColor: laser.hex }]} />
                <Text style={[styles.laserChipText, selectedLaserId === laser.id && { color: laser.hex, fontWeight: '700' }]}>
                  {laser.name}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Stepper Buttons for Angle */}
          <Text style={[styles.controlsHeading, { marginTop: spacing.xs }]}>
            Adjust Incident Angle (θi):
          </Text>
          <View style={styles.stepperRow}>
            <Pressable style={styles.stepBtn} onPress={() => adjustAngle(-5)}>
              <Text style={styles.stepBtnText}>-5°</Text>
            </Pressable>
            <Pressable style={styles.stepBtn} onPress={() => adjustAngle(-1)}>
              <Text style={styles.stepBtnText}>-1°</Text>
            </Pressable>

            <View style={styles.currentAngleDisplay}>
              <Text style={[styles.currentAngleNumber, { color: activeLaser.hex }]}>{angle}°</Text>
              <Text style={styles.currentAngleLabel}>from normal</Text>
            </View>

            <Pressable style={styles.stepBtn} onPress={() => adjustAngle(1)}>
              <Text style={styles.stepBtnText}>+1°</Text>
            </Pressable>
            <Pressable style={styles.stepBtn} onPress={() => adjustAngle(5)}>
              <Text style={styles.stepBtnText}>+5°</Text>
            </Pressable>
          </View>

          {/* Quick Preset Chips */}
          <View style={styles.presetsRow}>
            {[0, 15, 30, 45, 60, 75].map((preset) => (
              <Pressable
                key={preset}
                style={[styles.presetChip, angle === preset ? styles.presetChipActive : undefined]}
                onPress={() => setAngle(preset)}
              >
                <Text style={[styles.presetText, angle === preset ? styles.presetTextActive : undefined]}>
                  {preset === 0 ? '0° (Normal)' : `${preset}°`}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Surface Mode Toggle */}
          <View style={styles.modeToggleRow}>
            <Text style={styles.modeLabel}>Reflection Surface Mode:</Text>
            <View style={styles.modeButtonsGroup}>
              <Pressable
                style={[styles.modeBtn, surfaceMode === 'mirror' ? styles.modeBtnActive : undefined]}
                onPress={() => setSurfaceMode('mirror')}
              >
                <Text style={[styles.modeBtnText, surfaceMode === 'mirror' ? styles.modeBtnTextActive : undefined]}>
                  Specular (Mirror)
                </Text>
              </Pressable>

              <Pressable
                style={[styles.modeBtn, surfaceMode === 'rough' ? styles.modeBtnActive : undefined]}
                onPress={() => setSurfaceMode('rough')}
              >
                <Text style={[styles.modeBtnText, surfaceMode === 'rough' ? styles.modeBtnTextActive : undefined]}>
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
            {/* Dynamic beam gradients */}
            <LinearGradient id="incidentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={activeLaser.hex} stopOpacity="0.5" />
              <Stop offset="100%" stopColor={activeLaser.hex} stopOpacity="1" />
            </LinearGradient>
            <LinearGradient id="reflectedGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#F59E0B" stopOpacity="1" />
              <Stop offset="100%" stopColor="#F59E0B" stopOpacity="0.4" />
            </LinearGradient>
          </Defs>

          {/* 1. Protractor Semicircle Arc & Scale */}
          <Path
            d={protractorArc}
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="1"
            fill="none"
            strokeDasharray="3,3"
          />

          {/* Protractor degree angle tick marks */}
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

          {/* 2. Normal Line (0° perpendicular axis) */}
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

          {/* 3. Surface Representation */}
          {surfaceMode === 'mirror' ? (
            <G>
              {/* Glass surface line */}
              <Line x1={20} y1={originY} x2={svgWidth - 20} y2={originY} stroke="#E2E8F0" strokeWidth="4" />
              {/* Silver hatching marks underneath */}
              {Array.from({ length: 30 }).map((_, i) => (
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
              <SvgText x={svgWidth / 2} y={originY + 26} fill={colors.textMuted} fontSize="11" textAnchor="middle">
                PLANE MIRROR (Smooth Specular Boundary)
              </SvgText>
            </G>
          ) : (
            <G>
              {/* Jagged paper surface */}
              <Path
                d="M 20 220 Q 40 215 60 223 T 100 217 T 140 224 T 180 218 T 220 223 T 260 216 T 300 222 T 340 219"
                stroke="#94A3B8"
                strokeWidth="4"
                fill="none"
              />
              <SvgText x={svgWidth / 2} y={originY + 26} fill={colors.rose} fontSize="11" textAnchor="middle">
                ROUGH PAPER (Microscopic Surface Irregularities)
              </SvgText>
            </G>
          )}

          {/* 4. Incident Ray */}
          <Line
            x1={incidentX}
            y1={incidentY}
            x2={originX}
            y2={originY}
            stroke={activeLaser.hex}
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Laser Pointer Emitter */}
          <G transform={`translate(${incidentX}, ${incidentY}) rotate(${angle})`}>
            <Rect x="-8" y="-16" width="16" height="16" fill="#334155" rx="3" stroke={activeLaser.hex} strokeWidth="1.5" />
            <Circle cx="0" cy="0" r="3" fill={activeLaser.hex} />
          </G>

          {/* Incident Angle Arc & Label */}
          {angle > 0 && (
            <G>
              <Path d={arcIncPath} stroke={activeLaser.hex} strokeWidth="1.5" fill="none" />
              <SvgText
                x={originX - 25}
                y={originY - 30}
                fill={activeLaser.hex}
                fontSize="11"
                fontWeight="bold"
                textAnchor="middle"
              >
                θi = {angle}°
              </SvgText>
            </G>
          )}

          {/* 5. Reflected Rays */}
          {surfaceMode === 'mirror' ? (
            <G>
              <Line
                x1={originX}
                y1={originY}
                x2={reflectedX}
                y2={reflectedY}
                stroke="#F59E0B"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* Reflected Angle Arc & Label */}
              {angle > 0 && (
                <G>
                  <Path d={arcRefPath} stroke="#F59E0B" strokeWidth="1.5" fill="none" />
                  <SvgText
                    x={originX + 25}
                    y={originY - 30}
                    fill="#F59E0B"
                    fontSize="11"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    θr = {angle}°
                  </SvgText>
                </G>
              )}
              {/* Optical Detector Sensor */}
              <G transform={`translate(${reflectedX}, ${reflectedY}) rotate(${-angle})`}>
                <Rect x="-10" y="-8" width="20" height="14" fill="#047857" rx="3" stroke="#10B981" strokeWidth="1.5" />
                <SvgText x="0" y="3" fill="#FFFFFF" fontSize="7" fontWeight="bold" textAnchor="middle">
                  99%
                </SvgText>
              </G>
            </G>
          ) : (
            <G>
              {/* Diffuse Scattered Rays */}
              {[
                { dx: 45, dy: -130, color: '#F87171' },
                { dx: 95, dy: -100, color: '#FBBF24' },
                { dx: 140, dy: -60, color: '#34D399' },
                { dx: -40, dy: -110, color: '#60A5FA' },
                { dx: -90, dy: -70, color: '#A78BFA' },
              ].map((ray, idx) => (
                <Line
                  key={idx}
                  x1={originX}
                  y1={originY}
                  x2={originX + ray.dx}
                  y2={originY + ray.dy}
                  stroke={ray.color}
                  strokeWidth="1.5"
                  strokeDasharray="4,2"
                />
              ))}
              <SvgText x={originX + 70} y={originY - 90} fill={colors.rose} fontSize="9" fontWeight="bold">
                Diffuse Scattering
              </SvgText>
            </G>
          )}

          {/* Point of Incidence Marker */}
          <Circle cx={originX} cy={originY} r="4" fill="#FFFFFF" />
        </Svg>
      )}
    </SimulationWorkspace>
  );
};

const styles = StyleSheet.create({
  controlsCard: {
    gap: spacing.sm,
  },
  controlsHeading: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  laserRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  laserChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: radii.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: colors.glassBorderSubtle,
    gap: 5,
  },
  laserDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  laserChipText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textSecondary,
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
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radii.button,
  },
  stepBtnText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  currentAngleDisplay: {
    alignItems: 'center',
    minWidth: 80,
  },
  currentAngleNumber: {
    ...typography.heading1,
    fontWeight: '700',
  },
  currentAngleLabel: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textMuted,
  },
  presetsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  presetChip: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: radii.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: colors.glassBorderSubtle,
  },
  presetChipActive: {
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    borderColor: colors.cyan,
  },
  presetText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textSecondary,
  },
  presetTextActive: {
    color: colors.cyan,
    fontWeight: '700',
  },
  modeToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.glassBorderSubtle,
  },
  modeLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  modeButtonsGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  modeBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: radii.button,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: colors.glassBorderSubtle,
  },
  modeBtnActive: {
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    borderColor: colors.cyan,
  },
  modeBtnText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textSecondary,
  },
  modeBtnTextActive: {
    color: colors.cyan,
    fontWeight: '700',
  },
});
