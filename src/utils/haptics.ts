import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

/**
 * Centralized Haptic Feedback Manager
 * Provides tactile sensory reinforcement for scientific simulation interactions.
 * Automatically fails gracefully on Web or unsupported environments.
 */
class HapticsManager {
  private isSupported(): boolean {
    return Platform.OS === 'ios' || Platform.OS === 'android';
  }

  /**
   * Light tactile feedback for stepper increments, slider dragging, or gentle ticks.
   */
  async lightTick(): Promise<void> {
    if (!this.isSupported()) return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Graceful fallback for devices without haptics
    }
  }

  /**
   * Medium tactile click for button presses, chip selections, and tab transitions.
   */
  async mediumClick(): Promise<void> {
    if (!this.isSupported()) return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // Graceful fallback
    }
  }

  /**
   * Heavy mechanical click for knife-switch circuit closures, magnet snaps, or docking.
   */
  async heavySnap(): Promise<void> {
    if (!this.isSupported()) return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch {
      // Graceful fallback
    }
  }

  /**
   * Success notification vibration pattern for correctly solved checkpoints or valid predictions.
   */
  async successNotification(): Promise<void> {
    if (!this.isSupported()) return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      // Graceful fallback
    }
  }

  /**
   * Warning vibration pattern for circuit fuse blow, thermal overload, or unstable isotopes.
   */
  async warningNotification(): Promise<void> {
    if (!this.isSupported()) return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch {
      // Graceful fallback
    }
  }

  /**
   * Error alert vibration pattern for short circuits or incorrect checkpoint attempts.
   */
  async errorNotification(): Promise<void> {
    if (!this.isSupported()) return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch {
      // Graceful fallback
    }
  }

  /**
   * Selection feedback for scrolling picker wheels or carousel swipes.
   */
  async selection(): Promise<void> {
    if (!this.isSupported()) return;
    try {
      await Haptics.selectionAsync();
    } catch {
      // Graceful fallback
    }
  }
}

export const haptics = new HapticsManager();
