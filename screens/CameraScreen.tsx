import { View, Text, StyleSheet } from 'react-native';

export default function CameraScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Camera</Text>
      <Text style={styles.sub}>Scan a clothing label here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  text: { fontSize: 28, fontWeight: 'bold' },
  sub: { fontSize: 14, color: '#888', marginTop: 8 },
});
