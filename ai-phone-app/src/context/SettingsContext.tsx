import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppSettings, defaultSettings } from '../types/settings';

const SETTINGS_STORAGE_KEY = 'appSettings';

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (settings: AppSettings) => void;
  isDarkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  useEffect(() => {
    const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (e) {
        console.error('Failed to parse settings:', e);
      }
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-font-size', settings.display.fontSize);
    document.documentElement.setAttribute('data-theme', settings.display.darkMode ? 'dark' : 'light');
  }, [settings.display.fontSize, settings.display.darkMode]);

  const updateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        isDarkMode: settings.display.darkMode,
        fontSize: settings.display.fontSize,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
