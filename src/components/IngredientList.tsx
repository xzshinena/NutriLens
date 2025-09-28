/**
 * Ingredient list component displaying colored chips
 */
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../lib/colors';
import { typography } from '../lib/typography';
import { IngredientFlag } from '../types';
import IngredientChip from './IngredientChip';

interface IngredientListProps {
  ingredients: IngredientFlag[];
  title?: string;
}

const IngredientList: React.FC<IngredientListProps> = ({ 
  ingredients, 
  title = 'Ingredients' 
}) => {
  if (ingredients.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.emptyText}>No ingredients listed</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipContainer}
      >
        {ingredients.map((ingredient, index) => (
          <IngredientChip
            key={`${ingredient.ingredient}-${index}`}
            text={ingredient.ingredient}
            flag={ingredient.flag}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.primary,
    marginBottom: 12,
  },
  chipContainer: {
    paddingRight: 16,
  },
  emptyText: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
});

export default IngredientList;
