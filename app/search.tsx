/**
 * Search screen for finding products
 */
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import EmptyState from '../components/EmptyState';
import SearchBar from '../components/SearchBar';
import VerdictBadge from '../components/VerdictBadge';
import { colors } from '../lib/colors';
import { typography } from '../lib/typography';
import { analyzeProduct } from '../lib/verdict';

// Mock product database
const mockProducts = [
  {
    id: '1',
    name: 'Organic Whole Milk',
    brand: 'Happy Cow Dairy',
    barcode: '1234567890123',
    ingredients: ['Organic Milk', 'Vitamin D3'],
    nutrition: {
      calories: 150,
      protein: 8,
      carbs: 12,
      fat: 8,
      sugar: 12,
      sodium: 120,
    },
    image: 'https://via.placeholder.com/200x200/36C090/FFFFFF?text=Milk',
  },
  {
    id: '2',
    name: 'Gluten-Free Bread',
    brand: 'Nature\'s Best',
    barcode: '2345678901234',
    ingredients: ['Rice Flour', 'Water', 'Seeds', 'Honey'],
    nutrition: {
      calories: 80,
      protein: 3,
      carbs: 15,
      fat: 1,
      sugar: 2,
      sodium: 150,
    },
    image: 'https://via.placeholder.com/200x200/36C090/FFFFFF?text=Bread',
  },
  {
    id: '3',
    name: 'Chocolate Chip Cookies',
    brand: 'Sweet Treats',
    barcode: '3456789012345',
    ingredients: ['Flour', 'Sugar', 'Chocolate Chips', 'Butter'],
    nutrition: {
      calories: 140,
      protein: 2,
      carbs: 18,
      fat: 7,
      sugar: 8,
      sodium: 100,
    },
    image: 'https://via.placeholder.com/200x200/36C090/FFFFFF?text=Cookies',
  },
  {
    id: '4',
    name: 'Greek Yogurt',
    brand: 'Chobani',
    barcode: '4567890123456',
    ingredients: ['Cultured Pasteurized Non-Fat Milk', 'Live Active Cultures'],
    nutrition: {
      calories: 100,
      protein: 15,
      carbs: 6,
      fat: 0,
      sugar: 6,
      sodium: 65,
    },
    image: 'https://via.placeholder.com/200x200/36C090/FFFFFF?text=Yogurt',
  },
  {
    id: '5',
    name: 'Coca Cola',
    brand: 'Coca Cola Company',
    barcode: '5678901234567',
    ingredients: ['Carbonated Water', 'High Fructose Corn Syrup', 'Caramel Color', 'Phosphoric Acid'],
    nutrition: {
      calories: 140,
      protein: 0,
      carbs: 39,
      fat: 0,
      sugar: 39,
      sodium: 45,
    },
    image: 'https://via.placeholder.com/200x200/36C090/FFFFFF?text=Cola',
  },
  {
    id: '6',
    name: 'Oreo Cookies',
    brand: 'Nabisco',
    barcode: '6789012345678',
    ingredients: ['Sugar', 'Unbleached Enriched Flour', 'Palm Oil', 'Cocoa'],
    nutrition: {
      calories: 140,
      protein: 2,
      carbs: 21,
      fat: 5,
      sugar: 13,
      sodium: 90,
    },
    image: 'https://via.placeholder.com/200x200/36C090/FFFFFF?text=Oreo',
  },
  {
    id: '7',
    name: 'Granola Bar',
    brand: 'Nature Valley',
    barcode: '7890123456789',
    ingredients: ['Oats', 'Honey', 'Nuts', 'Dried Fruit'],
    nutrition: {
      calories: 190,
      protein: 4,
      carbs: 29,
      fat: 6,
      sugar: 12,
      sodium: 160,
    },
    image: 'https://via.placeholder.com/200x200/36C090/FFFFFF?text=Granola',
  },
  {
    id: '8',
    name: 'Instant Noodles',
    brand: 'Maruchan',
    barcode: '8901234567890',
    ingredients: ['Wheat Flour', 'Palm Oil', 'Salt', 'Monosodium Glutamate'],
    nutrition: {
      calories: 190,
      protein: 4,
      carbs: 26,
      fat: 7,
      sugar: 1,
      sodium: 860,
    },
    image: 'https://via.placeholder.com/200x200/36C090/FFFFFF?text=Noodles',
  },
  {
    id: '9',
    name: 'Protein Bar',
    brand: 'Quest',
    barcode: '9012345678901',
    ingredients: ['Protein Blend', 'Almonds', 'Erythritol', 'Cocoa'],
    nutrition: {
      calories: 190,
      protein: 20,
      carbs: 15,
      fat: 8,
      sugar: 1,
      sodium: 200,
    },
    image: 'https://via.placeholder.com/200x200/36C090/FFFFFF?text=Protein',
  },
];

