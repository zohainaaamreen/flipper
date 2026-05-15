import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { loadHistory, clearHistory, ScanRecord } from '../utils/history';

const BEIGE = '#F5F0E8';
const BLACK = '#1A1A1A';
const GREEN = '#2D6A4F';
const MUTED = '#9C8F7E';

export default function HistoryScreen() {
  const [scans, setScans] = useState<ScanRecord[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadHistory().then(setScans);
    }, [])
  );

  const handleClear = async () => {
    await clearHistory();
    setScans([]);
  };

  if (scans.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>No scans yet</Text>
        <Text style={styles.emptySub}>Your past scans will appear here</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={scans}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardInner}>
              {item.photoUri && (
                <Image source={{ uri: item.photoUri }} style={styles.thumbnail} />
              )}
              <View style={styles.cardContent}>
                <View style={styles.cardTop}>
                  <Text style={styles.brand}>{item.brand}</Text>
                  <View style={[styles.badge, { backgroundColor: item.recommendation === 'BUY' ? GREEN : '#C0392B' }]}>
                    <Text style={styles.badgeText}>{item.recommendation}</Text>
                  </View>
                </View>
                <Text style={styles.item}>{item.item}</Text>
                <View style={styles.cardBottom}>
                  <Text style={styles.meta}>{item.date}</Text>
                  <Text style={styles.meta}>{item.confidence}% · {item.suggestedPrice}</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      />
      <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
        <Text style={styles.clearText}>Clear History</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BEIGE },
  list: { padding: 20, gap: 12 },
  empty: {
    flex: 1,
    backgroundColor: BEIGE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: { fontSize: 22, fontWeight: '900', color: BLACK, letterSpacing: 3, marginBottom: 8 },
  emptySub: { fontSize: 13, color: MUTED, letterSpacing: 1 },
  card: {
    backgroundColor: '#EDE8DF',
    borderRadius: 6,
    overflow: 'hidden',
  },
  cardInner: {
    flexDirection: 'row',
  },
  thumbnail: {
    width: 90,
    height: 90,
  },
  cardContent: {
    flex: 1,
    padding: 12,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  brand: { fontSize: 17, fontWeight: '900', color: BLACK, letterSpacing: 2 },
  badge: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 3,
  },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '700', letterSpacing: 2 },
  item: { fontSize: 13, color: MUTED, marginBottom: 12 },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  meta: { fontSize: 11, color: MUTED, letterSpacing: 0.5 },
  clearButton: {
    margin: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: BLACK,
    borderRadius: 4,
    alignItems: 'center',
  },
  clearText: { color: BLACK, fontSize: 13, letterSpacing: 2, fontWeight: '600' },
});
