import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{
          headerShown: false,
          headerLeft: () => null,
          gestureEnabled: false,
        }} />
        <Stack.Screen name="HomeScreen" options={{
          title: "Home Page",
          headerLeft: () => null,      // removes the back button
          gestureEnabled: false,       // disables swipe back
          headerBackVisible: false,    // hides back button in newer versions
          headerShown: true,
        }} />
        <Stack.Screen name="SearchScreenWrapper" options={{
          title: "Search Products",
          headerShown: true,}} />
        <Stack.Screen name="ScanScreen" options={{
          title: "Scan Product",}} />
        <Stack.Screen name="scanner" options={{
          title:"Scan Product",}} />
        <Stack.Screen name="HistoryScreen" options={{
          title: "Scan History",}} />
        <Stack.Screen name="SettingsScreen" options={{
          title: "Settings",}} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}