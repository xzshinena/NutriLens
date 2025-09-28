/**
 * Ingredient chip component with color-coded safety status
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../lib/colors';
import { typography } from '../lib/typography';
import { IngredientChipProps } from '../types';

const IngredientChip: React.FC<IngredientChipProps> = ({ text, flag }) => {
  const getChipConfig = () => {
    switch (flag) {
      case 'safe':
        return {
          backgroundColor: colors.surface,
          borderColor: colors.primaryGreen,
          textColor: colors.primaryGreen,
        };
      case 'caution':
        return {
          backgroundColor: colors.warnYellow + '20', // 20% opacity
          borderColor: colors.warnYellow,
          textColor: colors.text.primary,
        };
      case 'avoid':
        return {
          backgroundColor: colors.alertRed + '20', // 20% opacity
          borderColor: colors.alertRed,
          textColor: colors.text.primary,
        };
    }
  };

  const config = getChipConfig();

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: config.backgroundColor,
        borderColor: config.borderColor,
      }
    ]}>
      <Text style={[
        styles.text,
        { color: config.textColor }
      ]}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.normal * typography.fontSize.sm,
  },
});

export default IngredientChip;
