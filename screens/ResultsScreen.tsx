import { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, ActivityIndicator, Image,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { loadHistory, ScanRecord, PlatformPrices } from '../utils/history';

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

const PLATFORMS: { key: keyof PlatformPrices; label: string }[] = [
  { key: 'eBay', label: 'eBay' },
  { key: 'Poshmark', label: 'Poshmark' },
  { key: 'Depop', label: 'Depop' },
  { key: 'Mercari', label: 'Mercari' },
];

export default function ResultsScreen() {
  const navigation = useNavigation();
  const route = useRoute() as any;
  const [data, setData] = useState<ScanRecord | null>(null);

  useFocusEffect(
    useCallback(() => {
      const scanId = route.params?.scanId;
      loadHistory().then((h) => {
        if (h.length === 0) return;
        const match = scanId ? h.find((s) => s.id === scanId) : null;
        setData(match ?? h[0]);
      });
    }, [route.params?.scanId])
  );

  if (!data) {
    return (
      <View style={styles.empty}>
        <ActivityIndicator color={ACCENT} />
        <Text style={styles.emptySub}>No scan results yet</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Camera' as never)}>
          <Text style={styles.buttonText}>Scan Something</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isBuy = data.recommendation === 'BUY';
  const photos = [
    { uri: data.labelPhotoUri, label: 'Tag' },
    { uri: data.compositionPhotoUri, label: 'Composition' },
    { uri: data.stylePhotoUri || data.photoUri, label: 'Style' },
  ].filter((p) => p.uri);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>

      {photos.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoStrip} contentContainerStyle={styles.photoStripContent}>
          {photos.map(({ uri, label }) => (
            <View key={label} style={styles.photoThumb}>
              <Image source={{ uri }} style={styles.thumbImage} resizeMode="cover" />
              <Text style={styles.thumbLabel}>{label}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      <View style={styles.header}>
        <Text style={styles.brand}>{data.brand}</Text>
        <Text style={styles.item}>{data.item}</Text>
        <View style={[styles.badge, { backgroundColor: isBuy ? GREEN : '#C0392B' }]}>
          <Text style={styles.badgeText}>{data.recommendation}</Text>
        </View>
        <View style={styles.confidenceRow}>
          <Text style={styles.confidenceLabel}>Confidence</Text>
          <Text style={styles.confidenceValue}>{data.confidence}%</Text>
        </View>
      </View>

      {data.reasoning && (
        <View style={styles.infoBox}>
          <Text style={styles.infoBoxLabel}>Why</Text>
          <Text style={styles.infoBoxText}>{data.reasoning}</Text>
        </View>
      )}

      <View style={styles.divider} />

      {(data.material || data.condition || data.styleCore) && (
        <>
          <View style={styles.detailsGrid}>
            {data.material && (
              <View style={styles.detailCard}>
                <Text style={styles.detailLabel}>Material</Text>
                <Text style={styles.detailValue}>{data.material}</Text>
              </View>
            )}
            {data.condition && (
              <View style={styles.detailCard}>
                <Text style={styles.detailLabel}>Condition</Text>
                <Text style={styles.detailValue}>{data.condition}</Text>
              </View>
            )}
            {data.styleCore && (
              <View style={[styles.detailCard, styles.detailCardFull]}>
                <Text style={styles.detailLabel}>Style Core</Text>
                <Text style={styles.detailValue}>{data.styleCore}</Text>
              </View>
            )}
          </View>
          <View style={styles.divider} />
        </>
      )}

      {data.platformPrices && (
        <>
          <Text style={styles.sectionTitle}>Price by Platform</Text>
          <View style={styles.platformTable}>
            {PLATFORMS.map(({ key, label }) => (
              <View key={key} style={styles.platformRow}>
                <Text style={styles.platformName}>{label}</Text>
                <Text style={styles.platformPrice}>{data.platformPrices![key]}</Text>
              </View>
            ))}
          </View>
          <View style={styles.divider} />
        </>
      )}

      <View style={styles.suggestedRow}>
        <Text style={styles.suggestedLabel}>Best Listing Price</Text>
        <Text style={styles.suggestedValue}>{data.suggestedPrice}</Text>
      </View>

      <Text style={styles.scannedOn}>Scanned {data.date}</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Camera' as never)}>
        <Text style={styles.buttonText}>Scan Again</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: BG },
  container: { alignItems: 'center', paddingBottom: 48 },
  empty: { flex: 1, backgroundColor: BG, alignItems: 'center', justifyContent: 'center', gap: 16, paddingHorizontal: 32 },
  emptySub: { fontFamily: SANS, fontSize: 13, color: MUTED, letterSpacing: 1 },
  photoStrip: { width: '100%', backgroundColor: TEXT },
  photoStripContent: { padding: 12, gap: 10 },
  photoThumb: { alignItems: 'center' },
  thumbImage: { width: 110, height: 130, borderRadius: 4 },
  thumbLabel: { fontFamily: SANS, color: '#fff', fontSize: 10, letterSpacing: 1, marginTop: 6, opacity: 0.7, textTransform: 'uppercase' },
  header: { alignItems: 'center', paddingHorizontal: 32, paddingTop: 28, paddingBottom: 4, width: '100%' },
  brand: { fontFamily: SERIF, fontSize: 34, color: TEXT, letterSpacing: 3, marginBottom: 6, textAlign: 'center' },
  item: { fontFamily: SANS, fontSize: 13, color: MUTED, letterSpacing: 1, marginBottom: 24, textAlign: 'center' },
  badge: { paddingVertical: 10, paddingHorizontal: 40, borderRadius: 4, marginBottom: 20 },
  badgeText: { fontFamily: SANS_BOLD, color: '#fff', fontSize: 20, letterSpacing: 6 },
  confidenceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  confidenceLabel: { fontFamily: SANS, fontSize: 13, color: MUTED, letterSpacing: 1 },
  confidenceValue: { fontFamily: SANS_BOLD, fontSize: 22, color: TEXT },
  infoBox: { width: '100%', backgroundColor: CARD, padding: 16, marginBottom: 4 },
  infoBoxLabel: { fontFamily: SANS_SEMI, fontSize: 10, color: MUTED, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 },
  infoBoxText: { fontFamily: SANS, fontSize: 14, color: TEXT, lineHeight: 20 },
  divider: { width: '100%', height: 1, backgroundColor: BORDER, marginVertical: 20 },
  detailsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 32, gap: 10, width: '100%' },
  detailCard: { flex: 1, minWidth: '45%', backgroundColor: CARD, borderRadius: 6, padding: 14 },
  detailCardFull: { minWidth: '100%' },
  detailLabel: { fontFamily: SANS_SEMI, fontSize: 10, color: MUTED, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 },
  detailValue: { fontFamily: SANS_SEMI, fontSize: 14, color: TEXT, lineHeight: 18 },
  sectionTitle: { fontFamily: SANS_SEMI, fontSize: 11, color: MUTED, letterSpacing: 2, textTransform: 'uppercase', alignSelf: 'flex-start', paddingHorizontal: 32, marginBottom: 10 },
  platformTable: { width: '100%', paddingHorizontal: 32 },
  platformRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: BORDER },
  platformName: { fontFamily: SANS_SEMI, fontSize: 15, color: TEXT },
  platformPrice: { fontFamily: SANS_BOLD, fontSize: 16, color: TEXT },
  suggestedRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center', paddingHorizontal: 32, marginBottom: 8 },
  suggestedLabel: { fontFamily: SANS, fontSize: 13, color: MUTED, letterSpacing: 1 },
  suggestedValue: { fontFamily: SANS_BOLD, fontSize: 22, color: ACCENT },
  scannedOn: { fontFamily: SANS, fontSize: 11, color: MUTED, opacity: 0.6, marginBottom: 32, marginTop: 4, letterSpacing: 0.5 },
  button: { backgroundColor: ACCENT, paddingVertical: 18, paddingHorizontal: 64, borderRadius: 4 },
  buttonText: { fontFamily: SANS_SEMI, color: '#fff', fontSize: 16, letterSpacing: 3 },
});
