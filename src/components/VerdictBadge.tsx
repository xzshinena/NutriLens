/**
 * Verdict badge component showing product safety status
 */
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../lib/colors';
import { typography } from '../lib/typography';
import { VerdictBadgeProps } from '../types';

const VerdictBadge: React.FC<VerdictBadgeProps> = ({ 
  verdict, 
  size = 'medium' 
}) => {
  const getVerdictConfig = () => {
    switch (verdict) {
      case 'good':
        return {
          icon: 'checkmark-circle' as const,
          color: colors.primaryGreen,
          label: 'Good',
          backgroundColor: colors.surface,
        };
      case 'caution':
        return {
          icon: 'warning' as const,
          color: colors.warnYellow,
          label: 'Caution',
          backgroundColor: colors.surface,
        };
      case 'avoid':
        return {
          icon: 'close-circle' as const,
          color: colors.alertRed,
          label: 'Avoid',
          backgroundColor: colors.surface,
        };
    }
  };

  const config = getVerdictConfig();
  
  const getSizeConfig = () => {
    switch (size) {
      case 'small':
        return { iconSize: 16, fontSize: 12, padding: 6 };
      case 'large':
        return { iconSize: 24, fontSize: 16, padding: 12 };
      default: // medium
        return { iconSize: 20, fontSize: 14, padding: 8 };
    }
  };

  const sizeConfig = getSizeConfig();

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: config.backgroundColor,
        borderColor: config.color,
        paddingHorizontal: sizeConfig.padding,
        paddingVertical: sizeConfig.padding / 2,
      }
    ]}>
      <Ionicons 
        name={config.icon} 
        size={sizeConfig.iconSize} 
        color={config.color} 
        style={styles.icon}
      />
      <Text style={[
        styles.label,
        {
          color: config.color,
          fontSize: sizeConfig.fontSize,
        }
      ]}>
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 4,
  },
  label: {
    fontWeight: typography.fontWeight.medium,
  },
});

export default VerdictBadge;
