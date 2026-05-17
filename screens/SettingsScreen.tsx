import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { loadSettings, saveSettings, AppSettings, Platform } from '../utils/settings';
import { clearHistory } from '../utils/history';

const BEIGE = '#F5F0E8';
const BLACK = '#1A1A1A';
const GREEN = '#2D6A4F';
const MUTED = '#9C8F7E';

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
          trackColor={{ false: '#ccc', true: GREEN }}
          thumbColor={BEIGE}
        />
      </View>

      <View style={styles.divider} />

      <TouchableOpacity style={styles.dangerButton} onPress={handleClearHistory}>
        <Text style={styles.dangerText}>Clear Scan History</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Flipper v0.1 · AI analysis coming soon</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: BEIGE },
  container: { padding: 24, paddingTop: 32 },
  pageTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: BLACK,
    letterSpacing: 8,
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 11,
    color: MUTED,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  sectionNote: {
    fontSize: 11,
    color: MUTED,
    opacity: 0.7,
    marginBottom: 14,
  },
  thresholdRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  thresholdBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#D0C8BB',
    alignItems: 'center',
  },
  thresholdActive: {
    backgroundColor: BLACK,
    borderColor: BLACK,
  },
  thresholdText: {
    fontSize: 13,
    fontWeight: '700',
    color: MUTED,
  },
  thresholdTextActive: {
    color: BEIGE,
  },
  divider: { height: 1, backgroundColor: '#E0D9CE', marginVertical: 24 },
  platformRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E0D9CE',
  },
  platformName: { fontSize: 15, fontWeight: '600', color: BLACK },
  platformCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#C0B8AC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  platformCheckActive: {
    backgroundColor: BLACK,
    borderColor: BLACK,
  },
  checkMark: { color: BEIGE, fontSize: 13, fontWeight: '900' },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: { fontSize: 15, fontWeight: '600', color: BLACK, marginBottom: 2 },
  switchNote: { fontSize: 11, color: MUTED, opacity: 0.7 },
  dangerButton: {
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#C0392B',
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 32,
  },
  dangerText: { color: '#C0392B', fontSize: 13, letterSpacing: 2, fontWeight: '600' },
  version: { fontSize: 11, color: MUTED, opacity: 0.5, textAlign: 'center', letterSpacing: 0.5 },
});
