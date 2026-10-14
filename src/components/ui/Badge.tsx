import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { colors, radii, spacing, typography } from '@/design-system';

export interface BadgeProps {
  label: string;
  variant?: 'cyan' | 'violet' | 'amber' | 'emerald' | 'rose' | 'muted';
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'cyan',
  icon,
  style,
  textStyle,
}) => {
  return (
    <View style={[styles.base, variantStyles[variant], style]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={[styles.text, variantTextStyles[variant], textStyle]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.chip,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  iconContainer: {
    marginRight: 4,
  },
  text: {
    ...typography.badgeText,
  },
});

const variantStyles = StyleSheet.create({
  cyan: {
    backgroundColor: 'rgba(0, 229, 255, 0.12)',
    borderColor: 'rgba(0, 229, 255, 0.35)',
  },
  violet: {
    backgroundColor: 'rgba(139, 92, 246, 0.12)',
    borderColor: 'rgba(139, 92, 246, 0.35)',
  },
  amber: {
    backgroundColor: 'rgba(255, 158, 0, 0.12)',
    borderColor: 'rgba(255, 158, 0, 0.35)',
  },
  emerald: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.35)',
  },
  rose: {
    backgroundColor: 'rgba(244, 63, 94, 0.12)',
    borderColor: 'rgba(244, 63, 94, 0.35)',
  },
  muted: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
});

const variantTextStyles = StyleSheet.create({
  cyan: {
    color: colors.cyan,
  },
  violet: {
    color: colors.violet,
  },
  amber: {
    color: colors.amber,
  },
  emerald: {
    color: colors.emerald,
  },
  rose: {
    color: colors.rose,
  },
  muted: {
    color: colors.textSecondary,
  },
});
