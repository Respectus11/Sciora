import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer, GlassCard, Badge } from '@/components/ui';
import { contentService } from '@/services/contentService';
import { progressRepository } from '@/database/progressRepository';
import { colors, spacing, typography, radii } from '@/design-system';

export default function ExploreScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unit-07' | 'unit-02' | 'unit-06'>('all');
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  const allLessons = contentService.getAllLessons();

  const loadProgress = useCallback(() => {
    progressRepository.getAllCompletedLessonIds().then(setCompletedIds).catch(() => {});
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProgress();
    }, [loadProgress])
  );

  const filteredLessons = selectedFilter === 'all'
    ? allLessons
    : allLessons.filter((l) => l.unitId === selectedFilter);

  return (
    <ScreenContainer scrollable={true} contentContainerStyle={styles.container}>
      {/* 1. Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Curriculum Explorer</Text>
        <Text style={styles.subtitle}>Ethiopian New Curriculum • Grade 8 General Science</Text>
        <Badge
          label="MoE National Syllabus • 231 Pages"
          variant="cyan"
          icon={<Ionicons name="book" size={12} color={colors.cyan} />}
          style={styles.textbookBadge}
        />
      </View>

      {/* 2. Filter Chips Horizontal Scroll */}
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
      >
        <Pressable
          style={[styles.filterChip, selectedFilter === 'all' ? styles.filterChipActive : undefined]}
          onPress={() => setSelectedFilter('all')}
        >
          <Text style={[styles.filterText, selectedFilter === 'all' ? styles.filterTextActive : undefined]}>
            All Topics ({allLessons.length})
          </Text>
        </Pressable>

        <Pressable
          style={[styles.filterChip, selectedFilter === 'unit-07' ? styles.filterChipActive : undefined]}
          onPress={() => setSelectedFilter('unit-07')}
        >
          <Text style={[styles.filterText, selectedFilter === 'unit-07' ? styles.filterTextActive : undefined]}>
            Unit 7: Physics ({contentService.getLessonsByUnit('unit-07').length} Labs)
          </Text>
        </Pressable>

        <Pressable
          style={[styles.filterChip, selectedFilter === 'unit-02' ? styles.filterChipActive : undefined]}
          onPress={() => setSelectedFilter('unit-02')}
        >
          <Text style={[styles.filterText, selectedFilter === 'unit-02' ? styles.filterTextActive : undefined]}>
            Unit 2: Matter ({contentService.getLessonsByUnit('unit-02').length} Labs)
          </Text>
        </Pressable>

        <Pressable
          style={[styles.filterChip, selectedFilter === 'unit-06' ? styles.filterChipActive : undefined]}
          onPress={() => setSelectedFilter('unit-06')}
        >
          <Text style={[styles.filterText, selectedFilter === 'unit-06' ? styles.filterTextActive : undefined]}>
            Unit 6: Solar System ({contentService.getLessonsByUnit('unit-06').length} Labs)
          </Text>
        </Pressable>
      </ScrollView>

      {/* 3. Lesson Cards List */}
      <View style={styles.lessonList}>
        {filteredLessons.map((lesson) => {
          const isCompleted = completedIds.includes(lesson.id);

          return (
            <Pressable
              key={lesson.id}
              style={styles.cardTouchable}
              onPress={() => router.push(`/lessons/${lesson.id}` as any)}
            >
              <GlassCard
                variant="base"
                glow={isCompleted ? 'none' : 'cyan'}
                style={styles.lessonCard}
                padding="md"
              >
                <View style={styles.cardHeaderRow}>
                  <Badge
                    label={`Unit ${lesson.lessonNumber}`}
                    variant={isCompleted ? 'emerald' : 'cyan'}
                  />
                  <View style={styles.durationGroup}>
                    <Ionicons name="time-outline" size={14} color={colors.textMuted} />
                    <Text style={styles.durationText}>{lesson.estimatedMinutes} min</Text>
                  </View>
                </View>

                <Text style={styles.lessonTitle}>{lesson.title}</Text>
                <Text style={styles.lessonDescription}>{lesson.subtitle}</Text>
                <Text style={styles.pageRefText}>{lesson.textbookPageRef}</Text>

                <View style={styles.cardFooter}>
                  <View style={styles.statusIndicator}>
                    <View
                      style={[
                        styles.statusDot,
                        {
                          backgroundColor: isCompleted ? colors.emerald : colors.cyan,
                        },
                      ]}
                    />
                    <Text style={styles.statusText}>
                      {isCompleted ? 'Completed' : '10-Step Guided Lab'}
                    </Text>
                  </View>

                  <View style={styles.arrowIconContainer}>
                    <Ionicons name="chevron-forward" size={18} color={colors.cyan} />
                  </View>
                </View>
              </GlassCard>
            </Pressable>
          );
        })}
      </View>
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
  textbookBadge: {
    marginTop: spacing.sm,
  },
  filterScroll: {
    paddingBottom: spacing.md,
  },
  filterChip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radii.chip,
    backgroundColor: colors.spaceElevated,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    marginRight: spacing.sm,
  },
  filterChipActive: {
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    borderColor: colors.cyan,
  },
  filterText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.cyan,
    fontWeight: '600',
  },
  lessonList: {
    marginTop: spacing.xs,
  },
  cardTouchable: {
    marginBottom: spacing.md,
  },
  lessonCard: {
    minHeight: 120,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  durationGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    ...typography.caption,
    color: colors.textMuted,
    marginLeft: 4,
  },
  lessonTitle: {
    ...typography.heading3,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  lessonDescription: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 4,
  },
  pageRefText: {
    ...typography.caption,
    color: colors.cyan,
    fontSize: 11,
    marginBottom: spacing.md,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.glassBorderSubtle,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  statusText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  arrowIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 229, 255, 0.10)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
