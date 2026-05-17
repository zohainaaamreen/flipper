import { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Image, Alert,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { loadHistory, clearHistory, ScanRecord } from '../utils/history';

const BEIGE = '#F5F0E8';
const BLACK = '#1A1A1A';
const GREEN = '#2D6A4F';
const MUTED = '#9C8F7E';

const TIPS = [
  'Natural fibers (wool, cotton, linen, silk) always command higher resale prices than synthetics.',
  'Patagonia and Carhartt are worth buying even if they look worn — they clean up well and sell fast.',
  'Check every pocket before buying. Previous owners leave surprises.',
  'Quiet Luxury is trending — look for Brooks Brothers, J.Crew, and Banana Republic blazers.',
  'Y2K pieces in good condition are selling fast on Depop. Target 1998–2004 labels.',
  'Vintage band tees from the 80s and 90s can fetch $50–200+ on eBay.',
  '100% cotton denim typically sells for 40% more than polyester blends.',
  'Size XL+ in desirable brands often sells faster — less competition, more buyers.',
];

function estimateValue(price: string): number {
  const nums = price.match(/\d+/g);
  if (!nums || nums.length === 0) return 0;
  return nums.map(Number).reduce((a, b) => a + b, 0) / nums.length;
}

export default function DashboardScreen() {
  const navigation = useNavigation();
  const [scans, setScans] = useState<ScanRecord[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadHistory().then(setScans);
    }, [])
  );

  const total = scans.length;
  const buys = scans.filter((s) => s.recommendation === 'BUY');
  const buyRate = total > 0 ? Math.round((buys.length / total) * 100) : 0;
  const estValue = Math.round(buys.reduce((sum, s) => sum + estimateValue(s.suggestedPrice), 0));
  const tip = TIPS[new Date().getDay() % TIPS.length];

  const handleClear = () => {
    Alert.alert('Clear All Scans', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: async () => { await clearHistory(); setScans([]); } },
    ]);
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.pageTitle}>DASHBOARD</Text>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{total}</Text>
          <Text style={styles.statLabel}>Scans</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: GREEN }]}>{buyRate}%</Text>
          <Text style={styles.statLabel}>Buy Rate</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: GREEN }]}>${estValue}</Text>
          <Text style={styles.statLabel}>Est. Value</Text>
        </View>
      </View>

      <View style={styles.tipBox}>
        <Text style={styles.tipLabel}>Tip of the Day</Text>
        <Text style={styles.tipText}>{tip}</Text>
      </View>

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>Scan History</Text>

      {scans.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No scans yet</Text>
          <TouchableOpacity
            style={styles.scanBtn}
            onPress={() => navigation.navigate('Camera' as never)}
          >
            <Text style={styles.scanBtnText}>Start Scanning</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {scans.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() => navigation.navigate('Results' as never, { scanId: item.id } as never)}
            >
              <View style={styles.cardInner}>
                {(item.stylePhotoUri || item.photoUri) && (
                  <Image
                    source={{ uri: item.stylePhotoUri || item.photoUri }}
                    style={styles.thumbnail}
                  />
                )}
                <View style={styles.cardContent}>
                  <View style={styles.cardTop}>
                    <Text style={styles.brand}>{item.brand}</Text>
                    <View style={[styles.badge, { backgroundColor: item.recommendation === 'BUY' ? GREEN : '#C0392B' }]}>
                      <Text style={styles.badgeText}>{item.recommendation}</Text>
                    </View>
                  </View>
                  <Text style={styles.itemText}>{item.item}</Text>
                  {item.styleCore && (
                    <Text style={styles.styleCore}>{item.styleCore}</Text>
                  )}
                  <View style={styles.cardBottom}>
                    <Text style={styles.meta}>{item.date}</Text>
                    <Text style={styles.meta}>{item.confidence}% · {item.suggestedPrice}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.clearText}>Clear History</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: BEIGE },
  container: { padding: 24, paddingTop: 32, paddingBottom: 48 },
  pageTitle: {
    fontSize: 28, fontWeight: '900', color: BLACK,
    letterSpacing: 8, marginBottom: 24,
  },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statCard: {
    flex: 1, backgroundColor: '#EDE8DF',
    borderRadius: 6, padding: 14, alignItems: 'center',
  },
  statValue: { fontSize: 24, fontWeight: '900', color: BLACK, letterSpacing: 1 },
  statLabel: { fontSize: 10, color: MUTED, letterSpacing: 1, marginTop: 4 },
  tipBox: {
    backgroundColor: BLACK, borderRadius: 6,
    padding: 16, marginBottom: 8,
  },
  tipLabel: {
    fontSize: 10, color: BEIGE, opacity: 0.5,
    letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8,
  },
  tipText: { fontSize: 13, color: BEIGE, lineHeight: 19, opacity: 0.9 },
  divider: { height: 1, backgroundColor: '#E0D9CE', marginVertical: 24 },
  sectionTitle: {
    fontSize: 11, color: MUTED, letterSpacing: 2,
    textTransform: 'uppercase', marginBottom: 16,
  },
  empty: { alignItems: 'center', paddingVertical: 32, gap: 16 },
  emptyText: { fontSize: 15, color: MUTED },
  scanBtn: {
    backgroundColor: BLACK, paddingVertical: 14,
    paddingHorizontal: 40, borderRadius: 4,
  },
  scanBtnText: { color: BEIGE, fontSize: 14, fontWeight: '700', letterSpacing: 2 },
  card: {
    backgroundColor: '#EDE8DF', borderRadius: 6,
    overflow: 'hidden', marginBottom: 10,
  },
  cardInner: { flexDirection: 'row' },
  thumbnail: { width: 90, height: 90 },
  cardContent: { flex: 1, padding: 12 },
  cardTop: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 4,
  },
  brand: { fontSize: 15, fontWeight: '900', color: BLACK, letterSpacing: 1 },
  badge: { paddingVertical: 3, paddingHorizontal: 8, borderRadius: 3 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  itemText: { fontSize: 12, color: MUTED, marginBottom: 4 },
  styleCore: { fontSize: 11, color: BLACK, opacity: 0.5, marginBottom: 6, fontStyle: 'italic' },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between' },
  meta: { fontSize: 10, color: MUTED },
  clearButton: {
    marginTop: 16, padding: 14,
    borderWidth: 1, borderColor: '#C0392B',
    borderRadius: 4, alignItems: 'center',
  },
  clearText: { color: '#C0392B', fontSize: 12, letterSpacing: 2, fontWeight: '600' },
});
