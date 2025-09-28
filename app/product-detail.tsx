/**
 * Product detail screen showing comprehensive product information
 */
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import GlobalHeader from '../components/GlobalHeader';
import { colors } from '../src/lib/colors';
import { typography } from '../src/lib/typography';
import { SearchResult } from '../services/OpenFoodFactsAPI';

const ProductDetailScreen: React.FC = () => {
  const router = useRouter();
  const { product: productParam } = useLocalSearchParams();

  // Parse product data from navigation params or use mock data
  let product: SearchResult;
  
  try {
    product = productParam ? JSON.parse(productParam as string) : {
      id: 'mock',
      name: 'Organic Whole Milk',
      brand: 'Happy Cow Dairy',
      barcode: '1234567890123',
      image: 'https://via.placeholder.com/300x200/FFFFFF/718096?text=Product+Image',
      nutrition: {
        calories: 150,
        protein: 8,
        carbs: 12,
        fat: 8,
        sugars: 12,
        sodium: 120,
      },
      ingredients: 'Organic whole milk, Vitamin D3, Natural flavors'
    };
  } catch (error) {
    console.error('Error parsing product data:', error);
    // Fallback to mock data
    product = {
      id: 'mock',
      name: 'Organic Whole Milk',
      brand: 'Happy Cow Dairy',
      barcode: '1234567890123',
      image: 'https://via.placeholder.com/300x200/FFFFFF/718096?text=Product+Image',
      nutrition: {
        calories: 150,
        protein: 8,
        carbs: 12,
        fat: 8,
        sugars: 12,
        sodium: 120,
      },
      ingredients: 'Organic whole milk, Vitamin D3, Natural flavors'
    };
  }

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
        {product.brand && <Text style={styles.brandName}>{product.brand}</Text>}
        
        {/* Barcode */}
        {product.barcode && (
          <Text style={styles.barcodeText}>Barcode: {product.barcode}</Text>
        )}

        {/* Product Summary Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Product Summary</Text>
          <Text style={styles.summaryText}>
            This product offers a convenient and delicious option for consumers looking for quality food items. 
            Made with carefully selected ingredients, it provides a satisfying experience while maintaining 
            high standards of taste and quality. The product is designed to meet modern dietary preferences 
            and lifestyle needs, offering both nutritional value and great flavor in every serving.
          </Text>
        </View>

        {/* Ingredients Section */}
        {product.ingredients && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <Text style={styles.ingredientsText}>
              {Array.isArray(product.ingredients) 
                ? product.ingredients.join(', ')
                : product.ingredients
              }
            </Text>
          </View>
        )}

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutralBG,
    paddingTop: 15,
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
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.surface,
  },
  brandName: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  barcodeText: {
    fontSize: typography.fontSize.sm,
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
  summaryText: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    lineHeight: 22,
    backgroundColor: colors.surfaceSecondary,
    padding: 16,
    borderRadius: 12,
  },
});

export default ProductDetailScreen;