import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, radii, spacing } from '@/design-system';

export interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'base' | 'raised' | 'highlight' | 'opaque';
  glow?: 'cyan' | 'violet' | 'amber' | 'none';
  intensity?: number;
  borderRadius?: number;
  padding?: keyof typeof spacing;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  variant = 'base',
  glow = 'none',
  intensity = 30,
  borderRadius = radii.card,
  padding = 'cardPadding',
}) => {
  // If variant is explicitly opaque or blur is disabled
  if (variant === 'opaque') {
    return (
      <View
        style={[
          styles.opaqueBase,
          {
            borderRadius,
            padding: spacing[padding],
          },
          glowStyles[glow],
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  const surfaceBg =
    variant === 'raised'
      ? colors.glassSurfaceRaised
      : variant === 'highlight'
      ? colors.glassSurfaceHighlight
      : colors.glassSurface;

  return (
    <View
      style={[
        styles.container,
        {
          borderRadius,
          backgroundColor: surfaceBg,
          borderColor:
            glow === 'cyan'
              ? colors.glassBorderFocus
              : colors.glassBorder,
        },
        glowStyles[glow],
        style,
      ]}
    >
      <BlurView
        intensity={intensity}
        tint="dark"
        style={[
          styles.blurContent,
          {
            borderRadius,
            padding: spacing[padding],
          },
        ]}
      >
        {children}
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  blurContent: {
    overflow: 'hidden',
  },
  opaqueBase: {
    backgroundColor: colors.opaqueCard,
    borderWidth: 1,
    borderColor: colors.opaqueCardBorder,
  },
});

const glowStyles = StyleSheet.create({
  none: {},
  cyan: {
    borderColor: 'rgba(0, 229, 255, 0.45)',
    shadowColor: colors.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  violet: {
    borderColor: 'rgba(139, 92, 246, 0.45)',
    shadowColor: colors.violet,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  amber: {
    borderColor: 'rgba(255, 158, 0, 0.45)',
    shadowColor: colors.amber,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
});
