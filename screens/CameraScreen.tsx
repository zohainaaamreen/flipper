import { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Alert, ActivityIndicator, Image,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { saveToHistory } from '../utils/history';
import { analyzePhotos } from '../utils/analyze';

const BEIGE = '#F5F0E8';
const BLACK = '#1A1A1A';
const MUTED = '#9C8F7E';

const STEPS = [
  { label: 'Brand Tag', hint: 'Point at the brand or care label inside the garment' },
  { label: 'Composition', hint: 'Find the fabric content label (e.g. 100% Cotton)' },
  { label: 'Full Item', hint: 'Step back and show the entire garment' },
];

type CapturedPhoto = { uri: string; base64: string };

type Phase = 'idle' | 'camera' | 'preview' | 'analyzing';

export default function CameraScreen() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [step, setStep] = useState(0);
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const navigation = useNavigation();

  const startScan = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Camera access needed', 'Please allow camera access in Settings.');
        return;
      }
    }
    setPhotos([]);
    setStep(0);
    setPhase('camera');
  };

  const handleCapture = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.35, base64: true });
      if (!photo?.base64 || !photo?.uri) throw new Error('Capture failed');
      setPhotos((prev) => [...prev, { uri: photo.uri, base64: photo.base64! }]);
      setPhase('preview');
    } catch {
      Alert.alert('Error', 'Could not capture photo. Try again.');
    }
  };

  const handleRetake = () => {
    setPhotos((prev) => prev.slice(0, -1));
    setPhase('camera');
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
      setPhase('camera');
    } else {
      runAnalysis();
    }
  };

  const runAnalysis = async () => {
    setPhase('analyzing');
    try {
      const result = await analyzePhotos([
        { base64: photos[0].base64, description: 'Image 1: Brand/care tag' },
        { base64: photos[1].base64, description: 'Image 2: Fabric composition label' },
        { base64: photos[2].base64, description: 'Image 3: Full item style shot' },
      ]);

      await saveToHistory({
        brand: result.brand,
        item: result.item,
        recommendation: result.recommendation,
        confidence: result.confidence,
        suggestedPrice: result.suggestedPrice,
        reasoning: result.reasoning,
        platformPrices: result.platformPrices,
        material: result.material,
        condition: result.condition,
        styleCore: result.styleCore,
        labelPhotoUri: photos[0].uri,
        compositionPhotoUri: photos[1].uri,
        stylePhotoUri: photos[2].uri,
        photoUri: photos[2].uri,
      });

      navigation.navigate('Results' as never);
    } catch (e: any) {
      Alert.alert('Analysis failed', e?.message ?? 'Something went wrong. Try again.');
      setPhase('idle');
      setPhotos([]);
      setStep(0);
    }
  };

  if (phase === 'analyzing') {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={BLACK} style={{ marginBottom: 20 }} />
        <Text style={styles.analyzingText}>Analyzing your item...</Text>
        <Text style={styles.analyzingSub}>Claude is reviewing all 3 photos</Text>
      </View>
    );
  }

  if (phase === 'preview') {
    const current = photos[photos.length - 1];
    const isLast = step === STEPS.length - 1;
    return (
      <View style={styles.previewContainer}>
        <Image source={{ uri: current.uri }} style={styles.previewImage} resizeMode="cover" />
        <View style={styles.previewOverlay}>
          <View style={styles.stepIndicator}>
            {STEPS.map((_, i) => (
              <View key={i} style={[styles.stepDot, i <= step && styles.stepDotActive]} />
            ))}
          </View>
          <Text style={styles.previewLabel}>{STEPS[step].label}</Text>
          <View style={styles.previewButtons}>
            <TouchableOpacity style={styles.retakeButton} onPress={handleRetake}>
              <Text style={styles.retakeText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextText}>{isLast ? 'Analyze' : 'Next Photo'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  if (phase === 'camera') {
    return (
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} facing="back" ref={cameraRef}>
          <View style={styles.overlay}>
            <View style={styles.stepIndicator}>
              {STEPS.map((_, i) => (
                <View key={i} style={[styles.stepDot, i <= step && styles.stepDotActive]} />
              ))}
            </View>
            <Text style={styles.stepLabel}>{step + 1} of {STEPS.length} — {STEPS[step].label}</Text>
            <View style={styles.scanFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
            <Text style={styles.scanHint}>{STEPS[step].hint}</Text>
            <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
              <Text style={styles.captureText}>Capture</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => { setPhase('idle'); setPhotos([]); setStep(0); }}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <View style={styles.centered}>
      <Text style={styles.logo}>FLIPPER</Text>
      <Text style={styles.tagline}>your thrift-flipping tool</Text>

      <View style={styles.stepPreview}>
        {STEPS.map((s, i) => (
          <View key={i} style={styles.stepRow}>
            <View style={styles.stepNumber}><Text style={styles.stepNumberText}>{i + 1}</Text></View>
            <View>
              <Text style={styles.stepName}>{s.label}</Text>
              <Text style={styles.stepDesc}>{s.hint}</Text>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={startScan}>
        <Text style={styles.buttonText}>Start Scan</Text>
      </TouchableOpacity>
    </View>
  );
}

const CORNER = 28;
const BORDER = 3;

const styles = StyleSheet.create({
  centered: {
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
    marginBottom: 48,
  },
  stepPreview: {
    width: '100%',
    gap: 16,
    marginBottom: 48,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: BLACK,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  stepNumberText: { color: BEIGE, fontSize: 13, fontWeight: '900' },
  stepName: { fontSize: 14, fontWeight: '700', color: BLACK, marginBottom: 2 },
  stepDesc: { fontSize: 12, color: MUTED, lineHeight: 16 },
  button: {
    backgroundColor: BLACK,
    paddingVertical: 18,
    paddingHorizontal: 64,
    borderRadius: 4,
  },
  buttonText: { color: BEIGE, fontSize: 16, fontWeight: '700', letterSpacing: 3 },
  analyzingText: {
    fontSize: 20,
    fontWeight: '900',
    color: BLACK,
    letterSpacing: 3,
    marginBottom: 8,
  },
  analyzingSub: { fontSize: 13, color: BLACK, opacity: 0.4, letterSpacing: 1 },
  cameraContainer: { flex: 1 },
  camera: { flex: 1 },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  stepIndicator: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  stepDotActive: { backgroundColor: '#fff' },
  stepLabel: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 28,
    opacity: 0.9,
  },
  scanFrame: {
    width: 240,
    height: 240,
    marginBottom: 20,
  },
  corner: {
    position: 'absolute',
    width: CORNER,
    height: CORNER,
    borderColor: '#fff',
  },
  topLeft: { top: 0, left: 0, borderTopWidth: BORDER, borderLeftWidth: BORDER },
  topRight: { top: 0, right: 0, borderTopWidth: BORDER, borderRightWidth: BORDER },
  bottomLeft: { bottom: 0, left: 0, borderBottomWidth: BORDER, borderLeftWidth: BORDER },
  bottomRight: { bottom: 0, right: 0, borderBottomWidth: BORDER, borderRightWidth: BORDER },
  scanHint: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.7,
    letterSpacing: 1,
    marginBottom: 32,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  captureButton: {
    backgroundColor: '#fff',
    paddingVertical: 18,
    paddingHorizontal: 64,
    borderRadius: 4,
    marginBottom: 16,
  },
  captureText: { color: BLACK, fontSize: 16, fontWeight: '700', letterSpacing: 3 },
  cancelButton: { paddingVertical: 10 },
  cancelText: { color: '#fff', fontSize: 14, opacity: 0.7, letterSpacing: 1 },
  previewContainer: { flex: 1, backgroundColor: BLACK },
  previewImage: { flex: 1 },
  previewOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  previewLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 20,
  },
  previewButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  retakeButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#fff',
    alignItems: 'center',
  },
  retakeText: { color: '#fff', fontSize: 14, fontWeight: '700', letterSpacing: 2 },
  nextButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 4,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  nextText: { color: BLACK, fontSize: 14, fontWeight: '900', letterSpacing: 2 },
});
