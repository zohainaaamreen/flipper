import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { loadHistory, clearHistory, ScanRecord } from '../utils/history';

const BG = '#FFFFFF';
const CARD = '#F5F5F5';
const ACCENT = '#600000';
const TEXT = '#000000';
const MUTED = '#6B6B6B';
const BORDER = '#E8E8E8';
const GREEN = '#2D6A4F';

const SANS = 'Poppins_400Regular';
const SANS_SEMI = 'Poppins_600SemiBold';
const SANS_BOLD = 'Poppins_700Bold';
const SERIF = 'CormorantGaramond_700Bold';

export default function HistoryScreen() {
  const navigation = useNavigation();
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
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Results' as never, { scanId: item.id } as never)}>
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
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
        <Text style={styles.clearText}>Clear History</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  list: { padding: 20, gap: 12 },
  empty: { flex: 1, backgroundColor: BG, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontFamily: SERIF, fontSize: 24, color: TEXT, letterSpacing: 3, marginBottom: 8 },
  emptySub: { fontFamily: SANS, fontSize: 13, color: MUTED, letterSpacing: 1 },
  card: { backgroundColor: CARD, borderRadius: 6, overflow: 'hidden' },
  cardInner: { flexDirection: 'row' },
  thumbnail: { width: 90, height: 90 },
  cardContent: { flex: 1, padding: 12 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  brand: { fontFamily: SANS_BOLD, fontSize: 17, color: TEXT, letterSpacing: 1 },
  badge: { paddingVertical: 3, paddingHorizontal: 10, borderRadius: 3 },
  badgeText: { fontFamily: SANS_SEMI, color: '#fff', fontSize: 11, letterSpacing: 2 },
  item: { fontFamily: SANS, fontSize: 13, color: MUTED, marginBottom: 12 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between' },
  meta: { fontFamily: SANS, fontSize: 11, color: MUTED, letterSpacing: 0.5 },
  clearButton: { margin: 20, padding: 14, borderWidth: 1, borderColor: ACCENT, borderRadius: 4, alignItems: 'center' },
  clearText: { fontFamily: SANS_SEMI, color: ACCENT, fontSize: 13, letterSpacing: 2 },
});
