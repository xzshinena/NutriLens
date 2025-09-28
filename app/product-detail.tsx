/**
 * Product detail screen showing comprehensive product information
 */
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import GlobalHeader from '../components/GlobalHeader';
import { colors } from '../lib/colors';
import { typography } from '../lib/typography';

const ProductDetailScreen: React.FC = () => {
  const router = useRouter();

  // Mock product data
  const product = {
    name: 'Organic Whole Milk',
    brand: 'Happy Cow Dairy',
    image: 'https://via.placeholder.com/300x200/FFFFFF/718096?text=Product+Image',
    rating: 4.2,
    maxRating: 5,
    summary: 'This organic whole milk is a nutritious dairy option with wholesome ingredients. It provides a good source of calcium, protein, and vitamin D while being free from artificial hormones and antibiotics. The organic certification ensures high-quality farming practices.',
    ingredients: [
      'Organic whole milk',
      'Vitamin D3',
      'Natural flavors'
    ]
  };

  const renderStars = (rating: number, maxRating: number) => {
    const stars = [];
    for (let i = 1; i <= maxRating; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={20}
          color={i <= rating ? colors.accentBlue : colors.text.secondary}
          style={styles.star}
        />
      );
    }
    return stars;
  };

  return (
    <View style={styles.container}>
      <GlobalHeader showBackButton={true} title={product.name} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image }}
            style={styles.productImage}
            defaultSource={{
              uri: 'https://via.placeholder.com/300x200/F7F7FA/718096?text=No+Image',
            }}
          />
        </View>

        {/* Brand Name */}
        <Text style={styles.brandName}>{product.brand}</Text>

        {/* Rating Section */}
        <View style={styles.ratingSection}>
          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>
              {renderStars(product.rating, product.maxRating)}
            </View>
            <Text style={styles.ratingText}>{product.rating}/{product.maxRating}</Text>
          </View>
          <Text style={styles.ratingDescription}>Based on nutritional analysis</Text>
        </View>

        {/* Summary Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <Text style={styles.sectionContent}>{product.summary}</Text>
        </View>

        {/* Ingredients Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          <Text style={styles.ingredientsText}>
            {product.ingredients.join(', ')}
          </Text>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutralBG,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  productImage: {
    width: 300,
    height: 200,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  brandName: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  star: {
    marginRight: 2,
  },
  ratingText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.primary,
  },
  ratingDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.primary,
    marginBottom: 12,
  },
  sectionContent: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    lineHeight: 22,
  },
  ingredientsText: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    lineHeight: 22,
  },
});

export default ProductDetailScreen;
