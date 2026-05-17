import AsyncStorage from '@react-native-async-storage/async-storage';

export type Platform = 'eBay' | 'Poshmark' | 'Depop' | 'Mercari';

export type AppSettings = {
  minProfitThreshold: number;
  platforms: Platform[];
  notificationsEnabled: boolean;
};

const KEY = 'flipper_settings';

const DEFAULTS: AppSettings = {
  minProfitThreshold: 10,
  platforms: ['eBay'],
  notificationsEnabled: false,
};

export async function loadSettings(): Promise<AppSettings> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return DEFAULTS;
  return { ...DEFAULTS, ...JSON.parse(raw) };
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(settings));
}
