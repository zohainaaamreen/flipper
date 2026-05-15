import { View, Text, StyleSheet } from 'react-native';

export default function TrendsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Trends</Text>
      <Text style={styles.sub}>Resale market trends will show here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  text: { fontSize: 28, fontWeight: 'bold' },
  sub: { fontSize: 14, color: '#888', marginTop: 8 },
});
