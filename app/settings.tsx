/**
 * Settings screen - Dietary Preferences
 */
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import GlobalHeader from '../components/GlobalHeader';
import { useDietaryPreferences } from '../components/scanner/useDietaryPreferences';
import { colors } from '../lib/colors';
import { getAllDietaryProfiles } from '../lib/dietary';
import { typography } from '../lib/typography';

const SettingsScreen: React.FC = () => {
  // Use the same dietary preferences system as the scanner
  const { selectedDiet, selectedProfile, saveDietaryPreference, loading } = useDietaryPreferences();
  
  // Get all available dietary profiles
  const allDietaryProfiles = getAllDietaryProfiles();

  const handleDietarySelect = async (dietId: string) => {
    try {
      // Toggle: if already selected, deselect it
      const newDietId = selectedDiet === dietId ? null : dietId;
      await saveDietaryPreference(newDietId);
    } catch (error) {
      console.error('Error saving dietary preference:', error);
    }
  };


  return (
    <View style={styles.container}>
      <GlobalHeader showBackButton={true} title="Settings" />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Dietary Preferences Section */}
        <View style={[styles.section, styles.firstSection]}>
          <Text style={styles.sectionTitle}>Dietary Preferences</Text>
          
          {selectedProfile && (
            <View style={styles.currentSelectionBanner}>
              <Text style={styles.currentSelectionText}>
                Current Selection: {selectedProfile.emoji} {selectedProfile.name}
              </Text>
              <Text style={styles.currentSelectionDescription}>
                {selectedProfile.description}
              </Text>
            </View>
          )}
          
          <Text style={styles.sectionDescription}>
            {selectedProfile 
              ? "Tap another diet to switch, or tap your current selection to remove it."
              : "Select your dietary restriction for personalized food scanning."
            }
          </Text>
          
          {allDietaryProfiles.map((diet, index) => (
            <TouchableOpacity
              key={diet.id}
              style={[
                styles.preferenceItem,
                selectedDiet === diet.id && styles.selectedPreferenceItem,
                index === allDietaryProfiles.length - 1 && styles.lastItem
              ]}
              onPress={() => handleDietarySelect(diet.id)}
            >
              <View style={styles.preferenceLeft}>
                <View style={styles.emojiContainer}>
                  <Text style={styles.emoji}>{diet.emoji}</Text>
                </View>
                <View style={styles.preferenceTextContainer}>
                  <Text style={[
                    styles.preferenceLabel,
                    selectedDiet === diet.id && styles.selectedPreferenceLabel
                  ]}>
                    {diet.name}
                  </Text>
                  <Text style={styles.preferenceDescription}>
                    Avoids: {diet.avoidIngredients.join(', ')}
                  </Text>
                </View>
              </View>
              {selectedDiet === diet.id && (
                <Ionicons 
                  name="checkmark-circle" 
                  size={24} 
                  color={colors.accentBlue} 
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Help & Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Help & Info</Text>
          <TouchableOpacity style={styles.infoItem}>
            <View style={styles.infoLeft}>
              <View style={styles.emojiContainer}>
                <Text style={styles.emoji}>🎨</Text>
              </View>
              <Text style={styles.infoLabel}>About the Colors</Text>
            </View>
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color={colors.text.secondary} 
            />
          </TouchableOpacity>
        </View>

        {/* App Information */}
        <View style={styles.appInfoSection}>
          <Text style={styles.appName}>NutriLens</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.appTagline}>Helping kids make safe food choices</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutralBG,
    paddingTop: 15,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerMessage: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    textAlign: 'center',
    marginVertical: 20,
    lineHeight: 22,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
  },
  firstSection: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.primary,
    padding: 20,
    paddingBottom: 12,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.text.secondary + '20',
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emojiContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  emoji: {
    fontSize: 20,
  },
  preferenceLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  appInfoSection: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 40,
  },
  appName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.primary,
    marginBottom: 4,
  },
  appVersion: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  appTagline: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  // New styles for dietary preferences
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
  },
  currentSelectionBanner: {
    backgroundColor: colors.accentBlue + '10',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.accentBlue + '30',
  },
  currentSelectionText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.accentBlue,
    marginBottom: 4,
  },
  currentSelectionDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  sectionDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  selectedPreferenceItem: {
    backgroundColor: colors.accentBlue + '05',
    borderWidth: 1,
    borderColor: colors.accentBlue + '20',
  },
  preferenceTextContainer: {
    flex: 1,
  },
  preferenceDescription: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
    marginTop: 2,
  },
  selectedPreferenceLabel: {
    color: colors.accentBlue,
    fontWeight: typography.fontWeight.semiBold,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
});

export default SettingsScreen;
