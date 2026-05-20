import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { loadSettings, saveSettings, AppSettings, Platform } from '../utils/settings';
import { clearHistory } from '../utils/history';

const BG = '#FFFFFF';
const CARD = '#F5F5F5';
const ACCENT = '#600000';
const TEXT = '#000000';
const MUTED = '#6B6B6B';
const BORDER = '#E8E8E8';
const GREEN = '#2D6A4F';

const SANS = 'Poppins_400Regular';
const SANS_SEMI = 'Poppins_600SemiBold';
const SERIF = 'CormorantGaramond_700Bold';

const PLATFORMS: Platform[] = ['eBay', 'Poshmark', 'Depop', 'Mercari'];
const THRESHOLDS = [5, 10, 15, 20, 25];

export default function SettingsScreen() {
  const [settings, setSettings] = useState<AppSettings>({
    minProfitThreshold: 10,
    platforms: ['eBay'],
    notificationsEnabled: false,
  });

  useFocusEffect(
    useCallback(() => {
      loadSettings().then(setSettings);
    }, [])
  );

  const update = async (patch: Partial<AppSettings>) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    await saveSettings(next);
  };

  const togglePlatform = async (platform: Platform) => {
    const current = settings.platforms;
    const next = current.includes(platform)
      ? current.filter((p) => p !== platform)
      : [...current, platform];
    if (next.length === 0) return;
    await update({ platforms: next });
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear Scan History',
      'This will delete all your saved scans. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await clearHistory();
            Alert.alert('Done', 'Scan history cleared.');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.pageTitle}>SETTINGS</Text>

      <Text style={styles.sectionTitle}>Min Profit Threshold</Text>
      <Text style={styles.sectionNote}>Only show BUY when estimated profit exceeds this</Text>
      <View style={styles.thresholdRow}>
        {THRESHOLDS.map((val) => (
          <TouchableOpacity
            key={val}
            style={[styles.thresholdBtn, settings.minProfitThreshold === val && styles.thresholdActive]}
            onPress={() => update({ minProfitThreshold: val })}
          >
            <Text style={[styles.thresholdText, settings.minProfitThreshold === val && styles.thresholdTextActive]}>
              ${val}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>Resale Platforms</Text>
      <Text style={styles.sectionNote}>Comp prices are pulled from selected platforms</Text>
      {PLATFORMS.map((platform) => {
        const active = settings.platforms.includes(platform);
        return (
          <TouchableOpacity
            key={platform}
            style={styles.platformRow}
            onPress={() => togglePlatform(platform)}
          >
            <Text style={styles.platformName}>{platform}</Text>
            <View style={[styles.platformCheck, active && styles.platformCheckActive]}>
              {active && <Text style={styles.checkMark}>✓</Text>}
            </View>
          </TouchableOpacity>
        );
      })}

      <View style={styles.divider} />

      <View style={styles.switchRow}>
        <View>
          <Text style={styles.switchLabel}>Notifications</Text>
          <Text style={styles.switchNote}>Alerts for price drops on saved items</Text>
        </View>
        <Switch
          value={settings.notificationsEnabled}
          onValueChange={(val) => update({ notificationsEnabled: val })}
          trackColor={{ false: '#ccc', true: ACCENT }}
          thumbColor="#fff"
        />
      </View>

      <View style={styles.divider} />

      <TouchableOpacity style={styles.dangerButton} onPress={handleClearHistory}>
        <Text style={styles.dangerText}>Clear Scan History</Text>
      </TouchableOpacity>

      <Text style={styles.version}>FlipHunt v1.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: BG },
  container: { padding: 24, paddingTop: 32 },
  pageTitle: { fontFamily: SERIF, fontSize: 32, color: TEXT, letterSpacing: 6, marginBottom: 28 },
  sectionTitle: { fontFamily: SANS_SEMI, fontSize: 11, color: MUTED, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 },
  sectionNote: { fontFamily: SANS, fontSize: 11, color: MUTED, opacity: 0.7, marginBottom: 14 },
  thresholdRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  thresholdBtn: { flex: 1, paddingVertical: 10, borderRadius: 4, borderWidth: 1, borderColor: BORDER, alignItems: 'center' },
  thresholdActive: { backgroundColor: ACCENT, borderColor: ACCENT },
  thresholdText: { fontFamily: SANS_SEMI, fontSize: 13, color: MUTED },
  thresholdTextActive: { color: '#fff' },
  divider: { height: 1, backgroundColor: BORDER, marginVertical: 24 },
  platformRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: BORDER },
  platformName: { fontFamily: SANS_SEMI, fontSize: 15, color: TEXT },
  platformCheck: { width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, borderColor: BORDER, alignItems: 'center', justifyContent: 'center' },
  platformCheckActive: { backgroundColor: ACCENT, borderColor: ACCENT },
  checkMark: { color: '#fff', fontSize: 13 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  switchLabel: { fontFamily: SANS_SEMI, fontSize: 15, color: TEXT, marginBottom: 2 },
  switchNote: { fontFamily: SANS, fontSize: 11, color: MUTED, opacity: 0.7 },
  dangerButton: { paddingVertical: 14, borderWidth: 1, borderColor: '#C0392B', borderRadius: 4, alignItems: 'center', marginBottom: 32 },
  dangerText: { fontFamily: SANS_SEMI, color: '#C0392B', fontSize: 13, letterSpacing: 2 },
  version: { fontFamily: SANS, fontSize: 11, color: MUTED, opacity: 0.5, textAlign: 'center', letterSpacing: 0.5 },
});
