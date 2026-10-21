import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors, spacing, typography, radii } from '@/design-system';

export interface TerminologyPillProps {
  term: string;
  definition: string;
  phonetic?: string;
  category?: 'physics' | 'chemistry' | 'astronomy' | 'investigation';
  curriculumRef?: string;
}

export const TerminologyPill: React.FC<TerminologyPillProps> = ({
  term,
  definition,
  phonetic,
  category = 'physics',
  curriculumRef,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const categoryColor =
    category === 'chemistry'
      ? colors.violet
      : category === 'astronomy'
      ? colors.amber
      : category === 'investigation'
      ? colors.emerald
      : colors.cyan;

  return (
    <View style={styles.container}>
      <Pressable
        style={[
          styles.pill,
          isExpanded && { borderColor: categoryColor, backgroundColor: 'rgba(255, 255, 255, 0.08)' },
        ]}
        onPress={() => setIsExpanded((prev) => !prev)}
        accessibilityRole="button"
        accessibilityLabel={`Scientific term: ${term}`}
      >
        <View style={[styles.categoryDot, { backgroundColor: categoryColor }]} />
        <Text style={[styles.termText, isExpanded && { color: categoryColor, fontWeight: '700' }]}>
          {term}
        </Text>
        <Text style={styles.expandIcon}>{isExpanded ? '▲' : '▼'}</Text>
      </Pressable>

      {/* Expanded Glossary Popover Card */}
      {isExpanded && (
        <View style={[styles.popoverCard, { borderLeftColor: categoryColor }]}>
          <View style={styles.popoverHeader}>
            <Text style={styles.popoverTitle}>{term}</Text>
            {phonetic && <Text style={styles.phoneticText}>/{phonetic}/</Text>}
            {curriculumRef && <Text style={styles.refText}>{curriculumRef}</Text>}
          </View>
          <Text style={styles.definitionText}>{definition}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    alignSelf: 'flex-start',
    maxWidth: '100%',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: radii.full,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: colors.glassBorderSubtle,
    gap: 6,
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  termText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  expandIcon: {
    fontSize: 8,
    color: colors.textMuted,
    marginLeft: 2,
  },
  popoverCard: {
    marginTop: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderLeftWidth: 3,
    padding: spacing.sm,
    gap: 4,
    maxWidth: 320,
  },
  popoverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  popoverTitle: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  phoneticText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  refText: {
    ...typography.caption,
    fontSize: 9,
    color: colors.cyan,
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    paddingHorizontal: 4,
    borderRadius: radii.sm,
    marginLeft: 'auto',
  },
  definitionText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 16,
  },
});