const SearchScreen: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Greek Yogurt',
    'Protein Bar',
    'Diet Coke',
  ]);

  const popularSearches = [
    'Coca Cola',
    'Oreo',
    'Greek Yogurt',
    'Granola Bar',
    'Instant Noodles',
    'Protein Bar',
  ];

  // Filter products based on search query
  const filteredProducts = mockProducts.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProductPress = (product: any) => {
    // Navigate to product detail screen
    router.push('/product-detail');
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleSearchClick = (term: string) => {
    setSearchQuery(term);
    setRecentSearches((prev) => {
      const updated = [term, ...prev.filter((t) => t !== term)];
      return updated.slice(0, 5); // keep max 5 recents
    });
  };

  // Mock settings for verdict analysis
  const mockSettings = {
    noDairy: false,
    noGluten: false,
    noMeat: false,
    noNuts: false,
    noSoy: false,
  };

  return (
    <View style={styles.container}>
      {/* Custom Header with Search Bar */}
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <View style={styles.searchContainer}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search for food products..."
              onClear={handleClearSearch}
              showContainer={false}
            />
          </View>
          <TouchableOpacity onPress={() => router.push('/settings')} style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Popular Searches */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Searches</Text>
          <View style={styles.tagsContainer}>
            {popularSearches.map((term) => (
              <TouchableOpacity
                key={term}
                style={styles.tag}
                onPress={() => handleSearchClick(term)}
              >
                <Text style={styles.tagText}>{term}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            {recentSearches.map((term) => (
              <TouchableOpacity
                key={term}
                style={styles.recentItem}
                onPress={() => handleSearchClick(term)}
              >
                <Text style={styles.recentText}>{term}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Search Results */}
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const verdict = analyzeProduct(product, mockSettings);
            return (
              <TouchableOpacity
                key={product.id}
                style={styles.productItem}
                onPress={() => handleProductPress(product)}
                activeOpacity={0.7}
              >
                <View style={styles.productImageContainer}>
                  <Image
                    source={{
                      uri: product.image || 'https://via.placeholder.com/60x60/F7F7FA/718096?text=No+Image',
                    }}
                    style={styles.productImage}
                    defaultSource={{
                      uri: 'https://via.placeholder.com/60x60/F7F7FA/718096?text=No+Image',
                    }}
                  />
                </View>

                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {product.name}
                  </Text>
                  <Text style={styles.productBrand} numberOfLines={1}>
                    {product.brand}
                  </Text>
                </View>

                <View style={styles.verdictContainer}>
                  <VerdictBadge verdict={verdict.productVerdict} size="small" />
                </View>
              </TouchableOpacity>
            );
          })
        ) : searchQuery.trim() ? (
          <EmptyState
            title="No Products Found"
            message="Hoot! Try another word or check your spelling."
            mood="concerned"
          />
        ) : null}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutralBG,
  },
  headerContainer: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.text.secondary + '20',
    paddingTop: 48,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  searchContainer: {
    flex: 1,
  },
  settingsButton: {
    padding: 8,
    marginLeft: 12,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
    marginBottom: 12,
    color: colors.text.primary,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tag: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  tagText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
  },
  recentItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  recentText: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    minHeight: 80,
  },
  productImageContainer: {
    marginRight: 12,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.primary,
    marginBottom: 4,
  },
  productBrand: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  verdictContainer: {
    marginLeft: 12,
  },
});

export default SearchScreen;