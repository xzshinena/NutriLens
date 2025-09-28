// SearchScreenWrapper.tsx
import React from 'react';
import { SettingsProvider } from '../src/context/SettingsContext';
import SearchScreen from './SearchScreen';

const SearchScreenWrapper: React.FC = () => (
  <SettingsProvider>
    <SearchScreen />
  </SettingsProvider>
);

export default SearchScreenWrapper;
