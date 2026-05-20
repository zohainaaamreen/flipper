import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchStyleImage } from '../utils/pexels';

const BG = '#FFFFFF';
const CARD = '#F5F5F5';
const ACCENT = '#600000';
const TEXT = '#000000';
const MUTED = '#6B6B6B';
const BORDER = '#E8E8E8';
const GREEN = '#2D6A4F';

const SERIF = 'CormorantGaramond_700Bold';
const SANS = 'Poppins_400Regular';
const SANS_SEMI = 'Poppins_600SemiBold';
const SANS_BOLD = 'Poppins_700Bold';

const MARKET_STATS = [
  { label: 'Avg Flip Profit', value: '$28', sub: 'per item this month' },
  { label: 'Fastest Moving', value: 'Gorpcore', sub: 'avg 3 days to sell' },
  { label: 'Best Platform', value: 'eBay', sub: 'highest avg sale price' },
];

const WEEKLY_INSIGHT = {
  title: 'Natural Fibers Are Up',
  body: '100% cotton and wool pieces are selling 34% faster than blended synthetics this season. Prioritise the composition label when scanning.',
  change: '+34%',
  positive: true,
};

const HOT_BRANDS = [
  { brand: 'Patagonia', avgSale: '$58', demand: 'High', change: '+12%' },
  { brand: "Levi's", avgSale: '$34', demand: 'High', change: '+8%' },
  { brand: 'Ralph Lauren', avgSale: '$31', demand: 'Medium', change: '+3%' },
  { brand: 'Tommy Hilfiger', avgSale: '$27', demand: 'Medium', change: '-2%' },
  { brand: 'Nike', avgSale: '$44', demand: 'High', change: '+6%' },
  { brand: 'Carhartt', avgSale: '$52', demand: 'High', change: '+19%' },
  { brand: 'J.Crew', avgSale: '$22', demand: 'Medium', change: '-4%' },
  { brand: 'Banana Republic', avgSale: '$19', demand: 'Low', change: '-7%' },
];

const STYLE_CORES = [
  { name: 'Quiet Luxury', source: 'Pinterest · Google', heat: 'Trending', lookFor: 'Polo, Brooks Brothers, cashmere, neutral blazers, silk blouses', query: 'quiet luxury minimalist fashion outfit', avgResale: '$38', sellDays: '5 days', searchVol: '+42%' },
  { name: 'Gorpcore', source: 'Pinterest · Google', heat: 'Trending', lookFor: 'Patagonia fleece, North Face, technical vests, trail shoes', query: 'gorpcore outdoor hiking fashion clothing', avgResale: '$54', sellDays: '3 days', searchVol: '+61%' },
  { name: 'Y2K Revival', source: 'Pinterest', heat: 'Hot', lookFor: 'Baby tees, Von Dutch, Juicy Couture, low-rise denim, velour', query: 'y2k 2000s retro fashion outfit', avgResale: '$29', sellDays: '4 days', searchVol: '+88%' },
  { name: 'Dark Academia', source: 'Pinterest', heat: 'Steady', lookFor: 'Tweed blazers, plaid trousers, Oxford shirts, turtlenecks', query: 'dark academia fashion tweed aesthetic', avgResale: '$33', sellDays: '9 days', searchVol: '+5%' },
  { name: 'Coastal Grandmother', source: 'Google', heat: 'Steady', lookFor: 'Linen trousers, striped tops, relaxed cardigans, neutral linen', query: 'coastal grandmother style linen summer fashion', avgResale: '$26', sellDays: '8 days', searchVol: '+11%' },
  { name: 'Mob Wife', source: 'Pinterest', heat: 'Rising', lookFor: 'Faux fur coats, bold animal print, oversized silhouettes', query: 'mob wife aesthetic fur coat bold fashion', avgResale: '$44', sellDays: '6 days', searchVol: '+73%' },
  { name: 'Vintage Workwear', source: 'Google', heat: 'Hot', lookFor: 'Carhartt canvas, Dickies, chore coats, denim work jackets', query: 'vintage workwear denim jacket carhartt fashion', avgResale: '$49', sellDays: '4 days', searchVol: '+55%' },
  { name: 'Balletcore', source: 'Pinterest', heat: 'Rising', lookFor: 'Wrap cardigans, soft pastels, leg warmers, satin blouses', query: 'balletcore soft pastel fashion aesthetic', avgResale: '$22', sellDays: '7 days', searchVol: '+39%' },
];

