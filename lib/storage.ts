/**
 * AsyncStorage helpers for persisting user data
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HistoryItem, UserSettings } from '../types';

// Storage keys
export const STORAGE_KEYS = {
  SETTINGS: 'settings:v1',
  HISTORY: 'history:v1',
  RECENT_SEARCHES: 'recent_searches:v1',
} as const;

/**
 * Load user settings from storage
 */
export const loadSettings = async (): Promise<UserSettings> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to load settings:', error);
  }
  
  // Return default settings
  return {
    noDairy: false,
    noGluten: false,
    noMeat: false,
    noNuts: false,
    noSoy: false,
  };
};

/**
 * Save user settings to storage
 */
export const saveSettings = async (settings: UserSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.warn('Failed to save settings:', error);
  }
};

/**
 * Load scan history from storage
 */
export const loadHistory = async (): Promise<HistoryItem[]> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.HISTORY);
    if (stored) {
      const history = JSON.parse(stored);
      // Convert date strings back to Date objects
      return history.map((item: any) => ({
        ...item,
        scannedAt: new Date(item.scannedAt),
      }));
    }
  } catch (error) {
    console.warn('Failed to load history:', error);
  }
  
  return [];
};

/**
 * Save scan history to storage
 */
export const saveHistory = async (history: HistoryItem[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  } catch (error) {
    console.warn('Failed to save history:', error);
  }
};

/**
 * Add new item to history
 */
export const addToHistory = async (item: HistoryItem): Promise<void> => {
  try {
    const currentHistory = await loadHistory();
    const updatedHistory = [item, ...currentHistory];
    await saveHistory(updatedHistory);
  } catch (error) {
    console.warn('Failed to add to history:', error);
  }
};

/**
 * Remove item from history
 */
export const removeFromHistory = async (itemId: string): Promise<void> => {
  try {
    const currentHistory = await loadHistory();
    const updatedHistory = currentHistory.filter(item => item.id !== itemId);
    await saveHistory(updatedHistory);
  } catch (error) {
    console.warn('Failed to remove from history:', error);
  }
};

/**
 * Load recent searches from storage
 */
export const loadRecentSearches = async (): Promise<any[]> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to load recent searches:', error);
  }
  
  return [];
};

/**
 * Save recent search to storage
 */
export const saveRecentSearch = async (search: any): Promise<void> => {
  try {
    if (search === null) {
      // Clear all recent searches
      await AsyncStorage.removeItem(STORAGE_KEYS.RECENT_SEARCHES);
      return;
    }

    const currentSearches = await loadRecentSearches();
    const updatedSearches = [search, ...currentSearches.filter(s => s.query !== search.query)].slice(0, 10);
    await AsyncStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(updatedSearches));
  } catch (error) {
    console.warn('Failed to save recent search:', error);
  }
};