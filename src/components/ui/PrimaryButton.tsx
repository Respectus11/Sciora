import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
  ActivityIndicator,
} from 'react-native';
import { colors, radii, spacing } from '@/design-system';

export interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'cyan' | 'violet' | 'amber' | 'glass' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  variant = 'cyan',
  size = 'md',
  icon,
  iconPosition = 'right',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const isGlass = variant === 'glass';
  const isGhost = variant === 'ghost';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: disabled || loading }}
      style={({ pressed }) => [
        styles.base,
        sizeStyles[size],
        variantStyles[variant],
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={isGlass || isGhost ? colors.cyan : colors.textInverse}
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && <>{icon}</>}
          <Text
            style={[
              styles.textBase,
              textSizeStyles[size],
              variantTextStyles[variant],
              disabled && styles.disabledText,
              icon && iconPosition === 'left' ? styles.iconLeftMargin : undefined,
              icon && iconPosition === 'right' ? styles.iconRightMargin : undefined,
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && <>{icon}</>}
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.button,
    minHeight: spacing.minTouchTarget,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.45,
    backgroundColor: colors.spaceElevated,
    borderColor: 'transparent',
  },
  textBase: {
    fontWeight: '600',
    textAlign: 'center',
  },
  disabledText: {
    color: colors.textMuted,
  },
  iconLeftMargin: {
    marginLeft: spacing.sm,
  },
  iconRightMargin: {
    marginRight: spacing.sm,
  },
});

const sizeStyles = StyleSheet.create({
  sm: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    minHeight: 36,
  },
  md: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    minHeight: 48,
  },
  lg: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    minHeight: 56,
  },
});

const textSizeStyles = StyleSheet.create({
  sm: {
    fontSize: 13,
  },
  md: {
    fontSize: 15,
  },
  lg: {
    fontSize: 17,
  },
});

const variantStyles = StyleSheet.create({
  cyan: {
    backgroundColor: colors.cyan,
    shadowColor: colors.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4,
  },
  violet: {
    backgroundColor: colors.violet,
    shadowColor: colors.violet,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4,
  },
  amber: {
    backgroundColor: colors.amber,
    shadowColor: colors.amber,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4,
  },
  glass: {
    backgroundColor: colors.glassSurface,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
});

const variantTextStyles = StyleSheet.create({
  cyan: {
    color: colors.cyanDark,
  },
  violet: {
    color: '#ffffff',
  },
  amber: {
    color: colors.amberDark,
  },
  glass: {
    color: colors.textPrimary,
  },
  ghost: {
    color: colors.cyan,
  },
});
