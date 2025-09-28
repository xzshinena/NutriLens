import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import GlobalHeader from '../components/GlobalHeader';
import { colors } from '../lib/colors';


const HomeScreen: React.FC = () => {

  return (
    <View style={styles.container}>
      <GlobalHeader title="Home" />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
      <Text style={styles.headerSubtitle}>
        Scan any packaged food to get detailed nutrition info and personalized health warnings
      </Text>

      {/* Buttons Row */}
      <View style={styles.cardRow}>
        <Link href="/scanner" asChild>
          <TouchableOpacity style={styles.card}>
            <Ionicons name="camera" size={32} color={colors.accentBlue} />
            <Text style={styles.cardTitle}>Scan Food</Text>
            <Text style={styles.cardSubtitle}>Use camera</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/search" asChild>
          <TouchableOpacity style={styles.card}>
            <Ionicons name="search" size={32} color={colors.accentBlue} />
            <Text style={styles.cardTitle}>Search</Text>
            <Text style={styles.cardSubtitle}>Find products</Text>
          </TouchableOpacity>
        </Link>
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
      <Link href="/history_menu" asChild>
        <TouchableOpacity style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Scans</Text>
          <Text style={styles.sectionSubtitle}>Your latest food analysis</Text>
          
          <View style={styles.scanCard}>
            <View style={styles.scanCardContent}>
              <View style={styles.scanCardInfo}>
                <Text style={styles.scanCardTitle}>Natural Spring Water</Text>
                <Text style={styles.scanCardBrand}>Real Canadian</Text>
                <Text style={styles.scanCardCompatibility}>Compatible</Text>
              </View>
              <View style={styles.scanCardRight}>
                <Text style={styles.scanCardTag}>Vegan</Text>
              </View>
            </View>
          </View>

          <View style={styles.scanCard}>
            <View style={styles.scanCardContent}>
              <View style={styles.scanCardInfo}>
                <Text style={styles.scanCardTitle}>Fruit Snacks</Text>
                <Text style={styles.scanCardBrand}>Welch's</Text>
                <Text style={styles.scanCardCompatibility}>Compatible</Text>
              </View>
              <View style={styles.scanCardRight}>
                <Text style={styles.scanCardTag}>Low Sodium</Text>
              </View>
            </View>
          </View>

          <View style={styles.scanCard}>
            <View style={styles.scanCardContent}>
              <View style={styles.scanCardInfo}>
                <Text style={styles.scanCardTitle}>Instant Ramen</Text>
                <Text style={styles.scanCardBrand}>Maruchan</Text>
                <Text style={[styles.scanCardCompatibility, { color: colors.warnYellow }]}>Caution</Text>
              </View>
              <View style={styles.scanCardRight}>
                <Text style={styles.scanCardTag}>High Sodium</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Link>
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
    padding: 20,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 20,
    marginTop: 10,
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
  scanCard: {
    backgroundColor: colors.neutralBG,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  scanCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  scanCardInfo: {
    flex: 1,
  },
  scanCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 2,
  },
  scanCardBrand: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 6,
  },
  scanCardCompatibility: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accentBlue,
  },
  scanCardRight: {
    alignItems: 'flex-end',
  },
  scanCardTag: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '600',
  },
});

export default HomeScreen;