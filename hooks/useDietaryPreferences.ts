/**
 * Hook for managing dietary preferences
 * Handles storage and retrieval of user's dietary restrictions
 */

import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { getDietaryProfile } from '../types/dietary';

const DIETARY_PREFERENCE_KEY = 'nutrilens_dietary_preference';

export const useDietaryPreferences = () => {
  const [selectedDiet, setSelectedDiet] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load dietary preference on mount
  useEffect(() => {
    loadDietaryPreference();
  }, []);

  const loadDietaryPreference = async () => {
    try {
      const storedDiet = await SecureStore.getItemAsync(DIETARY_PREFERENCE_KEY);
      if (storedDiet) {
        setSelectedDiet(storedDiet);
      }
    } catch (error) {
      console.error('Error loading dietary preference:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveDietaryPreference = async (dietId: string | null) => {
    try {
      if (dietId) {
        await SecureStore.setItemAsync(DIETARY_PREFERENCE_KEY, dietId);
      } else {
        await SecureStore.deleteItemAsync(DIETARY_PREFERENCE_KEY);
      }
      setSelectedDiet(dietId);
    } catch (error) {
      console.error('Error saving dietary preference:', error);
      throw error;
    }
  };

  const clearDietaryPreference = async () => {
    await saveDietaryPreference(null);
  };

  const selectedProfile = selectedDiet ? getDietaryProfile(selectedDiet) : null;

  return {
    selectedDiet,
    selectedProfile,
    loading,
    saveDietaryPreference,
    clearDietaryPreference,
  };
};
