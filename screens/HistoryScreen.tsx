import { View, Text, StyleSheet } from 'react-native';

const BEIGE = '#F5F0E8';
const BLACK = '#1A1A1A';

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>History</Text>
      <Text style={styles.sub}>Your past scans will appear here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: BEIGE, paddingHorizontal: 32 },
  title: { fontSize: 28, fontWeight: '900', color: BLACK, letterSpacing: 4, marginBottom: 10 },
  sub: { fontSize: 13, color: BLACK, opacity: 0.4, letterSpacing: 1, textAlign: 'center' },
});
