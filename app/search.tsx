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
import { loadRecentSearches, saveRecentSearch } from '../lib/storage';
import { typography } from '../lib/typography';
import { analyzeProduct } from '../lib/verdict';
import { SearchResult, getSearchSuggestions, searchOpenFoodFacts } from '../services/OpenFoodFactsAPI';
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
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const trendingSearches = [
    'Häagen-Dazs Ice Cream',
    'Nutella',
    'Chobani Greek Yogurt',
    'Instant Ramen',
    'White Bread',
    'Ice Cream',
    'Greek Yogurt'
  ];

  // Load popular products and recent searches on component mount
  useEffect(() => {
    loadPopularProducts();
    loadRecentSearchesFromStorage();
  }, []);

  // Load search suggestions when query changes
  useEffect(() => {
    if (searchQuery.length >= 2) {
      loadSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const loadRecentSearchesFromStorage = async () => {
    try {
      const stored = await loadRecentSearches();
      const searchTerms = stored.map((item: any) => item.query || item).slice(0, 5);
      setRecentSearches(searchTerms);
      console.log(`✅ Loaded ${searchTerms.length} recent searches from storage`);
    } catch (error) {
      console.error('❌ Error loading recent searches:', error);
      setRecentSearches([]);
    }
  };

  const loadPopularProducts = async () => {
    try {
      setIsLoading(true);
      console.log('🔄 Loading hardcoded popular products...');
      
      // Use hardcoded popular products as requested
      const hardcodedProducts: SearchResult[] = [
        {
          id: '1',
          name: 'Häagen-Dazs Ice Cream',
          brand: 'Häagen-Dazs',
          barcode: '074170000000',
          image: 'https://d2lnr5mha7bycj.cloudfront.net/product-image/file/large_3ed27132-f536-4901-be1f-19a98a3615cf.jpg',
          nutrition: {
            calories: 250,
            carbs: 20,
            sugars: 19,
            fat: 16,
            protein: 4,
            sodium: 60,
          },
          ingredients: ['Cream', 'skim milk', 'sugar', 'egg yolks', 'vanilla extract', 'natural vanilla flavor'],
        },
        {
          id: '2',
          name: 'Nutella',
          brand: 'Ferrero',
          barcode: '3017620422003',
          image: 'https://m.media-amazon.com/images/I/81X4tA48x+L._UF1000,1000_QL80_.jpg',
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
          name: 'Chobani Greek Yogurt',
          brand: 'Chobani',
          barcode: '818290010221',
          image: 'https://www.chobani.com.au/wp-content/uploads/Chobani-Asia-Dist-Natural-Greek-Yogurt-907g-800x800-copy.webp',
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
          id: '4',
          name: 'Instant Ramen',
          brand: 'Maruchan',
          barcode: '079400000000',
          image: 'https://m.media-amazon.com/images/S/aplus-media-library-service-media/bc3978b7-5d28-400d-a930-c1719c7c441b.__CR0,0,679,679_PT0_SX300_V1___.png',
          nutrition: {
            calories: 190,
            carbs: 26,
            sugars: 1,
            fat: 7,
            protein: 5,
            sodium: 890,
          },
          ingredients: ['Enriched wheat flour', 'palm oil', 'salt', 'potassium carbonate', 'sodium carbonate', 'monosodium glutamate', 'lactose', 'soy sauce powder', 'garlic powder', 'onion powder'],
        },
        {
          id: '5',
          name: 'White Bread',
          brand: 'Wonder Bread',
          barcode: '072225000000',
          image: 'https://digital.loblaws.ca/PCX/20308743_EA/en/3/20308743_en_side_250.png',
          nutrition: {
            calories: 80,
            carbs: 15,
            sugars: 2,
            fat: 1,
            protein: 3,
            sodium: 170,
          },
          ingredients: ['Enriched wheat flour', 'water', 'high fructose corn syrup', 'yeast', 'salt', 'vegetable oil', 'calcium propionate', 'monoglycerides'],
        },
      ];
      
      setPopularProducts(hardcodedProducts);
      console.log(`✅ Loaded ${hardcodedProducts.length} hardcoded popular products`);
    } catch (error) {
      console.error('❌ Error loading popular products:', error);
      setPopularProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSuggestions = useCallback(async () => {
    try {
      console.log(`🔄 Loading suggestions for: "${searchQuery}"`);
      
      // Get real search suggestions from OpenFoodFacts
      const apiSuggestions = await getSearchSuggestions(searchQuery);
      setSuggestions(apiSuggestions);
      
      console.log(`✅ Found ${apiSuggestions.length} suggestions`);
    } catch (error) {
      console.error('❌ Error loading suggestions:', error);
      // Fallback to empty suggestions if API fails
      setSuggestions([]);
    }
  }, [searchQuery]);

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      console.log(`🔍 Searching OpenFoodFacts for: "${query}"`);
      
      // Search OpenFoodFacts API
      const results = await searchOpenFoodFacts(query, 1, 20);
      setSearchResults(results);
      
      console.log(`✅ Found ${results.length} search results`);
      
      // Save to persistent storage and update state
      await saveRecentSearch({ query, timestamp: new Date().toISOString() });
      const updatedSearches = await loadRecentSearches();
      const searchTerms = updatedSearches.map((item: any) => item.query || item).slice(0, 5);
      setRecentSearches(searchTerms);
    } catch (error) {
      console.error('❌ Search error:', error);
      Alert.alert(
        'Search Error', 
        'Unable to search products. Please check your internet connection and try again.',
        [{ text: 'OK' }]
      );
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

  const handleClearRecentSearches = async () => {
    await saveRecentSearch(null); // Clear from storage
    setRecentSearches([]);
  };

  const handleSearchClick = async (term: string) => {
    setSearchQuery(term);
    
    // Save to persistent storage first
    await saveRecentSearch({ query: term, timestamp: new Date().toISOString() });
    const updatedSearches = await loadRecentSearches();
    const searchTerms = updatedSearches.map((item: any) => item.query || item).slice(0, 5);
    setRecentSearches(searchTerms);
    
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
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            {recentSearches.length > 0 && (
              <TouchableOpacity
                onPress={handleClearRecentSearches}
                style={styles.clearButton}
              >
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>
          {recentSearches.length > 0 ? (
            recentSearches.map((term) => (
              <TouchableOpacity
                key={term}
                style={styles.recentItem}
                onPress={() => handleSearchClick(term)}
              >
                <Text style={styles.recentText}>{term}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyRecentText}>
              No recent searches. Start searching to see your history here.
            </Text>
          )}
        </View>

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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 8,
  },
  clearButtonText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
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
  emptyRecentText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 16,
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