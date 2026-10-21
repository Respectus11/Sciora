import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors, spacing, typography, radii } from '@/design-system';

export interface StepProgressProps {
  currentStepIndex: number; // 0 to 9
  totalSteps?: number;
  completedSteps?: number[];
  onStepPress?: (stepIndex: number) => void;
  stepTitles?: string[];
}

const DEFAULT_STEP_NAMES = [
  'Phenomenon Hook',
  'Core Competency',
  'Prediction Challenge',
  'Interactive Lab',
  'Data Telemetry',
  'Scientific Law',
  'Formative Checkpoint',
  'Misconception Bust',
  'Real-World Link',
  'Mastery Reflection',
];

export const StepProgress: React.FC<StepProgressProps> = ({
  currentStepIndex,
  totalSteps = 10,
  completedSteps = [],
  onStepPress,
  stepTitles = DEFAULT_STEP_NAMES,
}) => {
  const currentTitle = stepTitles[currentStepIndex] || `Stage ${currentStepIndex + 1}`;
  const progressPercent = Math.round(((currentStepIndex + 1) / totalSteps) * 100);

  return (
    <View style={styles.container}>
      {/* Top Header Row with Active Step and Percentage */}
      <View style={styles.headerRow}>
        <View style={styles.stepInfo}>
          <Text style={styles.stepCount}>
            STAGE {currentStepIndex + 1} OF {totalSteps}
          </Text>
          <Text style={styles.stepTitle}>{currentTitle}</Text>
        </View>
        <Text style={styles.percentText}>{progressPercent}%</Text>
      </View>

      {/* Progress Track Segments */}
      <View style={styles.trackRow}>
        {Array.from({ length: totalSteps }).map((_, idx) => {
          const isCurrent = idx === currentStepIndex;
          const isCompleted = completedSteps.includes(idx) || idx < currentStepIndex;

          const barColor = isCurrent
            ? colors.cyan
            : isCompleted
            ? colors.emerald
            : 'rgba(255, 255, 255, 0.12)';

          return (
            <Pressable
              key={idx}
              style={[
                styles.stepSegment,
                { backgroundColor: barColor },
                isCurrent && styles.segmentCurrent,
              ]}
              onPress={() => onStepPress && onStepPress(idx)}
              disabled={!onStepPress}
              accessibilityLabel={`Step ${idx + 1}: ${stepTitles[idx] || ''}`}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xs,
    gap: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  stepInfo: {
    gap: 2,
  },
  stepCount: {
    ...typography.caption,
    fontSize: 9,
    fontWeight: '700',
    color: colors.cyan,
    letterSpacing: 0.8,
  },
  stepTitle: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  percentText: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    fontFamily: typography.scientificMono.fontFamily,
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 6,
  },
  stepSegment: {
    flex: 1,
    height: 4,
    borderRadius: radii.full,
  },
  segmentCurrent: {
    height: 6,
    shadowColor: colors.cyan,
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
});
