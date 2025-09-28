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

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleScanFood = () => {
    (navigation as any).navigate('scanner'); // make sure your Scanner screen route is "Scan"
  };

  const handleSearch = () => {
    (navigation as any).navigate('SearchScreenWrapper'); // make sure your Search screen route is "Search"
  };

  const recentScan1 = { name: 'Organic Granola Bar', brand: 'Nature Valley', time: '2 hours ago', grade: 'A' };
  const recentScan2 = { name: 'Greek Yogurt', brand: 'Chobani', time: '1 day ago', grade: 'A+' };
  const recentScan3 = { name: 'Instant Ramen', brand: 'Maruchan', time: '2 days ago', grade: 'D', warnings: 3 };

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
        <Text style={styles.sectionTitle}>Recent Scans</Text>
        <Text style={styles.sectionSubtitle}>Your latest food analysis</Text>
        
        <View style={styles.scanItem}>
          <View>
            <Text style={styles.scanTitle}>Organic Granola Bar</Text>
            <Text style={styles.scanSubtitle}>Nature Valley • 2 hours ago</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>A</Text>
          </View>
        </View>

        <View style={styles.scanItem}>
          <View>
            <Text style={styles.scanTitle}>Greek Yogurt</Text>
            <Text style={styles.scanSubtitle}>Chobani • 1 day ago</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>A+</Text>
          </View>
        </View>

        <View style={styles.scanItem}>
          <View>
            <Text style={styles.scanTitle}>Instant Ramen</Text>
            <Text style={styles.scanSubtitle}>Maruchan • 2 days ago</Text>
          </View>
          <View style={[styles.warningBadge]}>
            <Text style={styles.warningBadgeText}>3 warnings</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: 'red' }]}>
            <Text style={styles.badgeText}>D</Text>
          </View>
        </View>
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