import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  AUDIO_SETTINGS_STORAGE_KEY,
  DEFAULT_MORSE_AUDIO_SETTINGS,
  normalizeMorseAudioSettings,
  parseStoredAudioSettings,
  type MorseAudioSettings,
} from "@/lib/morse-audio-settings";
import {
  DEFAULT_MORSE_SETTINGS,
  normalizeMorseSettings,
  parseStoredSettings,
  SETTINGS_STORAGE_KEY,
  type MorseSettings,
} from "@/lib/morse-settings";

type SettingsContextValue = {
  settings: MorseSettings;
  audioSettings: MorseAudioSettings;
  updateSettings: (partial: Partial<MorseSettings>) => void;
  updateAudioSettings: (partial: Partial<MorseAudioSettings>) => void;
  resetSettings: () => void;
  resetAudioSettings: () => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<MorseSettings>(DEFAULT_MORSE_SETTINGS);
  const [audioSettings, setAudioSettings] = useState<MorseAudioSettings>(DEFAULT_MORSE_AUDIO_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(SETTINGS_STORAGE_KEY),
      AsyncStorage.getItem(AUDIO_SETTINGS_STORAGE_KEY),
    ]).then(([rawSettings, rawAudio]) => {
      if (rawSettings) {
        const parsed = parseStoredSettings(rawSettings);
        if (parsed) setSettings(parsed);
      }
      if (rawAudio) {
        const parsed = parseStoredAudioSettings(rawAudio);
        if (parsed) setAudioSettings(parsed);
      }
      setLoaded(true);
    });
  }, []);

  const updateSettings = useCallback((partial: Partial<MorseSettings>) => {
    setSettings((prev) => {
      const next = normalizeMorseSettings({ ...prev, ...partial });
      void AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const updateAudioSettings = useCallback((partial: Partial<MorseAudioSettings>) => {
    setAudioSettings((prev) => {
      const next = normalizeMorseAudioSettings({ ...prev, ...partial });
      void AsyncStorage.setItem(AUDIO_SETTINGS_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_MORSE_SETTINGS);
    void AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_MORSE_SETTINGS));
  }, []);

  const resetAudioSettings = useCallback(() => {
    setAudioSettings(DEFAULT_MORSE_AUDIO_SETTINGS);
    void AsyncStorage.setItem(AUDIO_SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_MORSE_AUDIO_SETTINGS));
  }, []);

  const value = useMemo(
    () => ({ settings, audioSettings, updateSettings, updateAudioSettings, resetSettings, resetAudioSettings }),
    [settings, audioSettings, updateSettings, updateAudioSettings, resetSettings, resetAudioSettings],
  );

  if (!loaded) return null;

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
