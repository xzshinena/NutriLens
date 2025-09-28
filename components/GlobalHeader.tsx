/**
 * Global header component with settings button
 */
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../lib/colors';

interface GlobalHeaderProps {
  showBackButton?: boolean;
  title?: string;
}

const GlobalHeader: React.FC<GlobalHeaderProps> = ({ 
  showBackButton = false, 
  title 
}) => {
  const router = useRouter();

  const handleSettingsPress = () => {
    router.push('/settings');
  };

  const handleBackPress = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {showBackButton && (
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackPress}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        )}
        {title && (
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>{title}</Text>
          </View>
        )}
      </View>
      
      <TouchableOpacity 
        style={styles.settingsButton}
        onPress={handleSettingsPress}
      >
        <Ionicons name="settings-outline" size={24} color={colors.text.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.text.secondary + '20',
    paddingTop: 50, // Account for status bar
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  settingsButton: {
    padding: 8,
  },
});

export default GlobalHeader;
