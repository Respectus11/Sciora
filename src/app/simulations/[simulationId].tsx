import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer, Badge, PrimaryButton } from '@/components/ui';
import { getSimulationById } from '@/simulations/registry';
import { colors, spacing, typography, radii } from '@/design-system';

export default function SimulationScreen() {
  const router = useRouter();
  const { simulationId } = useLocalSearchParams<{ simulationId: string }>();

  const registration = getSimulationById(simulationId || 'sim-7-1-reflection');

  if (!registration) {
    return (
      <ScreenContainer>
        <Text style={styles.errorText}>Simulation not found</Text>
        <PrimaryButton title="Back" onPress={() => router.back()} />
      </ScreenContainer>
    );
  }

  const SimComponent = registration.component;

  return (
    <ScreenContainer scrollable={true} contentContainerStyle={styles.container}>
      {/* Header bar */}
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={() => router.back()}
          accessibilityLabel="Back to previous screen"
        >
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </Pressable>
        <Badge label={registration.unitLabel} variant="cyan" />
      </View>

      {/* Standalone Simulation Workspace */}
      <SimComponent />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.xs,
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: radii.button,
    backgroundColor: colors.spaceElevated,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...typography.heading2,
    color: colors.rose,
    marginBottom: spacing.md,
  },
});
