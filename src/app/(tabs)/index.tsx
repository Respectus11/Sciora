import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer, GlassCard, PrimaryButton, Badge } from '@/components/ui';
import { colors, spacing, typography, radii } from '@/design-system';
import { progressRepository, GlobalStats } from '@/database/progressRepository';
import { contentService } from '@/services/contentService';

export default function HomeScreen() {
  const router = useRouter();
  const [resumeLessonId, setResumeLessonId] = useState<string>(
    contentService.getAllLessons()[0]?.id || 'lesson-7-1-reflection'
  );
  const [resumeStep, setResumeStep] = useState(0);
  const [stats, setStats] = useState<GlobalStats>({
    completedLessonsCount: 0,
    totalQuestionsAnswered: 0,
    correctQuestionsCount: 0,
    accuracyPercent: 0,
  });

  useFocusEffect(
    useCallback(() => {
      let active = true;
      const loadHomeState = async () => {
        try {
          const [nextLesson, completedIds, nextStats] = await Promise.all([
            progressRepository.getMostRecentInProgressLesson(),
            progressRepository.getAllCompletedLessonIds(),
            progressRepository.getGlobalStats(),
          ]);
          if (!active) return;
          setStats(nextStats);

          const lessons = contentService.getAllLessons();
          const candidateId = nextLesson?.lesson_id ||
            lessons.find((item) => !completedIds.includes(item.id))?.id ||
            lessons[0]?.id;
          if (candidateId) setResumeLessonId(candidateId);
          setResumeStep(nextLesson?.lesson_id === candidateId ? nextLesson.current_step : 0);
        } catch (error) {
          console.warn('Unable to load home progress:', error);
        }
      };
      loadHomeState();
      return () => { active = false; };
    }, [])
  );

  const resumeLesson = contentService.getLessonById(resumeLessonId) ||
    contentService.getAllLessons()[0];

  return (
    <ScreenContainer scrollable={true} contentContainerStyle={styles.container}>
      {/* 1. Header Bar */}
      <View style={styles.headerRow}>
        <View style={styles.brandGroup}>
          <View style={styles.logoBadge}>
            <Ionicons name="sparkles" size={24} color={colors.cyan} />
          </View>
          <View>
            <Text style={styles.brandTitle}>Sciora</Text>
            <Text style={styles.greetingText}>Welcome, Explorer</Text>
          </View>
        </View>
        <Badge
          label="Offline Ready"
          variant="emerald"
          icon={<Ionicons name="checkmark-circle" size={12} color={colors.emerald} />}
        />
      </View>

      {/* 2. Continue Learning Hero Card */}
      <GlassCard
        variant="raised"
        glow="cyan"
        style={styles.heroCard}
        padding="lg"
      >
        <View style={styles.heroTopRow}>
          <Badge label={resumeLesson ? `Unit ${resumeLesson.unitId.replace('unit-', '')} • ${resumeLesson.lessonNumber}` : 'Available lesson'} variant="cyan" />
          <Text style={styles.heroTimeText}>{resumeLesson ? `~${resumeLesson.estimatedMinutes} min` : ''}</Text>
        </View>

        <Text style={styles.heroTitle}>{resumeLesson?.title || 'Explore Sciora'}</Text>
        <Text style={styles.heroDescription}>
          {resumeLesson?.subtitle || 'Choose a science lesson to begin learning.'}
        </Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressHeaderRow}>
            <Text style={styles.progressLabel}>Progress</Text>
            <Text style={styles.progressPercent}>
              {resumeLesson ? `${Math.round((Math.min(resumeStep, resumeLesson.steps.length) / resumeLesson.steps.length) * 100)}% lesson progress` : 'Ready to start'}
            </Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${resumeLesson && resumeLesson.steps.length > 0 ? Math.round((Math.min(resumeStep, resumeLesson.steps.length) / resumeLesson.steps.length) * 100) : 0}%` }]} />
          </View>
        </View>

        <PrimaryButton
          title={resumeStep > 0 ? 'Resume Lesson' : 'Start Lesson'}
          variant="cyan"
          size="md"
          icon={<Ionicons name="arrow-forward" size={18} color={colors.cyanDark} />}
          onPress={() => resumeLesson && router.push(`/lessons/${resumeLesson.id}` as any)}
          style={styles.heroButton}
        />
      </GlassCard>

      {/* 3. Curriculum Units Grid */}
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Curriculum Units</Text>
          <Text style={styles.sectionSubtitle}>Ethiopian Grade 8 General Science</Text>
        </View>
        <Pressable onPress={() => router.push('/explore')}>
          <Text style={styles.seeAllLink}>View All →</Text>
        </Pressable>
      </View>

      <View style={styles.unitGrid}>
        {/* Unit 7: Core Physics */}
        <Pressable
          style={styles.unitCardTouchable}
          onPress={() => router.push('/units/unit-07')}
        >
          <GlassCard variant="base" glow="cyan" style={styles.unitCard}>
            <View style={styles.unitIconContainer}>
              <Ionicons name="sunny" size={24} color={colors.cyan} />
              <Badge label={`${contentService.getLessonsByUnit('unit-07').length} Labs`} variant="cyan" />
            </View>
            <Text style={styles.unitCardNumber}>Unit 7 • pp. 187–223</Text>
            <Text style={styles.unitCardTitle}>Physical Phenomena in the Surrounding</Text>
            <Text style={styles.unitCardTopics}>Light, Sound, Heat, Circuits, Magnetism</Text>
          </GlassCard>
        </Pressable>

        {/* Unit 2: Matter */}
        <Pressable
          style={styles.unitCardTouchable}
          onPress={() => router.push('/units/unit-02')}
        >
          <GlassCard variant="base" glow="violet" style={styles.unitCard}>
            <View style={styles.unitIconContainer}>
              <Ionicons name="nuclear" size={24} color={colors.violet} />
              <Badge label={`${contentService.getLessonsByUnit('unit-02').length} Labs`} variant="violet" />
            </View>
            <Text style={styles.unitCardNumber}>Unit 2 • pp. 25–37</Text>
            <Text style={styles.unitCardTitle}>Composition of Matter</Text>
            <Text style={styles.unitCardTopics}>Atoms, Subatomic Particles & Molecules</Text>
          </GlassCard>
        </Pressable>

        {/* Unit 6: Solar System */}
        <Pressable
          style={styles.unitCardTouchable}
          onPress={() => router.push('/units/unit-06')}
        >
          <GlassCard variant="base" glow="amber" style={styles.unitCard}>
            <View style={styles.unitIconContainer}>
              <Ionicons name="planet" size={24} color={colors.amber} />
              <Badge label={`${contentService.getLessonsByUnit('unit-06').length} Labs`} variant="amber" />
            </View>
            <Text style={styles.unitCardNumber}>Unit 6 • pp. 164–186</Text>
            <Text style={styles.unitCardTitle}>The Solar System</Text>
            <Text style={styles.unitCardTopics}>Planets, Gravity & Earth Habitability</Text>
          </GlassCard>
        </Pressable>

        {/* Unit 1: Inquiry */}
        <Pressable
          style={styles.unitCardTouchable}
          onPress={() => router.push('/units/unit-01')}
        >
          <GlassCard variant="base" glow="none" style={styles.unitCard}>
            <View style={styles.unitIconContainer}>
              <Ionicons name="flask" size={24} color={colors.emerald} />
              <Badge label="1 Lab" variant="emerald" />
            </View>
            <Text style={styles.unitCardNumber}>Unit 1 • pp. 1–24</Text>
            <Text style={styles.unitCardTitle}>Basics of Scientific Investigation</Text>
            <Text style={styles.unitCardTopics}>Measurements, Instruments & Fair Tests</Text>
          </GlassCard>
        </Pressable>
      </View>

      {/* 4. Inquiry of the Day */}
      <GlassCard variant="base" style={styles.inquiryCard}>
        <View style={styles.inquiryIconRow}>
          <Ionicons name="help-buoy" size={20} color={colors.cyan} />
          <Text style={styles.inquiryTag}>Inquiry of the Day</Text>
        </View>
        <Text style={styles.inquiryQuestion}>
          &ldquo;Why does a pencil appear bent or broken when placed in a glass of water?&rdquo;
        </Text>
        <Text style={styles.inquiryAnswer}>
          Light changes speed as it passes between air and water, causing the rays to refract.
        </Text>
        <Pressable
          style={styles.inquiryAction}
          onPress={() => router.push('/lessons/lesson-7-1-refraction')}
        >
          <Text style={styles.inquiryActionText}>Explore in Refraction Lab →</Text>
        </Pressable>
      </GlassCard>

      {/* 5. Progress Snapshot */}
      <GlassCard variant="base" style={styles.statsCard}>
        <View style={styles.statsHeader}>
          <Text style={styles.statsTitle}>Learning Journey</Text>
          <Badge label="Saved on Device" variant="muted" />
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.completedLessonsCount}/{contentService.getAllLessons().length}</Text>
            <Text style={styles.statLabel}>Labs Completed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.correctQuestionsCount}/{stats.totalQuestionsAnswered}</Text>
            <Text style={styles.statLabel}>Correct / Answered</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>100%</Text>
            <Text style={styles.statLabel}>Offline Ready</Text>
          </View>
        </View>
      </GlassCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.sm,
    paddingBottom: 90, // Accommodation for bottom floating tab bar
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBadge: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: 'rgba(0, 229, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  brandTitle: {
    ...typography.heading2,
    color: colors.textPrimary,
  },
  greetingText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  heroCard: {
    marginBottom: spacing.xxl,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  heroTimeText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  heroTitle: {
    ...typography.heading2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  heroDescription: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  progressContainer: {
    marginBottom: spacing.lg,
  },
  progressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  progressLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  progressPercent: {
    ...typography.caption,
    color: colors.cyan,
    fontWeight: '600',
  },
  progressBarBackground: {
    height: 6,
    borderRadius: radii.full,
    backgroundColor: colors.spaceElevated,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: radii.full,
    backgroundColor: colors.cyan,
  },
  heroButton: {
    marginTop: spacing.xs,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.heading2,
    color: colors.textPrimary,
  },
  sectionSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
  },
  seeAllLink: {
    ...typography.bodyMedium,
    color: colors.cyan,
    fontWeight: '600',
  },
  unitGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
    marginBottom: spacing.xl,
  },
  unitCardTouchable: {
    width: '50%',
    padding: spacing.xs,
  },
  unitCard: {
    minHeight: 160,
  },
  unitIconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  unitCardNumber: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 10,
    marginBottom: 2,
  },
  unitCardTitle: {
    ...typography.heading3,
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 18,
    marginBottom: spacing.xs,
  },
  unitCardTopics: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 15,
  },
  inquiryCard: {
    marginBottom: spacing.xl,
    borderColor: 'rgba(0, 229, 255, 0.25)',
  },
  inquiryIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  inquiryTag: {
    ...typography.badgeText,
    color: colors.cyan,
    marginLeft: spacing.xs,
  },
  inquiryQuestion: {
    ...typography.bodyLarge,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  inquiryAnswer: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  inquiryAction: {
    alignSelf: 'flex-start',
  },
  inquiryActionText: {
    ...typography.bodyMedium,
    color: colors.cyan,
    fontWeight: '600',
  },
  statsCard: {
    marginBottom: spacing.xl,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statsTitle: {
    ...typography.heading3,
    color: colors.textPrimary,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...typography.scientificMono,
    fontSize: 18,
    fontWeight: '700',
    color: colors.cyan,
    marginBottom: 2,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 10,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.glassBorder,
  },
});
