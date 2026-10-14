import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '@/components/ui/GlassCard';
import { colors, spacing, typography, radii } from '@/design-system';

interface TelemetryItem {
  label: string;
  value: string | number;
  unit?: string;
  color?: string;
}

interface SimulationWorkspaceProps {
  title: string;
  unitTag: string;
  children: (props: { paused: boolean; resetKey: number }) => React.ReactNode;
  telemetry: TelemetryItem[];
  instructions?: string[];
  controlsNode?: React.ReactNode;
  onReset?: () => void;
}

export const SimulationWorkspace: React.FC<SimulationWorkspaceProps> = ({
  title,
  unitTag,
  children,
  telemetry,
  instructions,
  controlsNode,
  onReset,
}) => {
  const [paused, setPaused] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);

  const handleReset = () => {
    setResetKey((prev) => prev + 1);
    setPaused(false);
    if (onReset) onReset();
  };

  return (
    <View style={styles.container}>
      {/* 1. Header Toolbar */}
      <View style={styles.toolbar}>
        <View style={styles.titleGroup}>
          <Text style={styles.unitTag}>{unitTag}</Text>
          <Text style={styles.simTitle}>{title}</Text>
        </View>

        <View style={styles.actionButtons}>
          {instructions && instructions.length > 0 && (
            <Pressable
              style={[
                styles.iconBtn,
                showInstructions ? styles.iconBtnActive : undefined,
              ]}
              onPress={() => setShowInstructions((prev) => !prev)}
              accessibilityLabel="Toggle instructions"
            >
              <Ionicons
                name="information-circle-outline"
                size={20}
                color={showInstructions ? colors.cyan : colors.textSecondary}
              />
            </Pressable>
          )}

          <Pressable
            style={styles.iconBtn}
            onPress={() => setPaused((prev) => !prev)}
            accessibilityLabel={paused ? 'Resume simulation' : 'Pause simulation'}
          >
            <Ionicons
              name={paused ? 'play' : 'pause'}
              size={18}
              color={colors.cyan}
            />
          </Pressable>

          <Pressable
            style={styles.iconBtn}
            onPress={handleReset}
            accessibilityLabel="Reset simulation"
          >
            <Ionicons name="refresh" size={18} color={colors.amber} />
          </Pressable>
        </View>
      </View>

      {/* 2. Optional Instructions Drawer */}
      {showInstructions && instructions && (
        <GlassCard variant="highlight" style={styles.instructionsBox} padding="sm">
          <Text style={styles.instructionsHeading}>Investigation Steps:</Text>
          {instructions.map((step, idx) => (
            <View key={idx} style={styles.instructionRow}>
              <Text style={styles.stepNum}>{idx + 1}.</Text>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </GlassCard>
      )}

      {/* 3. Interactive Vector Canvas Frame */}
      <View style={styles.canvasFrame}>
        {children({ paused, resetKey })}
      </View>

      {/* 4. Live Telemetry HUD Strip */}
      <View style={styles.telemetryStrip}>
        {telemetry.map((item, index) => (
          <View key={index} style={styles.telemetryCard}>
            <Text style={styles.telemetryLabel}>{item.label}</Text>
            <Text
              style={[
                styles.telemetryValue,
                item.color ? { color: item.color } : undefined,
              ]}
            >
              {item.value}
              {item.unit ? (
                <Text style={styles.telemetryUnit}> {item.unit}</Text>
              ) : null}
            </Text>
          </View>
        ))}
      </View>

      {/* 5. Custom Controls Area */}
      {controlsNode && <View style={styles.controlsArea}>{controlsNode}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    paddingHorizontal: 2,
  },
  titleGroup: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  unitTag: {
    ...typography.badgeText,
    color: colors.cyan,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  simTitle: {
    ...typography.heading3,
    color: colors.textPrimary,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: radii.button,
    backgroundColor: colors.spaceElevated,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.xs,
  },
  iconBtnActive: {
    borderColor: colors.cyan,
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
  },
  instructionsBox: {
    marginBottom: spacing.sm,
    borderColor: 'rgba(0, 229, 255, 0.3)',
  },
  instructionsHeading: {
    ...typography.bodyMedium,
    fontWeight: '700',
    color: colors.cyan,
    marginBottom: 4,
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  stepNum: {
    ...typography.caption,
    color: colors.cyan,
    fontWeight: '700',
    width: 18,
  },
  stepText: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
  },
  canvasFrame: {
    width: '100%',
    height: 300,
    borderRadius: radii.card,
    overflow: 'hidden',
    backgroundColor: '#050811',
    borderWidth: 1,
    borderColor: colors.glassBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  telemetryStrip: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
    marginHorizontal: -4,
  },
  telemetryCard: {
    flex: 1,
    minWidth: 90,
    backgroundColor: colors.spaceSurface,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.glassBorderSubtle,
    paddingVertical: 8,
    paddingHorizontal: 10,
    margin: 4,
    alignItems: 'center',
  },
  telemetryLabel: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textMuted,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  telemetryValue: {
    ...typography.scientificMono,
    fontSize: 15,
    fontWeight: '700',
    color: colors.cyan,
  },
  telemetryUnit: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: 'normal',
  },
  controlsArea: {
    marginTop: spacing.md,
  },
});
