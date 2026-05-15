import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function CameraScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>FLIPPER</Text>
      <Text style={styles.tagline}>your thrift-flipping tool</Text>

      <View style={styles.viewfinder}>
        <View style={[styles.corner, styles.topLeft]} />
        <View style={[styles.corner, styles.topRight]} />
        <View style={[styles.corner, styles.bottomLeft]} />
        <View style={[styles.corner, styles.bottomRight]} />
        <Text style={styles.viewfinderText}>point at a clothing label</Text>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Scan Label</Text>
      </TouchableOpacity>
    </View>
  );
}

const BEIGE = '#F5F0E8';
const BLACK = '#1A1A1A';
const CORNER = 28;
const BORDER = 3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BEIGE,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  logo: {
    fontSize: 42,
    fontWeight: '900',
    color: BLACK,
    letterSpacing: 8,
    marginBottom: 6,
  },
  tagline: {
    fontSize: 13,
    color: BLACK,
    letterSpacing: 2,
    opacity: 0.5,
    marginBottom: 52,
  },
  viewfinder: {
    width: 260,
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 52,
  },
  corner: {
    position: 'absolute',
    width: CORNER,
    height: CORNER,
    borderColor: BLACK,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: BORDER,
    borderLeftWidth: BORDER,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: BORDER,
    borderRightWidth: BORDER,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: BORDER,
    borderLeftWidth: BORDER,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: BORDER,
    borderRightWidth: BORDER,
  },
  viewfinderText: {
    fontSize: 13,
    color: BLACK,
    opacity: 0.4,
    letterSpacing: 1,
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
