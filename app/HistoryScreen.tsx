/**
 * History screen showing previously scanned products
 */
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  ScrollView
} from 'react-native';
import EmptyState from '../src/components/EmptyState';
import VerdictBadge from '../src/components/VerdictBadge';
import { colors } from '../src/lib/colors';
import { typography } from '../src/lib/typography';
import axios from 'axios';

const HistoryScreen: React.FC = () => {
  const navigation = useNavigation();
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);


  // Fetch last 15 products from backend
  const fetchHistory = async () => {
    try {
      const response = await axios.get(`https://nasopalatine-unreminiscently-jenna.ngrok-free.dev/history`);
      console.log('History data:', response.data);
      return response.data.slice(-15).reverse();
    } catch (error) {
      console.error('Failed to fetch history:', error);
      return [];
    }
  };

  useEffect(() => {
    const loadHistoryData = async () => {
      try {
        const historyData = await fetchHistory();
        setHistory(historyData);
      } catch (error) {
        console.warn('Failed to load history:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadHistoryData();
  }, []);

  const handleItemPress = (item: any) => {
    setSelectedProduct(item);
    setModalVisible(true);
  };


  const renderHistoryItem = ({ item, index }: { item: any; index: number }) => {
    const verdict = item.is_compatible === true ? 'A' : item.is_compatible === false ? 'D' : 'A';

    return (
      <TouchableOpacity
        style={styles.historyBox}
        onPress={() => handleItemPress(item)}
        activeOpacity={0.7}
      >
        <Text style={styles.productName} numberOfLines={1}>
          {item.product_name || 'Unnamed Product'}
        </Text>
        <Text style={styles.productBrand} numberOfLines={1}>
          {item.product_brand || 'Unknown Brand'}
        </Text>

        {item.warnings > 0 && (
          <View style={styles.warningBadge}>
            <Text style={styles.warningBadgeText}>
              {item.warnings} warning{item.warnings > 1 ? 's' : ''}
            </Text>
          </View>
        )}

        <View style={styles.infoRow}>
          <Text style={styles.compatibilityText}>
            {item.is_compatible ? 'Compatible' : 'Not Compatible'}
          </Text>
          <Text style={styles.dietNameText}>
            {item.diet_name || 'No Diet Info'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <EmptyState
      title="No History Yet"
      message="Scan some products to see them here!"
      mood="happy"
    />
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Loading your history...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Modal
  visible={modalVisible}
  animationType="slide"
  transparent={true}
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalBackground}>
    <View style={styles.modalContent}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        
        <View style={styles.modalSection}>
          <Text style={styles.modalTitle}>{selectedProduct?.product_name || 'Unnamed Product'}</Text>
        </View>

        <View style={styles.modalSection}>
          <Text style={styles.modalBrand}>{selectedProduct?.product_brand || 'Unknown Brand'}</Text>
        </View>

        <View style={styles.modalSection}>
          <Text style={styles.modalLabel}>Diet</Text>
          <Text style={styles.modalDetail}>{selectedProduct?.diet_name || 'No Diet Info'}</Text>
        </View>

        <View style={styles.modalSection}>
          <Text style={styles.modalLabel}>Compatibility</Text>
          <Text style={styles.modalDetail}>
            {selectedProduct?.is_compatible ? 'Compatible' : 'Not Compatible'}
          </Text>
        </View>

        <View style={styles.modalSection}>
          <Text style={styles.modalLabel}>Warnings</Text>
          <Text style={styles.modalDetail}>{selectedProduct?.warnings || 0}</Text>
        </View>

        <View style={styles.modalSection}>
          <Text style={styles.modalLabel}>Ingredients</Text>
          <Text style={styles.modalDetail}>{selectedProduct?.product_ingredients || 'No info'}</Text>
        </View>

        <View style={styles.modalSection}>
          <Text style={styles.modalLabel}>Source</Text>
          <Text style={styles.modalDetail}>{selectedProduct?.product_source || 'Unknown'}</Text>
        </View>

      </ScrollView>

      <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>


      <FlatList
        data={history}
        renderItem={renderHistoryItem}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA', // softer background
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  loadingText: {
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
  },

  historyBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 13,
    color: '#6B6B70',
    marginBottom: 10,
  },
  warningBadge: {
    backgroundColor: '#FFEDED',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  warningBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D32F2F',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  compatibilityText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C7ED6',
  },
  dietNameText: {
    fontSize: 12,
    color: '#6B6B70',
  },
  deleteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
  },

  // ---- Modal ----
  modalBackground: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.4)',
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 10,
},
modalContent: {
  width: '95%',
  maxHeight: '85%',
  backgroundColor: '#fff',
  borderRadius: 20,
  padding: 20,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 5 },
  shadowOpacity: 0.15,
  shadowRadius: 10,
  elevation: 8,
},
modalSection: {
  backgroundColor: '#F5F6FA',
  padding: 12,
  borderRadius: 12,
  marginBottom: 12,
},
modalTitle: {
  fontSize: 20,
  fontWeight: '800',
  color: '#1C1C1E',
  textAlign: 'center',
},
modalBrand: {
  fontSize: 16,
  fontWeight: '600',
  color: '#6B6B70',
  textAlign: 'center',
},
modalLabel: {
  fontSize: 13,
  fontWeight: '700',
  color: '#1C7ED6',
  marginBottom: 4,
},
modalDetail: {
  fontSize: 14,
  color: '#333333',
  lineHeight: 20,
  textAlign: 'justify',
},
closeButton: {
  marginTop: 10,
  backgroundColor: '#1C7ED6',
  paddingVertical: 12,
  borderRadius: 12,
  alignItems: 'center',
},
closeButtonText: {
  color: '#FFFFFF',
  fontWeight: '700',
  fontSize: 16,
},

});



export default HistoryScreen;
