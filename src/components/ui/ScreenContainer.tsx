import React from 'react';
import { View, StyleSheet, ScrollView, ViewStyle, StyleProp, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing } from '@/design-system';

export interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  header?: React.ReactNode;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  scrollable = false,
  style,
  contentContainerStyle,
  header,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.spaceDark} />
      {/* Ambient Celestial Glow Gradients */}
      <LinearGradient
        colors={['rgba(0, 229, 255, 0.08)', 'transparent']}
        style={styles.ambientTopGlow}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.7, y: 0.6 }}
      />
      <LinearGradient
        colors={['transparent', 'rgba(139, 92, 246, 0.06)']}
        style={styles.ambientBottomGlow}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.9, y: 1 }}
      />

      <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top > 0 ? 0 : spacing.sm }]}>
        {header}
        {scrollable ? (
          <ScrollView
            style={[styles.scroll, style]}
            contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.content, style]}>{children}</View>
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.spaceDark,
  },
  safeArea: {
    flex: 1,
  },
  ambientTopGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    pointerEvents: 'none',
  },
  ambientBottomGlow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 250,
    pointerEvents: 'none',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.huge,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.screenPadding,
  },
});
