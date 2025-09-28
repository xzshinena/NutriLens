import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../src/lib/colors';
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';


const HomeScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleScanFood = () => {
    (navigation as any).navigate('scanner');
  };

  const handleSearch = () => {
    (navigation as any).navigate('SearchScreenWrapper');
  };

  const [latestScans, setLatestScans] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = async () => {
  try {
    const response = await axios.get('https://nasopalatine-unreminiscently-jenna.ngrok-free.dev/history');
    console.log('History data:', response.data);

    // sort descending by scanned_at or id
    const sorted = response.data.sort((a, b) => {
      const timeA = new Date(a.scanned_at).getTime();
      const timeB = new Date(b.scanned_at).getTime();
      return timeB - timeA; // newest first
    });

    return sorted.slice(0, 15); // last 15 newest items
  } catch (error) {
    console.error('Failed to fetch history:', error);
    return [];
  }
};


  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadHistoryData = async () => {
        try {
          const historyData = await fetchHistory();
          if (!isActive) return;

          setHistory(historyData);
          setLatestScans(historyData.slice(0, 3)); 
        } catch (error) {
          console.warn('Failed to load history:', error);
        } finally {
          setIsLoading(false);
        }
      };

      loadHistoryData();

      return () => {
        isActive = false;
      };
    }, [])
  );


  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <Text style={styles.headerTitle}>Make Healthier Food Choices</Text>
      <Text style={styles.headerSubtitle}>
        Scan any packaged food to get detailed nutrition info and personalized health warnings
      </Text>

      {/* Buttons Row */}
      <View style={styles.cardRow}>
        <TouchableOpacity style={styles.card} onPress={handleScanFood}>
          <Ionicons name="camera" size={32} color={colors.accentBlue} />
          <Text style={styles.cardTitle}>Scan Food</Text>
          <Text style={styles.cardSubtitle}>Use camera</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={handleSearch}>
          <Ionicons name="search" size={32} color={colors.accentBlue} />
          <Text style={styles.cardTitle}>Search</Text>
          <Text style={styles.cardSubtitle}>Find products</Text>
        </TouchableOpacity>
      </View>

      {/* Health Journey */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Health Journey</Text>
        <Text style={styles.sectionSubtitle}>Track your progress this month</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Ionicons name="trending-up" size={20} color={colors.accentBlue} />
            <Text style={styles.statNumber}>127</Text>
            <Text style={styles.statLabel}>Foods Scanned</Text>
          </View>
          <View style={styles.statBox}>
            <Ionicons name="shield-checkmark" size={20} color={colors.accentBlue} />
            <Text style={styles.statNumber}>23</Text>
            <Text style={styles.statLabel}>Warnings Avoided</Text>
          </View>
          <View style={styles.statBox}>
            <Ionicons name="star" size={20} color={colors.accentBlue} />
            <Text style={styles.statNumber}>89%</Text>
            <Text style={styles.statLabel}>Healthy Choices</Text>
          </View>
        </View>
      </View>

      {/* Recent Scans */}
      <View style={styles.section}>
        <TouchableOpacity
          onPress={() => {
            (navigation as any).navigate('HistoryScreen'); // replace with your target screen
          }}
        >
          <Text style={styles.sectionTitle}>Recent Scans</Text>
          <Text style={styles.sectionSubtitle}>Your latest food analysis</Text>
        </TouchableOpacity>

        {/* <-- Replace all hardcoded scan items below with this dynamic map --> */}
        {latestScans.map((item, index) => (
          <View key={index} style={styles.scanItem}>
            <View>
              <Text style={styles.scanTitle}>{item.product_name || 'Unnamed Product'}</Text>
              <Text style={styles.scanSubtitle}>
                {item.product_brand || 'Unknown Brand'} • {item.scanned_at || 'Just now'}
              </Text>
            </View>

            <View style={[styles.badge, { backgroundColor: item.is_compatible ? '#1C7ED6' : '#D32F2F' }]}>
              <Text style={styles.badgeText}>
                {item.is_compatible ? 'A' : 'D'}
              </Text>
            </View>

            {item.warnings > 0 && (
              <View style={styles.warningBadge}>
                <Text style={styles.warningBadgeText}>
                  {item.warnings} warning{item.warnings > 1 ? 's' : ''}
                </Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutralBG,
  },
  content: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 20,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 5,
    elevation: 2,
  },
  cardTitle: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  cardSubtitle: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 4,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    color: colors.text.primary,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 6,
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  scanItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  scanTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  scanSubtitle: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  badge: {
    backgroundColor: '#000',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  warningBadge: {
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
  },
  warningBadgeText: {
    color: '#E53935',
    fontSize: 12,
    fontWeight: '700',
  },
});

export default HomeScreen;