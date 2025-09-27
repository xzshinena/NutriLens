/**
 * Dietary Restriction Selector Component
 * Core logic for selecting and managing dietary restrictions (UI removed)
 */

import { Alert } from 'react-native';
import { DietaryRestriction, getAllDietaryProfiles } from '../types/dietary';

interface DietarySelectorProps {
  selectedDiet: string | null;
  onDietSelect: (dietId: string | null) => void;
}

export const DietarySelector = (props: any) => {
  const { selectedDiet, onDietSelect } = props;

  // Get all available dietary profiles
  const dietaryProfiles = getAllDietaryProfiles();
  const selectedProfile = dietaryProfiles.find(diet => diet.id === selectedDiet);

  // Handle diet selection
  const handleDietSelect = (dietId: string) => {
    onDietSelect(dietId);
  };

  // Handle clearing selection with confirmation
  const handleClearSelection = () => {
    Alert.alert(
      'Clear Dietary Restriction',
      'Are you sure you want to clear your dietary restriction?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => {
            onDietSelect(null);
          }
        }
      ]
    );
  };

  // Get profile by ID
  const getProfileById = (dietId: string): DietaryRestriction | null => {
    return dietaryProfiles.find(diet => diet.id === dietId) || null;
  };

  // Get all available profiles
  const getAllProfiles = (): DietaryRestriction[] => {
    return dietaryProfiles;
  };

  // Check if a diet is selected
  const hasSelection = (): boolean => {
    return selectedDiet !== null;
  };

  // Return the core functions and data (no UI)
  return {
    selectedProfile,
    dietaryProfiles,
    handleDietSelect,
    handleClearSelection,
    getProfileById,
    getAllProfiles,
    hasSelection
  };
  
};