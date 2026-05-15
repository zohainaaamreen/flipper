import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';

const BEIGE = '#F5F0E8';
const BLACK = '#1A1A1A';

export default function CameraScreen() {
  const [scanning, setScanning] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const navigation = useNavigation();

  const handleScan = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Camera access needed', 'Please allow camera access in your iPhone settings to scan labels.');
        return;
      }
    }
    setScanning(true);
  };

  const handleCapture = async () => {
    if (!cameraRef.current) return;
    await cameraRef.current.takePictureAsync({ quality: 0.8 });
    setScanning(false);
    navigation.navigate('Results' as never);
  };

  if (scanning) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} facing="back" ref={cameraRef}>
          <View style={styles.overlay}>
            <View style={styles.scanFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
              <Text style={styles.scanHint}>point at a clothing label</Text>
            </View>
            <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
              <Text style={styles.captureText}>Capture</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setScanning(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }

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

      <TouchableOpacity style={styles.button} onPress={handleScan}>
        <Text style={styles.buttonText}>Scan Label</Text>
      </TouchableOpacity>
    </View>
  );
}

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
  topLeft: { top: 0, left: 0, borderTopWidth: BORDER, borderLeftWidth: BORDER },
  topRight: { top: 0, right: 0, borderTopWidth: BORDER, borderRightWidth: BORDER },
  bottomLeft: { bottom: 0, left: 0, borderBottomWidth: BORDER, borderLeftWidth: BORDER },
  bottomRight: { bottom: 0, right: 0, borderBottomWidth: BORDER, borderRightWidth: BORDER },
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
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanFrame: {
    width: 260,
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 48,
  },
  scanHint: {
    fontSize: 13,
    color: '#fff',
    opacity: 0.8,
    letterSpacing: 1,
  },
  captureButton: {
    backgroundColor: '#fff',
    paddingVertical: 18,
    paddingHorizontal: 64,
    borderRadius: 4,
    marginBottom: 16,
  },
  captureText: {
    color: BLACK,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 3,
  },
  cancelButton: {
    paddingVertical: 10,
  },
  cancelText: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.7,
    letterSpacing: 1,
  },
});
