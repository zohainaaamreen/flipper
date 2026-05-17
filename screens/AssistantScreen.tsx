import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BEIGE = '#F5F0E8';
const BLACK = '#1A1A1A';
const MUTED = '#9C8F7E';

const FEATURES = [
  { icon: 'pricetag-outline' as const, title: 'Listing Writer', desc: 'Generate eBay and Poshmark descriptions from your scan' },
  { icon: 'logo-instagram' as const, title: 'Caption Generator', desc: 'Instagram and TikTok captions for your thrift finds' },
  { icon: 'calculator-outline' as const, title: 'Profit Calculator', desc: 'Factor in fees, shipping, and time to see real margins' },
  { icon: 'bulb-outline' as const, title: 'Pricing Advisor', desc: 'Get a suggested price based on recent comps and demand' },
];

export default function AssistantScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>ASSISTANT</Text>
      <Text style={styles.subtitle}>Your reseller toolkit</Text>

      <View style={styles.comingSoon}>
        <Ionicons name="chatbubble-ellipses-outline" size={44} color={MUTED} style={{ marginBottom: 16 }} />
        <Text style={styles.comingSoonTitle}>Coming Soon</Text>
        <Text style={styles.comingSoonText}>
          The Assistant will be your AI-powered hub for everything reselling.
        </Text>
      </View>

      <View style={styles.featureList}>
        {FEATURES.map(({ icon, title, desc }) => (
          <View key={title} style={styles.featureRow}>
            <View style={styles.featureIcon}>
              <Ionicons name={icon} size={20} color={BLACK} />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>{title}</Text>
              <Text style={styles.featureDesc}>{desc}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: BEIGE,
    paddingHorizontal: 24, paddingTop: 32,
  },
  pageTitle: {
    fontSize: 28, fontWeight: '900', color: BLACK,
    letterSpacing: 8, marginBottom: 4,
  },
  subtitle: { fontSize: 13, color: MUTED, letterSpacing: 1, marginBottom: 28 },
  comingSoon: {
    backgroundColor: '#EDE8DF', borderRadius: 8,
    padding: 28, alignItems: 'center', marginBottom: 28,
  },
  comingSoonTitle: {
    fontSize: 16, fontWeight: '900', color: BLACK,
    letterSpacing: 2, marginBottom: 10,
  },
  comingSoonText: {
    fontSize: 13, color: MUTED, textAlign: 'center', lineHeight: 19,
  },
  featureList: { gap: 4 },
  featureRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    paddingVertical: 14, borderBottomWidth: 1,
    borderBottomColor: '#E0D9CE', gap: 14,
  },
  featureIcon: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#EDE8DF',
    alignItems: 'center', justifyContent: 'center',
  },
  featureText: { flex: 1 },
  featureTitle: { fontSize: 14, fontWeight: '700', color: BLACK, marginBottom: 2 },
  featureDesc: { fontSize: 12, color: MUTED, lineHeight: 17 },
});
