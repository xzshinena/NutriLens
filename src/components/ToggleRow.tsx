/**
 * Toggle row component for settings switches
 */
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../lib/colors';
import { typography } from '../lib/typography';
import { ToggleRowProps } from '../types';

const ToggleRow: React.FC<ToggleRowProps> = ({ 
  iconName, 
  label, 
  value, 
  onToggle 
}) => {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onToggle(!value)}
      activeOpacity={0.7}
      accessibilityRole="switch"
      accessibilityLabel={`${label}: ${value ? 'on' : 'off'}`}
      accessibilityHint={`Toggle ${label} setting`}
    >
      <View style={styles.leftContent}>
        <View style={styles.iconContainer}>
          <Ionicons 
            name={iconName as keyof typeof Ionicons.glyphMap} 
            size={24} 
            color={colors.accentBlue} 
          />
        </View>
        <Text style={styles.label}>{label}</Text>
      </View>
      
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{
          false: colors.neutralBG,
          true: colors.primaryGreen,
        }}
        thumbColor={value ? colors.surface : colors.text.secondary}
        ios_backgroundColor={colors.neutralBG}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginBottom: 12,
    minHeight: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.neutralBG,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  label: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    flex: 1,
  },
});

export default ToggleRow;
