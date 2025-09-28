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
        <Stack.Screen name="index" options={{ title: 'Login',
          headerLeft: () => null, // removes back arrow
          gestureEnabled: false,  // disables swipe back on iOS
          headerShown: true,
        }} />
        <Stack.Screen name="main_menu" options={{ title: 'NutriLens', headerShown: false }} />
        <Stack.Screen name="scanner" options={{ title: 'Scan Product', headerShown: false }} />
        <Stack.Screen name="search" options={{ title: 'Search Products', headerShown: false }} />
        <Stack.Screen name="history_menu" options={{ title: 'History', headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