const HEAT_COLORS: Record<string, string> = {
  Hot: '#C0392B',
  Trending: GREEN,
  Rising: '#B7860B',
  Steady: MUTED,
};

export default function TrendsScreen() {
  const [images, setImages] = useState<Record<string, string | null>>({});

  useEffect(() => {
    STYLE_CORES.forEach(async ({ name, query }) => {
      const url = await fetchStyleImage(query);
      setImages((prev) => ({ ...prev, [name]: url }));
    });
  }, []);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.pageTitle}>TRENDS</Text>

      <Text style={styles.sectionTitle}>Market Snapshot</Text>
      <View style={styles.statsRow}>
        {MARKET_STATS.map(({ label, value, sub }) => (
          <View key={label} style={styles.statCard}>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
            <Text style={styles.statSub}>{sub}</Text>
          </View>
        ))}
      </View>

      <View style={styles.insightBox}>
        <View style={styles.insightTop}>
          <Ionicons name="trending-up" size={16} color="#fff" />
          <Text style={styles.insightTitle}>{WEEKLY_INSIGHT.title}</Text>
          <Text style={[styles.insightChange, { color: WEEKLY_INSIGHT.positive ? '#a8d5b5' : '#f5a5a5' }]}>
            {WEEKLY_INSIGHT.change}
          </Text>
        </View>
        <Text style={styles.insightBody}>{WEEKLY_INSIGHT.body}</Text>
      </View>

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>Style Cores</Text>
      <Text style={styles.sectionNote}>Trending on Pinterest & Google — what to hunt for</Text>
      <View style={styles.coreGrid}>
        {STYLE_CORES.map(({ name, source, heat, lookFor, avgResale, sellDays, searchVol }) => (
          <View key={name} style={styles.coreCard}>
            <View style={styles.imageContainer}>
              {images[name] ? (
                <Image source={{ uri: images[name]! }} style={styles.coreImage} resizeMode="cover" />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <ActivityIndicator color={MUTED} />
                </View>
              )}
              <View style={[styles.heatBadgeOverlay, { backgroundColor: HEAT_COLORS[heat] }]}>
                <Text style={styles.heatText}>{heat}</Text>
              </View>
            </View>

            <View style={styles.coreCardBody}>
              <View style={styles.coreCardTop}>
                <Text style={styles.coreName}>{name}</Text>
                <Text style={styles.coreSource}>{source}</Text>
              </View>

              <View style={styles.coreStats}>
                <View style={styles.coreStat}>
                  <Text style={styles.coreStatValue}>{avgResale}</Text>
                  <Text style={styles.coreStatLabel}>Avg resale</Text>
                </View>
                <View style={styles.coreStatDivider} />
                <View style={styles.coreStat}>
                  <Text style={styles.coreStatValue}>{sellDays}</Text>
                  <Text style={styles.coreStatLabel}>Avg to sell</Text>
                </View>
                <View style={styles.coreStatDivider} />
                <View style={styles.coreStat}>
                  <Text style={[styles.coreStatValue, { color: GREEN }]}>{searchVol}</Text>
                  <Text style={styles.coreStatLabel}>Search vol.</Text>
                </View>
              </View>

              <Text style={styles.coreLookFor}>Look for: {lookFor}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>Hot Resale Brands</Text>
      <Text style={styles.sectionNote}>Based on recent eBay sold listings</Text>
      {HOT_BRANDS.map(({ brand, avgSale, demand, change }) => {
        const up = change.startsWith('+');
        return (
          <View key={brand} style={styles.row}>
            <View>
              <Text style={styles.rowBrand}>{brand}</Text>
              <Text style={styles.rowMeta}>Avg sale: {avgSale}</Text>
            </View>
            <View style={styles.rowRight}>
              <Text style={[styles.changeText, { color: up ? GREEN : '#C0392B' }]}>{change}</Text>
              <View style={[styles.demandBadge, demand === 'High' ? styles.demandHigh : demand === 'Medium' ? styles.demandMed : styles.demandLow]}>
                <Text style={styles.demandText}>{demand}</Text>
              </View>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: BG },
  container: { padding: 24, paddingTop: 32, paddingBottom: 48 },
  pageTitle: { fontFamily: SERIF, fontSize: 32, color: TEXT, letterSpacing: 6, marginBottom: 24 },
  sectionTitle: { fontFamily: SANS_SEMI, fontSize: 11, color: MUTED, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 },
  sectionNote: { fontFamily: SANS, fontSize: 11, color: MUTED, opacity: 0.7, marginBottom: 12 },

  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  statCard: { flex: 1, backgroundColor: CARD, borderRadius: 6, padding: 12, alignItems: 'center' },
  statValue: { fontFamily: SANS_BOLD, fontSize: 15, color: TEXT, textAlign: 'center', marginBottom: 2 },
  statLabel: { fontFamily: SANS_SEMI, fontSize: 9, color: MUTED, letterSpacing: 1, textTransform: 'uppercase', textAlign: 'center' },
  statSub: { fontFamily: SANS, fontSize: 9, color: MUTED, opacity: 0.6, textAlign: 'center', marginTop: 2 },

  insightBox: { backgroundColor: ACCENT, borderRadius: 6, padding: 16 },
  insightTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  insightTitle: { fontFamily: SANS_SEMI, flex: 1, fontSize: 13, color: '#fff' },
  insightChange: { fontFamily: SANS_BOLD, fontSize: 13 },
  insightBody: { fontFamily: SANS, fontSize: 12, color: '#fff', opacity: 0.85, lineHeight: 18 },

  divider: { height: 1, backgroundColor: BORDER, marginVertical: 24 },

  coreGrid: { gap: 12, marginBottom: 8 },
  coreCard: { backgroundColor: CARD, borderRadius: 8, overflow: 'hidden' },
  imageContainer: { position: 'relative' },
  coreImage: { width: '100%', height: 180 },
  imagePlaceholder: { width: '100%', height: 180, backgroundColor: BORDER, alignItems: 'center', justifyContent: 'center' },
  heatBadgeOverlay: { position: 'absolute', top: 10, right: 10, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 4 },
  heatText: { fontFamily: SANS_SEMI, color: '#fff', fontSize: 10, letterSpacing: 1 },
  coreCardBody: { padding: 14 },
  coreCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  coreName: { fontFamily: SANS_BOLD, fontSize: 16, color: TEXT, letterSpacing: 0.5 },
  coreSource: { fontFamily: SANS, fontSize: 10, color: MUTED },

  coreStats: { flexDirection: 'row', alignItems: 'center', backgroundColor: BORDER, borderRadius: 6, padding: 10, marginBottom: 12 },
  coreStat: { flex: 1, alignItems: 'center' },
  coreStatValue: { fontFamily: SANS_BOLD, fontSize: 14, color: TEXT, marginBottom: 2 },
  coreStatLabel: { fontFamily: SANS, fontSize: 9, color: MUTED, letterSpacing: 0.5, textTransform: 'uppercase' },
  coreStatDivider: { width: 1, height: 28, backgroundColor: '#D0D0D0' },

  coreLookFor: { fontFamily: SANS, fontSize: 12, color: TEXT, opacity: 0.6, lineHeight: 17 },

  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: BORDER },
  rowBrand: { fontFamily: SANS_BOLD, fontSize: 15, color: TEXT },
  rowMeta: { fontFamily: SANS, fontSize: 12, color: MUTED, marginTop: 2 },
  rowRight: { alignItems: 'flex-end', gap: 4 },
  changeText: { fontFamily: SANS_BOLD, fontSize: 13 },
  demandBadge: { paddingVertical: 3, paddingHorizontal: 8, borderRadius: 3 },
  demandHigh: { backgroundColor: GREEN },
  demandMed: { backgroundColor: '#B7860B' },
  demandLow: { backgroundColor: MUTED },
  demandText: { fontFamily: SANS_SEMI, color: '#fff', fontSize: 9, letterSpacing: 1 },
});
