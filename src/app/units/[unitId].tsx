import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer, GlassCard, Badge, PrimaryButton } from '@/components/ui';
import { contentService } from '@/services/contentService';
import { colors, spacing, typography, radii } from '@/design-system';

export default function UnitDetailScreen() {
  const router = useRouter();
  const { unitId } = useLocalSearchParams<{ unitId: string }>();

  const unit = contentService.getUnitById(unitId || 'unit-07');
  const lessons = contentService.getLessonsByUnit(unitId || 'unit-07');

  if (!unit) {
    return (
      <ScreenContainer>
        <Text style={styles.notFoundText}>Unit not found</Text>
        <PrimaryButton title="Back to Explore" onPress={() => router.back()} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable={true} contentContainerStyle={styles.container}>
      {/* 1. Header Navigation Bar */}
      <View style={styles.navBar}>
        <Pressable
          style={styles.backBtn}
          onPress={() => router.back()}
          accessibilityLabel="Back to previous screen"
        >
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </Pressable>
        <Badge
          label={`Unit ${unit.unitNumber} • ${unit.pageRange}`}
          variant="cyan"
        />
      </View>

      {/* 2. Unit Hero Banner */}
      <GlassCard variant="raised" glow="cyan" style={styles.heroCard} padding="lg">
        <Text style={styles.unitSubheader}>ETHIOPIAN GRADE 8 GENERAL SCIENCE</Text>
        <Text style={styles.unitTitle}>{unit.title}</Text>
        <Text style={styles.unitTagline}>{unit.tagline}</Text>
        <Text style={styles.unitDescription}>{unit.description}</Text>

        <View style={styles.authorsRow}>
          <Ionicons name="people-outline" size={14} color={colors.textMuted} />
          <Text style={styles.authorsText}>
            Authors: {unit.authors.join(', ')} (MoE Ethiopia)
          </Text>
        </View>
      </GlassCard>

      {/* 3. Learning Competencies */}
      <Text style={styles.sectionTitle}>Curriculum Learning Competencies</Text>
      <GlassCard variant="base" style={styles.competenciesCard} padding="md">
        {unit.learningCompetencies.map((comp, idx) => (
          <View key={idx} style={styles.competencyItem}>
            <Ionicons name="checkmark-circle" size={16} color={colors.cyan} style={styles.compIcon} />
            <Text style={styles.competencyText}>{comp}</Text>
          </View>
        ))}
      </GlassCard>

      {/* 4. Interactive Simulation Lessons */}
      <View style={styles.lessonsHeaderRow}>
        <Text style={styles.sectionTitle}>Interactive Simulation Labs</Text>
        <Badge label={`${lessons.length} Labs Available`} variant="emerald" />
      </View>

      <View style={styles.lessonsList}>
        {lessons.map((lesson) => (
          <Pressable
            key={lesson.id}
            style={styles.lessonTouchable}
            onPress={() => router.push(`/lessons/${lesson.id}` as any)}
          >
            <GlassCard variant="base" style={styles.lessonCard} padding="md">
              <View style={styles.lessonTopRow}>
                <Badge label={lesson.lessonNumber} variant="cyan" />
                <View style={styles.durationBadge}>
                  <Ionicons name="time-outline" size={12} color={colors.textMuted} />
                  <Text style={styles.durationText}>{lesson.estimatedMinutes} min</Text>
                </View>
              </View>

              <Text style={styles.lessonCardTitle}>{lesson.title}</Text>
              <Text style={styles.lessonCardSub}>{lesson.subtitle}</Text>
              <Text style={styles.textbookRef}>{lesson.textbookPageRef}</Text>

              <View style={styles.lessonFooter}>
                <View style={styles.stepsBadge}>
                  <Text style={styles.stepsBadgeText}>10-Step Guided Inquiry</Text>
                </View>
                <View style={styles.launchBtn}>
                  <Text style={styles.launchBtnText}>Start Lab</Text>
                  <Ionicons name="arrow-forward" size={14} color={colors.cyan} />
                </View>
              </View>
            </GlassCard>
          </Pressable>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.xs,
    paddingBottom: spacing.xxl,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: radii.button,
    backgroundColor: colors.spaceElevated,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    ...typography.heading2,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  heroCard: {
    marginBottom: spacing.xl,
  },
  unitSubheader: {
    ...typography.badgeText,
    color: colors.cyan,
    marginBottom: 4,
  },
  unitTitle: {
    ...typography.heading1,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  unitTagline: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  unitDescription: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  authorsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.glassBorderSubtle,
  },
  authorsText: {
    ...typography.caption,
    color: colors.textMuted,
    marginLeft: 6,
  },
  sectionTitle: {
    ...typography.heading3,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  competenciesCard: {
    marginBottom: spacing.xl,
  },
  competencyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  compIcon: {
    marginTop: 2,
    marginRight: 8,
  },
  competencyText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  lessonsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  lessonsList: {
    marginBottom: spacing.lg,
  },
  lessonTouchable: {
    marginBottom: spacing.md,
  },
  lessonCard: {
    minHeight: 130,
  },
  lessonTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    ...typography.caption,
    color: colors.textMuted,
    marginLeft: 4,
  },
  lessonCardTitle: {
    ...typography.heading3,
    color: colors.textPrimary,
    fontSize: 15,
    marginBottom: 4,
  },
  lessonCardSub: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 6,
  },
  textbookRef: {
    ...typography.caption,
    color: colors.cyan,
    fontSize: 11,
    marginBottom: spacing.sm,
  },
  lessonFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.glassBorderSubtle,
  },
  stepsBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: radii.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  stepsBadgeText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textMuted,
  },
  launchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  launchBtnText: {
    ...typography.caption,
    color: colors.cyan,
    fontWeight: '700',
    marginRight: 4,
  },
});
