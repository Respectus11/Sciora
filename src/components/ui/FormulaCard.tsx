import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassCard } from './GlassCard';
import { colors, spacing, typography, radii } from '@/design-system';

export interface FormulaVariable {
  symbol: string;
  name: string;
  unit: string;
  description?: string;
}

export interface FormulaCardProps {
  title: string;
  formula: string;
  variables: FormulaVariable[];
  description?: string;
  unitTag?: string;
}

export const FormulaCard: React.FC<FormulaCardProps> = ({
  title,
  formula,
  variables,
  description,
  unitTag,
}) => {
  return (
    <GlassCard variant="base" padding="md" style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
        {unitTag && <Text style={styles.unitTag}>{unitTag}</Text>}
      </View>

      {/* Primary Mathematical Expression */}
      <View style={styles.formulaBox}>
        <Text style={styles.formulaText}>{formula}</Text>
      </View>

      {description && <Text style={styles.description}>{description}</Text>}

      {/* Variables Breakdown Table */}
      <View style={styles.variablesSection}>
        <Text style={styles.sectionHeading}>Variables & SI Units</Text>
        {variables.map((v) => (
          <View key={v.symbol} style={styles.variableRow}>
            <View style={styles.symbolBadge}>
              <Text style={styles.symbolText}>{v.symbol}</Text>
            </View>
            <View style={styles.variableInfo}>
              <Text style={styles.variableName}>
                {v.name}{' '}
                <Text style={styles.variableUnit}>({v.unit})</Text>
              </Text>
              {v.description && (
                <Text style={styles.variableDesc}>{v.description}</Text>
              )}
            </View>
          </View>
        ))}
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    gap: spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    ...typography.heading3,
    color: colors.textPrimary,
  },
  unitTag: {
    ...typography.caption,
    fontSize: 10,
    color: colors.cyan,
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.25)',
  },
  formulaBox: {
    backgroundColor: 'rgba(0, 229, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.2)',
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formulaText: {
    ...typography.heading1,
    color: colors.cyan,
    fontFamily: typography.scientificMono.fontFamily,
    letterSpacing: 1,
  },
  description: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  variablesSection: {
    borderTopWidth: 1,
    borderTopColor: colors.glassBorderSubtle,
    paddingTop: spacing.xs,
    gap: 6,
  },
  sectionHeading: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  variableRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 2,
  },
  symbolBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: colors.glassBorderSubtle,
    borderRadius: radii.sm,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbolText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.amber,
    fontFamily: typography.scientificMono.fontFamily,
  },
  variableInfo: {
    flex: 1,
  },
  variableName: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  variableUnit: {
    color: colors.cyan,
    fontWeight: '400',
  },
  variableDesc: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
});
