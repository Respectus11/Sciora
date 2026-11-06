import { getDatabase } from './db';

export interface UserSettings {
  reduceMotion: boolean;
  highContrast: boolean;
  hapticsEnabled: boolean;
}

export type UserSettingKey = keyof UserSettings;

export const DEFAULT_USER_SETTINGS: UserSettings = {
  reduceMotion: false,
  highContrast: false,
  hapticsEnabled: true,
};

const settingKeys = Object.keys(DEFAULT_USER_SETTINGS) as UserSettingKey[];

function parseStoredBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return fallback;
}

/**
 * Stores local preferences in the existing user_settings SQLite table.
 * Preferences are intentionally kept separate from learning-progress resets.
 */
export const settingsRepository = {
  async getSettings(): Promise<UserSettings> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<{ key: string; value: string }>(
      'SELECT key, value FROM user_settings;'
    );
    const stored = new Map(rows.map((row) => [row.key, row.value]));

    return {
      reduceMotion: parseStoredBoolean(
        stored.get('reduceMotion'),
        DEFAULT_USER_SETTINGS.reduceMotion
      ),
      highContrast: parseStoredBoolean(
        stored.get('highContrast'),
        DEFAULT_USER_SETTINGS.highContrast
      ),
      hapticsEnabled: parseStoredBoolean(
        stored.get('hapticsEnabled'),
        DEFAULT_USER_SETTINGS.hapticsEnabled
      ),
    };
  },

  async setPreference<K extends UserSettingKey>(
    key: K,
    value: UserSettings[K]
  ): Promise<void> {
    if (!settingKeys.includes(key) || typeof value !== 'boolean') {
      throw new Error('Invalid Sciora preference.');
    }

    const db = await getDatabase();
    await db.runAsync(
      `INSERT INTO user_settings (key, value)
       VALUES (?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value;`,
      [key, String(value)]
    );
  },
};
