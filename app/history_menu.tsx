/**
 * History screen showing previously scanned products
 */
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import GlobalHeader from '../components/GlobalHeader';
import { colors } from '../lib/colors';
import { typography } from '../lib/typography';

const HistoryScreen: React.FC = () => {
  const router = useRouter();
  
  // Hardcoded history data following the UI design
  const [history] = useState([
    {
      id: '1',
      name: 'Natural Spring Water',
      brand: 'Real Canadian',
      compatibility: 'Compatible',
      tag: 'Vegan',
      scannedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: '2',
      name: 'Natural Spring Water',
      brand: 'Real Canadian',
      compatibility: 'Compatible',
      tag: 'Vegetarian',
      scannedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    },
    {
      id: '3',
      name: 'Natural Spring Water',
      brand: 'Real Canadian',
      compatibility: 'Compatible',
      tag: 'Vegetarian',
      scannedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    },
    {
      id: '4',
      name: 'Natural Spring Water',
      brand: 'Real Canadian',
      compatibility: 'Compatible',
      tag: 'Low Sodium',
      scannedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      id: '5',
      name: 'Fruit Snacks',
      brand: 'Welch\'s',
      compatibility: 'Compatible',
      tag: 'Low Sodium',
      scannedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    {
      id: '6',
      name: 'Greek Yogurt',
      brand: 'Chobani',
      compatibility: 'Compatible',
      tag: 'Vegetarian',
      scannedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
    {
      id: '7',
      name: 'Almond Butter',
      brand: 'Nutty Goodness',
      compatibility: 'Compatible',
      tag: 'Vegan',
      scannedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    },
    {
      id: '8',
      name: 'Instant Ramen',
      brand: 'Maruchan',
      compatibility: 'Caution',
      tag: 'High Sodium',
      scannedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    },
  ]);

  const handleItemPress = (item: any) => {
    // Navigate to product detail screen
    router.push('/product-detail');
  };


  const renderHistoryItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.historyItem}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.itemContent}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.itemBrand}>
            {item.brand}
          </Text>
          <Text style={[
            styles.compatibilityStatus,
            { color: item.compatibility === 'Compatible' ? colors.accentBlue : colors.warnYellow }
          ]}>
            {item.compatibility}
          </Text>
        </View>
        
        <View style={styles.itemRight}>
          <Text style={styles.dietaryTag}>
            {item.tag}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <GlobalHeader showBackButton={true} title="History" />
      <FlatList
        data={history}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutralBG,
    paddingTop: 15,
  },
  listContainer: {
    flexGrow: 1,
    padding: 20,
  },
  historyItem: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: 4,
  },
  itemBrand: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  compatibilityStatus: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  itemRight: {
    alignItems: 'flex-end',
  },
  dietaryTag: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
  },
});

export default HistoryScreen;