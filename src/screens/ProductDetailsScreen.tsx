import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../lib/colors';
import { Product } from '../types';

const ProductDetailsScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { product } = route.params as { product: Product };

  // Hardcoded data for now
  const rating = 4.2;
  const summary = "This organic granola bar is a nutritious snack option with wholesome ingredients. It provides a good source of fiber and protein while being relatively low in added sugars. The combination of oats, nuts, and dried fruits offers a balanced nutritional profile.";
  const ingredients = "Organic rolled oats, organic honey, organic almonds, organic dried cranberries, organic sunflower seeds, organic coconut oil, organic vanilla extract, sea salt.";

  const handleGoBack = () => {
    (navigation as any).goBack();
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header with back button and product name */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
          <Text style={styles.brandName} numberOfLines={1}>{product.brand}</Text>
        </View>
      </View>

      {/* Product photo */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=Product+Image' }}
          style={styles.productImage}
          resizeMode="cover"
        />
      </View>

      {/* Rating section */}
      <View style={styles.ratingContainer}>
        <View style={styles.ratingRow}>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name={star <= Math.floor(rating) ? 'star' : star === Math.ceil(rating) && rating % 1 !== 0 ? 'star-half' : 'star-outline'}
                size={20}
                color={colors.accentBlue}
              />
            ))}
          </View>
          <Text style={styles.ratingText}>{rating}/5</Text>
        </View>
        <Text style={styles.ratingSubtext}>Based on nutritional analysis</Text>
      </View>

      {/* Summary section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Summary</Text>
        <Text style={styles.summaryText}>{summary}</Text>
      </View>

      {/* Ingredients section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ingredients</Text>
        <Text style={styles.ingredientsText}>{ingredients}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutralBG,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  brandName: {
    fontSize: 16,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  imageContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  ratingContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 12,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  ratingSubtext: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.primary,
  },
  ingredientsText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.primary,
  },
});

export default ProductDetailsScreen;
