/**
 * Search screen for finding products using OpenFoodFacts database
 */
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import { SearchResult } from '../services/OpenFoodFactsAPI';
import { Product } from '../types';

// Default placeholder image
const DEFAULT_IMAGE = 'https://via.placeholder.com/60x60/F7F7FA/718096?text=No+Image';

// Convert SearchResult to Product for verdict analysis
const convertToProduct = (searchResult: SearchResult): Product => {
  return {
    id: searchResult.id,
    name: searchResult.name,
    brand: searchResult.brand,
    ingredients: Array.isArray(searchResult.ingredients) 
      ? searchResult.ingredients 
      : searchResult.ingredients 
        ? [searchResult.ingredients] 
        : [],
    nutrition: searchResult.nutrition ? {
      calories: searchResult.nutrition.calories,
      protein: searchResult.nutrition.protein,
      carbs: searchResult.nutrition.carbs,
      fat: searchResult.nutrition.fat,
      sugar: searchResult.nutrition.sugars,
      sodium: searchResult.nutrition.sodium,
    } : undefined,
    image: searchResult.image,
  };
};

const SearchScreen: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [popularProducts, setPopularProducts] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Greek Yogurt',
    'Protein Bar',
    'Diet Coke',
  ]);

  const trendingSearches = [
    'Coca Cola',
    'Nutella',
    'Oreo Cookies',
    'Greek Yogurt',
    'Protein Bar',
    'Diet Coke',
    'Granola Bar'
  ];

  // Load hardcoded popular products on component mount
  useEffect(() => {
    loadPopularProducts();
  }, []);

  // Load search suggestions when query changes
  useEffect(() => {
    if (searchQuery.length >= 2) {
      loadSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const loadPopularProducts = async () => {
    try {
      setIsLoading(true);
      // Use hardcoded popular products instead of API call
      const hardcodedProducts: SearchResult[] = [
        {
          id: '1',
          name: 'Coca Cola',
          brand: 'Coca Cola Company',
          barcode: '049000028911',
          image: 'https://images.openfoodfacts.org/images/products/049/000/028/911/front_en.4.400.jpg',
          nutrition: {
            calories: 140,
            carbs: 39,
            sugars: 39,
            fat: 0,
            protein: 0,
            sodium: 45,
          },
          ingredients: ['Carbonated water', 'sugar', 'caramel color', 'phosphoric acid', 'natural flavors', 'caffeine'],
        },
        {
          id: '2',
          name: 'Nutella',
          brand: 'Ferrero',
          barcode: '3017620422003',
          image: 'https://images.openfoodfacts.org/images/products/301/762/042/2003/front_en.4.400.jpg',
          nutrition: {
            calories: 539,
            carbs: 57,
            sugars: 56,
            fat: 31,
            protein: 6,
            sodium: 0,
          },
          ingredients: ['Sugar', 'palm oil', 'hazelnuts', 'skimmed milk powder', 'cocoa powder', 'lecithin', 'vanillin'],
        },
        {
          id: '3',
          name: 'Oreo Cookies',
          brand: 'Nabisco',
          barcode: '044000037246',
          image: 'https://images.openfoodfacts.org/images/products/044/000/037/246/front_en.4.400.jpg',
          nutrition: {
            calories: 140,
            carbs: 21,
            sugars: 13,
            fat: 5,
            protein: 2,
            sodium: 90,
          },
          ingredients: ['Sugar', 'unbleached enriched flour', 'palm oil', 'cocoa', 'high fructose corn syrup', 'leavening', 'salt', 'soy lecithin', 'vanillin'],
        },
        {
          id: '4',
          name: 'Greek Yogurt',
          brand: 'Chobani',
          barcode: '818290010221',
          image: 'https://images.openfoodfacts.org/images/products/818/290/010/221/front_en.4.400.jpg',
          nutrition: {
            calories: 100,
            carbs: 6,
            sugars: 6,
            fat: 0,
            protein: 15,
            sodium: 65,
          },
          ingredients: ['Cultured pasteurized non-fat milk', 'live active cultures'],
        },
        {
          id: '5',
          name: 'Protein Bar',
          brand: 'Quest',
          barcode: '853200007001',
          image: 'https://images.openfoodfacts.org/images/products/853/200/007/001/front_en.4.400.jpg',
          nutrition: {
            calories: 190,
            carbs: 15,
            sugars: 1,
            fat: 8,
            protein: 20,
            sodium: 200,
          },
          ingredients: ['Protein blend', 'almonds', 'erythritol', 'cocoa', 'natural flavors'],
        },
        {
          id: '6',
          name: 'Diet Coke',
          brand: 'Coca Cola Company',
          barcode: '049000042000',
          image: 'https://images.openfoodfacts.org/images/products/049/000/042/000/front_en.4.400.jpg',
          nutrition: {
            calories: 0,
            carbs: 0,
            sugars: 0,
            fat: 0,
            protein: 0,
            sodium: 40,
          },
          ingredients: ['Carbonated water', 'caramel color', 'phosphoric acid', 'aspartame', 'potassium benzoate', 'natural flavors', 'caffeine', 'acesulfame potassium'],
        },
        {
          id: '7',
          name: 'Granola Bar',
          brand: 'Nature Valley',
          barcode: '016000275200',
          image: 'https://images.openfoodfacts.org/images/products/016/000/275/200/front_en.4.400.jpg',
          nutrition: {
            calories: 190,
            carbs: 29,
            sugars: 12,
            fat: 6,
            protein: 4,
            sodium: 160,
          },
          ingredients: ['Whole grain oats', 'sugar', 'canola oil', 'rice flour', 'honey', 'salt', 'baking soda', 'natural flavor'],
        },
      ];
      setPopularProducts(hardcodedProducts);
    } catch (error) {
      console.error('Error loading popular products:', error);
      // Don't show alert for hardcoded data
    } finally {
      setIsLoading(false);
    }
  };

  const loadSuggestions = useCallback(async () => {
    try {
      // Use hardcoded suggestions that match our popular products
      const hardcodedSuggestions = [
        'Coca Cola',
        'Nutella',
        'Oreo Cookies',
        'Greek Yogurt',
        'Protein Bar',
        'Diet Coke',
        'Granola Bar'
      ].filter(term => 
        term.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(hardcodedSuggestions);
    } catch (error) {
      console.error('Error loading suggestions:', error);
    }
  }, [searchQuery]);

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      
      // Use hardcoded search results instead of API call
      const hardcodedSearchResults: SearchResult[] = [
        {
          id: 'search-1',
          name: 'Coca Cola',
          brand: 'Coca Cola Company',
          barcode: '049000028911',
          image: 'https://images.openfoodfacts.org/images/products/049/000/028/911/front_en.4.400.jpg',
          nutrition: {
            calories: 140,
            carbs: 39,
            sugars: 39,
            fat: 0,
            protein: 0,
            sodium: 45,
          },
          ingredients: ['Carbonated water', 'sugar', 'caramel color', 'phosphoric acid', 'natural flavors', 'caffeine'],
        },
        {
          id: 'search-2',
          name: 'Diet Coke',
          brand: 'Coca Cola Company',
          barcode: '049000042000',
          image: 'https://images.openfoodfacts.org/images/products/049/000/042/000/front_en.4.400.jpg',
          nutrition: {
            calories: 0,
            carbs: 0,
            sugars: 0,
            fat: 0,
            protein: 0,
            sodium: 40,
          },
          ingredients: ['Carbonated water', 'caramel color', 'phosphoric acid', 'aspartame', 'potassium benzoate', 'natural flavors', 'caffeine', 'acesulfame potassium'],
        },
        {
          id: 'search-3',
          name: 'Greek Yogurt',
          brand: 'Chobani',
          barcode: '818290010221',
          image: 'https://images.openfoodfacts.org/images/products/818/290/010/221/front_en.4.400.jpg',
          nutrition: {
            calories: 100,
            carbs: 6,
            sugars: 6,
            fat: 0,
            protein: 15,
            sodium: 65,
          },
          ingredients: ['Cultured pasteurized non-fat milk', 'live active cultures'],
        },
        {
          id: 'search-4',
          name: 'Protein Bar',
          brand: 'Quest',
          barcode: '853200007001',
          image: 'https://images.openfoodfacts.org/images/products/853/200/007/001/front_en.4.400.jpg',
          nutrition: {
            calories: 190,
            carbs: 15,
            sugars: 1,
            fat: 8,
            protein: 20,
            sodium: 200,
          },
          ingredients: ['Protein blend', 'almonds', 'erythritol', 'cocoa', 'natural flavors'],
        },
        {
          id: 'search-5',
          name: 'Granola Bar',
          brand: 'Nature Valley',
          barcode: '016000275200',
          image: 'https://images.openfoodfacts.org/images/products/016/000/275/200/front_en.4.400.jpg',
          nutrition: {
            calories: 190,
            carbs: 29,
            sugars: 12,
            fat: 6,
            protein: 4,
            sodium: 160,
          },
          ingredients: ['Whole grain oats', 'sugar', 'canola oil', 'rice flour', 'honey', 'salt', 'baking soda', 'natural flavor'],
        },
      ].filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.brand.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(hardcodedSearchResults);
      
      // Add to recent searches
      setRecentSearches((prev) => {
        const updated = [query, ...prev.filter((t) => t !== query)];
        return updated.slice(0, 5); // keep max 5 recents
      });
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Search Error', 'Failed to search products. Please try again.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleProductPress = (product: SearchResult) => {
    // Navigate to product detail screen with product data
    router.push({
      pathname: '/product-detail',
      params: {
        product: JSON.stringify(product)
      }
    });
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSuggestions([]);
  };

  const handleSearchClick = (term: string) => {
    setSearchQuery(term);
    
    // First, try to find an exact match in popular products
    const exactMatch = popularProducts.find(product => 
      product.name.toLowerCase() === term.toLowerCase() ||
      product.brand?.toLowerCase() === term.toLowerCase()
    );
    
    if (exactMatch) {
      // Navigate directly to the product detail page
      handleProductPress(exactMatch);
    } else {
      // If no exact match, perform a search
      performSearch(term);
    }
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      performSearch(searchQuery);
    }
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
              onSubmitEditing={handleSearchSubmit}
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
        {/* Search Suggestions */}
        {suggestions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Suggestions</Text>
            <View style={styles.tagsContainer}>
              {suggestions.map((term) => (
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
        )}

        {/* Trending Searches */}
        {!searchQuery && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trending Searches</Text>
            <View style={styles.tagsContainer}>
              {trendingSearches.map((term) => (
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
        )}

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

        {/* Popular Products */}
        {!searchQuery && !isLoading && popularProducts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular Products</Text>
            {popularProducts.map((product) => {
              const productForAnalysis = convertToProduct(product);
              const verdict = analyzeProduct(productForAnalysis, mockSettings);
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
                        uri: product.image || DEFAULT_IMAGE,
                      }}
                      style={styles.productImage}
                      defaultSource={{
                        uri: DEFAULT_IMAGE,
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
            })}
          </View>
        )}

        {/* Loading State */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primaryGreen} />
            <Text style={styles.loadingText}>Loading popular products...</Text>
          </View>
        )}

        {/* Search Results */}
        {searchQuery && (
          <>
            {isSearching ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primaryGreen} />
                <Text style={styles.loadingText}>Searching products...</Text>
              </View>
            ) : searchResults.length > 0 ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Search Results</Text>
                {searchResults.map((product) => {
                  const productForAnalysis = convertToProduct(product);
                  const verdict = analyzeProduct(productForAnalysis, mockSettings);
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
                            uri: product.image || DEFAULT_IMAGE,
                          }}
                          style={styles.productImage}
                          defaultSource={{
                            uri: DEFAULT_IMAGE,
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
                })}
              </View>
            ) : (
              <EmptyState
                title="No Products Found"
                message="Hoot! Try another word or check your spelling."
                mood="concerned"
              />
            )}
          </>
        )}
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
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    marginTop: 12,
    textAlign: 'center',
  },
});

export default SearchScreen;