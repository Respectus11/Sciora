import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  DEFAULT_USER_SETTINGS,
  settingsRepository,
  type UserSettingKey,
  type UserSettings,
} from '../database/settingsRepository';
import { setSettingsSnapshot } from '../utils/settingsRuntime';

interface SettingsContextValue {
  settings: UserSettings;
  isLoading: boolean;
  updatePreference: <K extends UserSettingKey>(key: K, value: UserSettings[K]) => Promise<void>;
}

const defaultContext: SettingsContextValue = {
  settings: DEFAULT_USER_SETTINGS,
  isLoading: false,
  updatePreference: async () => {},
};

const SettingsContext = createContext<SettingsContextValue>(defaultContext);

export function SettingsProvider({ children }: React.PropsWithChildren) {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_USER_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    settingsRepository.getSettings()
      .then((loadedSettings) => {
        if (!active) return;
        setSettings(loadedSettings);
        setSettingsSnapshot(loadedSettings);
      })
      .catch(() => {
        // Keep safe defaults available when local storage cannot be opened.
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const updatePreference = useCallback(async <K extends UserSettingKey>(
    key: K,
    value: UserSettings[K]
  ) => {
    // Persist first so the UI never presents an unsaved preference as committed.
    await settingsRepository.setPreference(key, value);
    setSettings((current) => {
      const next = { ...current, [key]: value };
      setSettingsSnapshot(next);
      return next;
    });
  }, []);

  const contextValue = useMemo(
    () => ({ settings, isLoading, updatePreference }),
    [settings, isLoading, updatePreference]
  );

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useAppSettings(): SettingsContextValue {
  return useContext(SettingsContext);
}
