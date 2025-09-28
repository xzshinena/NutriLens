/**
 * Settings screen for managing dietary preferences
 */
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import ToggleRow from '../src/components/ToggleRow';
import { useSettings } from '../src/context/SettingsContext';
import { colors } from '../src/lib/colors';
import { typography } from '../src/lib/typography';

const SettingsScreen: React.FC = () => {
  const { settings, updateSetting } = useSettings();

  const handleLogOut = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Log Out', 
          style: 'destructive',
          onPress: () => {
            // Mock logout - in a real app, this would clear user session
            Alert.alert('Logged Out', 'You have been logged out successfully.');
          }
        }
      ]
    );
  };

  const handleAboutColors = () => {
    Alert.alert(
      'About the Colors',
      '🟢 Green: Safe ingredients that won\'t upset your tummy\n🟡 Yellow: Check with a grown-up first\n🔴 Red: Avoid these ingredients\n\nThese colors help you quickly see which ingredients are safe for you!',
      [{ text: 'Got it!' }]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Dietary Preferences Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dietary Preferences</Text>
        <Text style={styles.sectionDescription}>
          Tell me what foods to watch out for, and I'll help you stay safe!
        </Text>
        
        <ToggleRow
          iconName="milk-outline"
          label="Avoid Dairy"
          value={settings.noDairy}
          onToggle={(value) => updateSetting('noDairy', value)}
        />
        
        <ToggleRow
          iconName="nutrition-outline"
          label="Avoid Gluten"
          value={settings.noGluten}
          onToggle={(value) => updateSetting('noGluten', value)}
        />
        
        <ToggleRow
          iconName="restaurant-outline"
          label="Avoid Meat"
          value={settings.noMeat}
          onToggle={(value) => updateSetting('noMeat', value)}
        />
        
        <ToggleRow
          iconName="leaf-outline"
          label="Avoid Nuts"
          value={settings.noNuts}
          onToggle={(value) => updateSetting('noNuts', value)}
        />
        
        <ToggleRow
          iconName="flower-outline"
          label="Avoid Soy"
          value={settings.noSoy}
          onToggle={(value) => updateSetting('noSoy', value)}
        />
      </View>

      {/* Help Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Help & Info</Text>
        
        <TouchableOpacity 
          style={styles.helpItem}
          onPress={handleAboutColors}
        >
          <View style={styles.helpItemContent}>
            <Ionicons name="color-palette-outline" size={24} color={colors.accentBlue} />
            <Text style={styles.helpItemText}>About the Colors</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
          </View>
        </TouchableOpacity>
      </View>

      {/* App Info */}
      <View style={styles.section}>
        <View style={styles.appInfo}>
          <Text style={styles.appName}>NutriLens</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.appDescription}>
            Helping kids make safe food choices
          </Text>
        </View>
      </View>

      {/* Log Out Button */}
      <TouchableOpacity 
        style={styles.logOutButton}
        onPress={handleLogOut}
      >
        <Ionicons name="log-out-outline" size={20} color={colors.alertRed} />
        <Text style={styles.logOutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutralBG,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    marginBottom: 20,
    lineHeight: typography.lineHeight.normal * typography.fontSize.base,
  },
  helpItem: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginBottom: 12,
  },
  helpItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  helpItemText: {
    flex: 1,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    marginLeft: 12,
  },
  appInfo: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  appName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: 4,
  },
  appVersion: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  appDescription: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: typography.lineHeight.normal * typography.fontSize.base,
  },
  logOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.alertRed,
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    minHeight: 48,
  },
  logOutText: {
    color: colors.alertRed,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
    marginLeft: 8,
  },
});

export default SettingsScreen;
