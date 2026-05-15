import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const BEIGE = '#F5F0E8';
const BLACK = '#1A1A1A';
const GREEN = '#2D6A4F';
const MUTED = '#9C8F7E';

const PLACEHOLDER = {
  brand: 'Ralph Lauren',
  item: 'Polo Shirt — Navy, Size M',
  confidence: 87,
  recommendation: 'BUY' as 'BUY' | 'PASS',
  soldComps: [
    { price: '$34.00', date: 'May 12' },
    { price: '$28.50', date: 'May 9' },
    { price: '$41.00', date: 'May 3' },
    { price: '$31.00', date: 'Apr 28' },
  ],
  suggestedPrice: '$32–38',
};

export default function ResultsScreen() {
  const navigation = useNavigation();
  const data = PLACEHOLDER;
  const isBuy = data.recommendation === 'BUY';

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.brand}>{data.brand}</Text>
      <Text style={styles.item}>{data.item}</Text>

      <View style={[styles.badge, { backgroundColor: isBuy ? GREEN : '#C0392B' }]}>
        <Text style={styles.badgeText}>{data.recommendation}</Text>
      </View>

      <View style={styles.confidenceRow}>
        <Text style={styles.confidenceLabel}>Confidence</Text>
        <Text style={styles.confidenceValue}>{data.confidence}%</Text>
      </View>

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>eBay Sold Comps</Text>
      {data.soldComps.map((comp, i) => (
        <View key={i} style={styles.compRow}>
          <Text style={styles.compDate}>{comp.date}</Text>
          <Text style={styles.compPrice}>{comp.price}</Text>
        </View>
      ))}

      <View style={styles.divider} />

      <View style={styles.suggestedRow}>
        <Text style={styles.suggestedLabel}>Suggested Listing Price</Text>
        <Text style={styles.suggestedValue}>{data.suggestedPrice}</Text>
      </View>

      <Text style={styles.disclaimer}>
        Placeholder data — AI analysis coming soon
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Camera' as never)}
      >
        <Text style={styles.buttonText}>Scan Again</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: BEIGE },
  container: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  brand: {
    fontSize: 32,
    fontWeight: '900',
    color: BLACK,
    letterSpacing: 4,
    marginBottom: 6,
    textAlign: 'center',
  },
  item: {
    fontSize: 13,
    color: MUTED,
    letterSpacing: 1,
    marginBottom: 28,
    textAlign: 'center',
  },
  badge: {
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 4,
    marginBottom: 24,
  },
  badgeText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 6,
  },
  confidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 28,
  },
  confidenceLabel: {
    fontSize: 13,
    color: MUTED,
    letterSpacing: 1,
  },
  confidenceValue: {
    fontSize: 22,
    fontWeight: '900',
    color: BLACK,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#E0D9CE',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 11,
    color: MUTED,
    letterSpacing: 2,
    marginBottom: 16,
    alignSelf: 'flex-start',
    textTransform: 'uppercase',
  },
  compRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0D9CE',
  },
  compDate: { fontSize: 13, color: MUTED },
  compPrice: { fontSize: 15, fontWeight: '700', color: BLACK },
  suggestedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginBottom: 32,
  },
  suggestedLabel: { fontSize: 13, color: MUTED, letterSpacing: 1 },
  suggestedValue: { fontSize: 22, fontWeight: '900', color: BLACK },
  disclaimer: {
    fontSize: 11,
    color: MUTED,
    opacity: 0.6,
    marginBottom: 32,
    letterSpacing: 0.5,
  },
  button: {
    backgroundColor: BLACK,
    paddingVertical: 18,
    paddingHorizontal: 64,
    borderRadius: 4,
  },
  buttonText: {
    color: BEIGE,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 3,
  },
});
