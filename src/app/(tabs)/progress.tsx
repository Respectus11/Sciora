import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { ScreenContainer, GlassCard, Badge } from '@/components/ui';
import { progressRepository, GlobalStats } from '@/database/progressRepository';
import { contentService } from '@/services/contentService';
import { colors, spacing, typography, radii } from '@/design-system';

export default function ProgressScreen() {
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [stats, setStats] = useState<GlobalStats>({
    completedLessonsCount: 0,
    totalQuestionsAnswered: 0,
    correctQuestionsCount: 0,
    accuracyPercent: 0,
  });

  const loadStats = useCallback(async () => {
    try {
      const [nextStats, nextCompletedIds] = await Promise.all([
        progressRepository.getGlobalStats(),
        progressRepository.getAllCompletedLessonIds(),
      ]);
      setStats(nextStats);
      setCompletedIds(nextCompletedIds);
    } catch (error) {
      console.warn('Unable to load progress:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [loadStats])
  );

  const allLessons = contentService.getAllLessons();
  const totalLabs = allLessons.length;
  const progressRatio = totalLabs > 0 ? Math.min(1, stats.completedLessonsCount / totalLabs) : 0;
  const unitProgress = contentService.getAllUnits().map((unit) => {
    const lessons = contentService.getLessonsByUnit(unit.id);
    const completed = lessons.filter((lesson) => completedIds.includes(lesson.id)).length;
    return { unit, total: lessons.length, completed };
  }).filter((item) => item.total > 0);
  const progressPercent = Math.round(progressRatio * 100);

  return (
    <ScreenContainer scrollable={true} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Progress</Text>
        <Text style={styles.subtitle}>Track your lab discoveries and quiz mastery</Text>
      </View>

      {/* Main Stats Card */}
      <GlassCard variant="raised" glow="cyan" style={styles.summaryCard} padding="lg">
        <View style={styles.summaryHeader}>
          <Text style={styles.summaryTitle}>Grade 8 Science Mastery</Text>
          <Badge label="Saved Locally" variant="emerald" />
        </View>

        <View style={styles.metricRow}>
          <View style={styles.metricItem}>
            <Text style={styles.metricNumber}>{stats.completedLessonsCount}</Text>
            <Text style={styles.metricLabel}>Labs Completed</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Text style={styles.metricNumber}>{stats.correctQuestionsCount}</Text>
            <Text style={styles.metricLabel}>Questions Solved</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Text style={styles.metricNumber}>
              {stats.totalQuestionsAnswered > 0 ? `${stats.accuracyPercent}%` : '—'}
            </Text>
            <Text style={styles.metricLabel}>Quiz Accuracy</Text>
          </View>
        </View>

        <View style={styles.overallProgressContainer}>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${Math.max(5, progressPercent)}%` }]} />
          </View>
          <Text style={styles.overallProgressText}>
            {stats.completedLessonsCount} of {totalLabs} core interactive labs completed ({progressPercent}%)
          </Text>
        </View>
      </GlassCard>

      {/* Mastery by Unit */}
      <Text style={styles.sectionHeader}>Mastery by Unit</Text>

      {unitProgress.map(({ unit, total, completed }) => {
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
        const accent = unit.id === 'unit-07'
          ? colors.cyan
          : unit.id === 'unit-02'
          ? colors.violet
          : unit.id === 'unit-06'
          ? colors.amber
          : colors.emerald;

        return (
          <GlassCard key={unit.id} variant="base" style={styles.unitProgressCard}>
            <View style={styles.unitHeaderRow}>
              <Text style={styles.unitTitle}>{`Unit ${unit.unitNumber}: ${unit.title}`}</Text>
              <Text style={styles.unitScore}>{completed} / {total} lessons</Text>
            </View>
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${percent}%`, backgroundColor: accent },
                ]}
              />
            </View>
          </GlassCard>
        );
      })}

      {/* Privacy & Offline Guarantee */}
      <GlassCard variant="base" style={styles.privacyCard}>
        <View style={styles.privacyIconRow}>
          <Ionicons name="shield-checkmark" size={20} color={colors.emerald} />
          <Text style={styles.privacyTitle}>Zero-Data Privacy Guarantee</Text>
        </View>
        <Text style={styles.privacyText}>
          Sciora collects no personal details, names, locations, or analytics. All your progress is stored exclusively inside this device&apos;s local database.
        </Text>
      </GlassCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.sm,
    paddingBottom: 90,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.heading1,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    marginTop: 2,
  },
  summaryCard: {
    marginBottom: spacing.xxl,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  summaryTitle: {
    ...typography.heading2,
    color: colors.textPrimary,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricNumber: {
    ...typography.displayHero,
    color: colors.cyan,
    fontSize: 26,
    marginBottom: 2,
  },
  metricLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
  },
  metricDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.glassBorder,
  },
  overallProgressContainer: {
    marginTop: spacing.xs,
  },
  progressBarBackground: {
    height: 8,
    borderRadius: radii.full,
    backgroundColor: colors.spaceElevated,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: radii.full,
    backgroundColor: colors.cyan,
  },
  overallProgressText: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  sectionHeader: {
    ...typography.heading3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  unitProgressCard: {
    marginBottom: spacing.md,
  },
  unitHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  unitTitle: {
    ...typography.bodyLarge,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  unitScore: {
    ...typography.scientificMono,
    color: colors.cyan,
    fontSize: 12,
  },
  privacyCard: {
    marginTop: spacing.lg,
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  privacyIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  privacyTitle: {
    ...typography.heading3,
    color: colors.emerald,
    marginLeft: spacing.xs,
    fontSize: 14,
  },
  privacyText: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
