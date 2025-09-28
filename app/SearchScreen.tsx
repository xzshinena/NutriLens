/**
 * Search screen for finding products
 */
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import EmptyState from '../src/components/EmptyState';
import SearchBar from '../src/components/SearchBar';
import VerdictBadge from '../src/components/VerdictBadge';
import { useSettings } from '../src/context/SettingsContext';
import { useProducts } from '../src/hooks/useProducts';
import { colors } from '../src/lib/colors';
import { typography } from '../src/lib/typography';
import { analyzeProduct } from '../src/lib/verdict';
import { Product } from '../src/types';

const SearchScreen: React.FC = () => {
  const navigation = useNavigation();
  const { settings } = useSettings();
  const { searchQuery, setSearchQuery, filteredProducts } = useProducts();

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

  const handleProductPress = (product: Product) => {
    (navigation as any).navigate('Home', { product });
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

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search for food products..."
        onClear={handleClearSearch}
      />

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
          filteredProducts.map((item) => {
            const verdict = analyzeProduct(item, settings);
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.productItem}
                onPress={() => handleProductPress(item)}
                activeOpacity={0.7}
              >
                <View style={styles.productImageContainer}>
                  <Image
                    source={{
                      uri:
                        'https://via.placeholder.com/60x60/36C090/FFFFFF?text=Food',
                    }}
                    style={styles.productImage}
                    defaultSource={{
                      uri:
                        'https://via.placeholder.com/60x60/F7F7FA/718096?text=No+Image',
                    }}
                  />
                </View>

                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.productBrand} numberOfLines={1}>
                    {item.brand}
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
  scrollContainer: {
    paddingHorizontal: 20,
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