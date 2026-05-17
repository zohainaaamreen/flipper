import AsyncStorage from '@react-native-async-storage/async-storage';

export type PlatformPrices = {
  eBay: string;
  Poshmark: string;
  Depop: string;
  Mercari: string;
};

export type ScanRecord = {
  id: string;
  brand: string;
  item: string;
  recommendation: 'BUY' | 'PASS';
  confidence: number;
  suggestedPrice: string;
  reasoning?: string;
  platformPrices?: PlatformPrices;
  material?: string;
  condition?: string;
  styleCore?: string;
  date: string;
  labelPhotoUri?: string;
  compositionPhotoUri?: string;
  stylePhotoUri?: string;
  photoUri?: string;
};

const KEY = 'flipper_scan_history';

export async function saveToHistory(scan: Omit<ScanRecord, 'id' | 'date'>): Promise<void> {
  const existing = await loadHistory();
  const record: ScanRecord = {
    ...scan,
    id: Date.now().toString(),
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  };
  await AsyncStorage.setItem(KEY, JSON.stringify([record, ...existing]));
}

export async function loadHistory(): Promise<ScanRecord[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function clearHistory(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}
