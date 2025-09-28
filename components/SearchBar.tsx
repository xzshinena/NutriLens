/**
 * Search bar component with rounded design
 */
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { colors } from '../lib/colors';
import { typography } from '../lib/typography';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  onSubmitEditing?: () => void;
  showContainer?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  value, 
  onChangeText, 
  placeholder = 'Search products...',
  onClear,
  onSubmitEditing,
  showContainer = true
}) => {
  const searchContent = (
    <View style={styles.searchContainer}>
      <Ionicons 
        name="search" 
        size={20} 
        color={colors.text.secondary} 
        style={styles.searchIcon}
      />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.text.secondary}
        returnKeyType="search"
        clearButtonMode="never"
        onSubmitEditing={onSubmitEditing}
      />
      {value.length > 0 && onClear && (
        <TouchableOpacity 
          onPress={onClear}
          style={styles.clearButton}
          accessibilityLabel="Clear search"
        >
          <Ionicons 
            name="close-circle" 
            size={20} 
            color={colors.text.secondary} 
          />
        </TouchableOpacity>
      )}
    </View>
  );

  if (showContainer) {
    return (
      <View style={styles.container}>
        {searchContent}
      </View>
    );
  }

  return searchContent;
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: colors.surface,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutralBG,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
  },
  searchIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    fontFamily: typography.fontFamily.regular,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
});

export default SearchBar;