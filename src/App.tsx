/**
 * Main App component with font loading and navigation setup
 */
import { Nunito_400Regular, Nunito_500Medium, Nunito_600SemiBold, Nunito_700Bold, useFonts } from '@expo-google-fonts/nunito';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SettingsProvider } from './context/SettingsContext';
import { colors } from './lib/colors';
import { typography } from './lib/typography';
import AppNavigator from './navigation/AppNavigator';

const App: React.FC = () => {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (fontsLoaded) {
      // Small delay to ensure fonts are fully loaded
      setTimeout(() => setIsReady(true), 100);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded || !isReady) {
    return (
      <View style={styles.splashContainer}>
        <Text style={styles.splashText}>NutriLens</Text>
        <Text style={styles.splashSubtext}>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <SettingsProvider>
        <AppNavigator />
      </SettingsProvider>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.neutralBG,
  },
  splashText: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.accentBlue,
    marginBottom: 8,
  },
  splashSubtext: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
  },
});

export default App;
