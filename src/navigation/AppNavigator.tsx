/**
 * Main app navigator with stack and tab navigation
 */
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { colors } from '../lib/colors';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import { RootStackParamList } from '../types';
import RootNavigator from './RootNavigator';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTitleStyle: {
          color: colors.text.primary,
          fontSize: 18,
          fontWeight: '600',
        },
        headerTintColor: colors.text.primary,
      }}
    >
      <Stack.Screen 
        name="MainTabs" 
        component={RootNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ProductDetail" 
        component={ProductDetailsScreen}
        options={{ 
          title: 'Product Details',
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
