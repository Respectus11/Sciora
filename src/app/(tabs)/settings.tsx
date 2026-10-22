import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, Alert, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer, GlassCard, Badge } from '@/components/ui';
import { colors, spacing, typography, radii } from '@/design-system';
import { progressRepository } from '@/database/progressRepository';

export default function SettingsScreen() {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);

  const handleResetProgress = () => {
    Alert.alert(
      'Reset All Learning Progress?',
      'This will clear all saved simulation states, checkpoints, and quiz attempts on this device. Curriculum lessons will remain available.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Progress',
          style: 'destructive',
          onPress: async () => {
            await progressRepository.resetAllProgress();
            Alert.alert('Progress Reset', 'All on-device learning records have been cleared.');
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer scrollable={true} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Appearance, accessibility, and local storage</Text>
      </View>

      {/* 1. Accessibility & Visual Effects */}
      <Text style={styles.sectionHeader}>Visual Experience & Accessibility</Text>
      <GlassCard variant="base" style={styles.card}>
        <View style={styles.settingRow}>
          <View style={styles.settingTextGroup}>
            <Text style={styles.settingLabel}>Reduce Motion</Text>
            <Text style={styles.settingDescription}>
              Minimize particle animations and ray motion effects
            </Text>
          </View>
          <Switch
            value={reduceMotion}
            onValueChange={setReduceMotion}
            thumbColor={reduceMotion ? colors.cyan : colors.textMuted}
            trackColor={{ false: colors.spaceElevated, true: 'rgba(0, 229, 255, 0.35)' }}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.settingRow}>
          <View style={styles.settingTextGroup}>
            <Text style={styles.settingLabel}>High-Contrast Opaque Cards</Text>
            <Text style={styles.settingDescription}>
              Disable glass blur for faster performance on older phones
            </Text>
          </View>
          <Switch
            value={highContrast}
            onValueChange={setHighContrast}
            thumbColor={highContrast ? colors.cyan : colors.textMuted}
            trackColor={{ false: colors.spaceElevated, true: 'rgba(0, 229, 255, 0.35)' }}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.settingRow}>
          <View style={styles.settingTextGroup}>
            <Text style={styles.settingLabel}>Haptic Feedback</Text>
            <Text style={styles.settingDescription}>
              Subtle vibration when adjusting simulation sliders
            </Text>
          </View>
          <Switch
            value={hapticsEnabled}
            onValueChange={setHapticsEnabled}
            thumbColor={hapticsEnabled ? colors.cyan : colors.textMuted}
            trackColor={{ false: colors.spaceElevated, true: 'rgba(0, 229, 255, 0.35)' }}
          />
        </View>
      </GlassCard>

      {/* 2. Curriculum & Textbook Reference */}
      <Text style={styles.sectionHeader}>Curriculum Specification</Text>
      <GlassCard variant="base" style={styles.card}>
        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>Curriculum</Text>
          <Text style={styles.infoValue}>Ethiopian New Curriculum</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>Grade & Subject</Text>
          <Text style={styles.infoValue}>Grade 8 General Science</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>Publisher</Text>
          <Text style={styles.infoValue}>Ministry of Education, Ethiopia</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>Official Scope</Text>
          <Text style={styles.infoValue}>7 Units • 231 Pages</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>Language</Text>
          <Text style={styles.infoValue}>English (National Edition)</Text>
        </View>
      </GlassCard>

      {/* 3. On-Device Storage & Data Management */}
      <Text style={styles.sectionHeader}>Local Data & Storage</Text>
      <GlassCard variant="base" style={styles.card}>
        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>Storage Engine</Text>
          <Text style={styles.infoValue}>SQLite Local Database</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>Cloud Sync / Telemetry</Text>
          <Badge label="Zero Network Tracking" variant="emerald" />
        </View>
        <View style={styles.divider} />

        <Pressable
          style={styles.dangerButton}
          onPress={handleResetProgress}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Reset local learning progress"
        >
          <Ionicons name="trash-outline" size={18} color={colors.rose} />
          <Text style={styles.dangerButtonText}>Reset Local Learning Progress</Text>
        </Pressable>
      </GlassCard>

      {/* 4. About & Open Source Notices */}
      <Text style={styles.sectionHeader}>About Sciora</Text>
      <GlassCard variant="base" style={styles.card}>
        <Text style={styles.aboutTitle}>Sciora v1.0.0 (Phase C Build)</Text>
        <Text style={styles.aboutBody}>
          Sciora is a completely free, offline-first educational application designed specifically for Ethiopian Grade 8 students. It features zero advertisements, subscriptions, or paywalls.
        </Text>
        <View style={styles.divider} />
        <Text style={styles.licenseNotice}>
          Simulation concepts adapted under MIT License from upstream research repository (John Martin). Curriculum alignment based on the Ethiopian Ministry of Education Grade 8 General Science syllabus.
        </Text>
      </GlassCard>
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
  sectionHeader: {
    ...typography.heading3,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  card: {
    marginBottom: spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  settingTextGroup: {
    flex: 1,
    paddingRight: spacing.md,
  },
  settingLabel: {
    ...typography.bodyLarge,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  settingDescription: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.glassBorderSubtle,
    marginVertical: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoKey: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  infoValue: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.xs,
    borderRadius: radii.button,
    backgroundColor: 'rgba(244, 63, 94, 0.10)',
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.35)',
  },
  dangerButtonText: {
    ...typography.bodyMedium,
    color: colors.rose,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  aboutTitle: {
    ...typography.heading3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  aboutBody: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  licenseNotice: {
    ...typography.caption,
    color: colors.textMuted,
    lineHeight: 16,
  },
});
