/**
 * Settings context for managing user dietary preferences
 * Persists settings to AsyncStorage
 */
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { loadSettings, saveSettings } from '../lib/storage';
import { UserSettings } from '../types';

interface SettingsContextType {
  settings: UserSettings;
  updateSetting: (key: keyof UserSettings, value: boolean) => void;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<UserSettings>({
    noDairy: false,
    noGluten: false,
    noMeat: false,
    noNuts: false,
    noSoy: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load settings on mount
  useEffect(() => {
    const loadUserSettings = async () => {
      try {
        const savedSettings = await loadSettings();
        setSettings(savedSettings);
      } catch (error) {
        console.warn('Failed to load settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserSettings();
  }, []);

  // Update a specific setting
  const updateSetting = async (key: keyof UserSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    try {
      await saveSettings(newSettings);
    } catch (error) {
      console.warn('Failed to save settings:', error);
      // Revert on error
      setSettings(settings);
    }
  };

  const value: SettingsContextType = {
    settings,
    updateSetting,
    isLoading,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
