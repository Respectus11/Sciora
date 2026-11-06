import type { UserSettings } from '../database/settingsRepository';

const defaultSettings: UserSettings = {
  reduceMotion: false,
  highContrast: false,
  hapticsEnabled: true,
};

let currentSettings: UserSettings = defaultSettings;

/** Synchronous snapshot for utilities that cannot use React hooks. */
export function getSettingsSnapshot(): UserSettings {
  return currentSettings;
}

export function setSettingsSnapshot(settings: UserSettings): void {
  currentSettings = settings;
}
