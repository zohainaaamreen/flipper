import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, ActivityIndicator, Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { loadHistory, ScanRecord } from '../utils/history';
import { generateListing, generateCaption, generatePricingAdvice } from '../utils/assistant';

const BG = '#FFFFFF';
const CARD = '#F5F5F5';
const ACCENT = '#600000';
const TEXT = '#000000';
const MUTED = '#6B6B6B';
const BORDER = '#E8E8E8';
const GREEN = '#4A7C59';
const PASS_RED = '#C0392B';

const SERIF = 'CormorantGaramond_700Bold';
const SANS = 'Poppins_400Regular';
const SANS_SEMI = 'Poppins_600SemiBold';
const SANS_BOLD = 'Poppins_700Bold';

type Tool = 'listing' | 'caption' | 'profit' | 'pricing';

// ─── Shared components ────────────────────────────────

function BackHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <View style={sh.backHeader}>
      <TouchableOpacity onPress={onBack} style={sh.backBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Ionicons name="chevron-back" size={22} color={TEXT} />
      </TouchableOpacity>
      <Text style={sh.backTitle}>{title}</Text>
    </View>
  );
}

function ScanPicker({ selected, onSelect }: { selected: ScanRecord | null; onSelect: (s: ScanRecord) => void }) {
  const [scans, setScans] = useState<ScanRecord[]>([]);

  useEffect(() => {
    loadHistory().then(h => setScans(h.slice(0, 12)));
  }, []);

  if (scans.length === 0) {
    return (
      <View style={sh.emptyPicker}>
        <Text style={sh.emptyText}>No scans yet — head to the Camera tab to scan an item first.</Text>
      </View>
    );
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={sh.pickerScroll} contentContainerStyle={{ paddingRight: 8 }}>
      {scans.map(scan => {
        const isSelected = selected?.id === scan.id;
        return (
          <TouchableOpacity
            key={scan.id}
            onPress={() => onSelect(scan)}
            style={[sh.pickerCard, isSelected && sh.pickerCardSelected]}
          >
            <Text style={[sh.pickerBrand, isSelected && { color: TEXT }]}>{scan.brand}</Text>
            <Text style={sh.pickerItem} numberOfLines={2}>{scan.item}</Text>
            <View style={[sh.badge, scan.recommendation === 'BUY' ? sh.badgeBuy : sh.badgePass]}>
              <Text style={sh.badgeText}>{scan.recommendation}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

function ResultCard({ text, onShare }: { text: string; onShare: () => void }) {
  return (
    <View style={sh.resultCard}>
      <ScrollView style={sh.resultScroll} nestedScrollEnabled showsVerticalScrollIndicator={false}>
        <Text style={sh.resultText}>{text}</Text>
      </ScrollView>
      <TouchableOpacity style={sh.shareBtn} onPress={onShare}>
        <Ionicons name="share-outline" size={15} color={TEXT} />
        <Text style={sh.shareBtnText}>SHARE</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Listing Writer ───────────────────────────────────

function ListingWriter({ onBack }: { onBack: () => void }) {
  const [selected, setSelected] = useState<ScanRecord | null>(null);
  const [platform, setPlatform] = useState<'eBay' | 'Poshmark' | 'Both'>('eBay');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const generate = async () => {
    if (!selected) return;
    setLoading(true); setError(''); setResult('');
    try { setResult(await generateListing(selected, platform)); }
    catch { setError('Something went wrong. Check your connection and try again.'); }
    finally { setLoading(false); }
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <BackHeader title="LISTING WRITER" onBack={onBack} />
      <Text style={s.label}>SELECT A SCAN</Text>
      <ScanPicker selected={selected} onSelect={setSelected} />
      <Text style={s.label}>PLATFORM</Text>
      <View style={s.segmented}>
        {(['eBay', 'Poshmark', 'Both'] as const).map(p => (
          <TouchableOpacity key={p} style={[s.segment, platform === p && s.segmentOn]} onPress={() => setPlatform(p)}>
            <Text style={[s.segmentText, platform === p && s.segmentTextOn]}>{p}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={[s.generateBtn, (!selected || loading) && s.generateBtnOff]} onPress={generate} disabled={!selected || loading}>
        {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={s.generateBtnText}>GENERATE LISTING</Text>}
      </TouchableOpacity>
      {!!error && <Text style={s.error}>{error}</Text>}
      {!!result && <ResultCard text={result} onShare={() => Share.share({ message: result })} />}
    </ScrollView>
  );
}

// ─── Caption Generator ────────────────────────────────

function CaptionGenerator({ onBack }: { onBack: () => void }) {
  const [selected, setSelected] = useState<ScanRecord | null>(null);
  const [platform, setPlatform] = useState<'Instagram' | 'TikTok'>('Instagram');
  const [tone, setTone] = useState<'Aesthetic' | 'Hype' | 'Casual'>('Aesthetic');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const generate = async () => {
    if (!selected) return;
    setLoading(true); setError(''); setResult('');
    try { setResult(await generateCaption(selected, platform, tone)); }
    catch { setError('Something went wrong. Check your connection and try again.'); }
    finally { setLoading(false); }
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <BackHeader title="CAPTION GENERATOR" onBack={onBack} />
      <Text style={s.label}>SELECT A SCAN</Text>
      <ScanPicker selected={selected} onSelect={setSelected} />
      <Text style={s.label}>PLATFORM</Text>
      <View style={s.segmented}>
        {(['Instagram', 'TikTok'] as const).map(p => (
          <TouchableOpacity key={p} style={[s.segment, platform === p && s.segmentOn]} onPress={() => setPlatform(p)}>
            <Text style={[s.segmentText, platform === p && s.segmentTextOn]}>{p}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={s.label}>TONE</Text>
      <View style={s.segmented}>
        {(['Aesthetic', 'Hype', 'Casual'] as const).map(t => (
          <TouchableOpacity key={t} style={[s.segment, tone === t && s.segmentOn]} onPress={() => setTone(t)}>
            <Text style={[s.segmentText, tone === t && s.segmentTextOn]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={[s.generateBtn, (!selected || loading) && s.generateBtnOff]} onPress={generate} disabled={!selected || loading}>
        {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={s.generateBtnText}>GENERATE CAPTION</Text>}
      </TouchableOpacity>
      {!!error && <Text style={s.error}>{error}</Text>}
      {!!result && <ResultCard text={result} onShare={() => Share.share({ message: result })} />}
    </ScrollView>
  );
}

// ─── Profit Calculator ────────────────────────────────

const FEES: Record<string, (p: number) => number> = {
  eBay: (p) => p * 0.1325,
  Poshmark: (p) => (p <= 15 ? 2.95 : p * 0.20),
  Depop: (p) => p * 0.10,
  Mercari: (p) => p * 0.10,
};

const FEE_LABELS: Record<string, (p: number) => string> = {
  eBay: () => '13.25%',
  Poshmark: (p) => (p <= 15 ? '$2.95 flat' : '20%'),
  Depop: () => '10%',
  Mercari: () => '10%',
};

function ProfitCalculator({ onBack }: { onBack: () => void }) {
  const [salePrice, setSalePrice] = useState('');
  const [shippingCost, setShippingCost] = useState('');
  const [platform, setPlatform] = useState<'eBay' | 'Poshmark' | 'Depop' | 'Mercari'>('eBay');

  const sale = parseFloat(salePrice) || 0;
  const ship = parseFloat(shippingCost) || 0;
  const fee = sale > 0 ? FEES[platform](sale) : 0;
  const profit = sale - fee - ship;
  const margin = sale > 0 ? (profit / sale) * 100 : 0;
  const profitColor = profit >= 10 ? GREEN : profit > 0 ? MUTED : PASS_RED;

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <BackHeader title="PROFIT CALCULATOR" onBack={onBack} />
      <Text style={s.label}>PLATFORM</Text>
      <View style={s.segmented}>
        {(['eBay', 'Poshmark', 'Depop', 'Mercari'] as const).map(p => (
          <TouchableOpacity key={p} style={[s.segment, platform === p && s.segmentOn]} onPress={() => setPlatform(p)}>
            <Text style={[s.segmentText, s.segmentTextSm, platform === p && s.segmentTextOn]}>{p}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={s.label}>SALE PRICE</Text>
      <View style={s.inputRow}>
        <Text style={s.inputPrefix}>$</Text>
        <TextInput style={s.input} value={salePrice} onChangeText={setSalePrice} keyboardType="decimal-pad" placeholder="0.00" placeholderTextColor={MUTED} />
      </View>
      <Text style={s.label}>YOUR SHIPPING COST</Text>
      <View style={s.inputRow}>
        <Text style={s.inputPrefix}>$</Text>
        <TextInput style={s.input} value={shippingCost} onChangeText={setShippingCost} keyboardType="decimal-pad" placeholder="0.00" placeholderTextColor={MUTED} />
      </View>
      {sale > 0 && (
        <View style={s.breakdown}>
          <View style={s.bRow}>
            <Text style={s.bLabel}>Sale Price</Text>
            <Text style={s.bVal}>${sale.toFixed(2)}</Text>
          </View>
          <View style={s.bRow}>
            <Text style={s.bLabel}>Platform Fee ({FEE_LABELS[platform](sale)})</Text>
            <Text style={[s.bVal, { color: PASS_RED }]}>−${fee.toFixed(2)}</Text>
          </View>
          <View style={s.bRow}>
            <Text style={s.bLabel}>Shipping Cost</Text>
            <Text style={[s.bVal, { color: ship > 0 ? PASS_RED : MUTED }]}>{ship > 0 ? `−$${ship.toFixed(2)}` : '$0.00'}</Text>
          </View>
          <View style={s.bDivider} />
          <View style={s.bRow}>
            <Text style={s.bLabelBold}>Net Profit</Text>
            <Text style={[s.bValBold, { color: profitColor }]}>{profit >= 0 ? '+' : ''}${profit.toFixed(2)}</Text>
          </View>
          <View style={s.bRow}>
            <Text style={s.bLabel}>Margin</Text>
            <Text style={[s.bVal, { color: margin >= 30 ? GREEN : MUTED }]}>{margin.toFixed(1)}%</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

// ─── Pricing Advisor ──────────────────────────────────

function PricingAdvisor({ onBack }: { onBack: () => void }) {
  const [selected, setSelected] = useState<ScanRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const generate = async () => {
    if (!selected) return;
    setLoading(true); setError(''); setResult('');
    try { setResult(await generatePricingAdvice(selected)); }
    catch { setError('Something went wrong. Check your connection and try again.'); }
    finally { setLoading(false); }
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <BackHeader title="PRICING ADVISOR" onBack={onBack} />
      <Text style={s.label}>SELECT A SCAN</Text>
      <ScanPicker selected={selected} onSelect={setSelected} />
      <TouchableOpacity style={[s.generateBtn, (!selected || loading) && s.generateBtnOff]} onPress={generate} disabled={!selected || loading}>
        {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={s.generateBtnText}>GET PRICING ADVICE</Text>}
      </TouchableOpacity>
      {!!error && <Text style={s.error}>{error}</Text>}
      {!!result && <ResultCard text={result} onShare={() => Share.share({ message: result })} />}
    </ScrollView>
  );
}

// ─── Tool list ────────────────────────────────────────

const TOOLS: { id: Tool; icon: React.ComponentProps<typeof Ionicons>['name']; title: string; desc: string }[] = [
  { id: 'listing', icon: 'pricetag-outline', title: 'Listing Writer', desc: 'Generate eBay and Poshmark descriptions from your scan' },
  { id: 'caption', icon: 'logo-instagram', title: 'Caption Generator', desc: 'Instagram and TikTok captions for your thrift finds' },
  { id: 'profit', icon: 'calculator-outline', title: 'Profit Calculator', desc: 'Factor in fees and shipping to see your real margin' },
  { id: 'pricing', icon: 'bulb-outline', title: 'Pricing Advisor', desc: 'Get a suggested price based on comps and demand' },
];

// ─── Root ─────────────────────────────────────────────

export default function AssistantScreen() {
  const [activeTool, setActiveTool] = useState<Tool | null>(null);

  if (activeTool === 'listing') return <ListingWriter onBack={() => setActiveTool(null)} />;
  if (activeTool === 'caption') return <CaptionGenerator onBack={() => setActiveTool(null)} />;
  if (activeTool === 'profit') return <ProfitCalculator onBack={() => setActiveTool(null)} />;
  if (activeTool === 'pricing') return <PricingAdvisor onBack={() => setActiveTool(null)} />;

  return (
    <View style={s.container}>
      <Text style={s.pageTitle}>ASSISTANT</Text>
      <Text style={s.subtitle}>Your reseller toolkit</Text>
      <View style={s.toolList}>
        {TOOLS.map(({ id, icon, title, desc }) => (
          <TouchableOpacity key={id} style={s.toolRow} onPress={() => setActiveTool(id)}>
            <View style={s.toolIcon}>
              <Ionicons name={icon} size={20} color={TEXT} />
            </View>
            <View style={s.toolText}>
              <Text style={s.toolTitle}>{title}</Text>
              <Text style={s.toolDesc}>{desc}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={MUTED} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ─── Shared styles ────────────────────────────────────

const sh = StyleSheet.create({
  backHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 24 },
  backBtn: { padding: 2 },
  backTitle: { fontFamily: SANS_SEMI, fontSize: 14, color: TEXT, letterSpacing: 3 },
  emptyPicker: { backgroundColor: CARD, borderRadius: 8, padding: 20, marginBottom: 20 },
  emptyText: { fontFamily: SANS, fontSize: 13, color: MUTED, textAlign: 'center', lineHeight: 19 },
  pickerScroll: { marginBottom: 20 },
  pickerCard: { backgroundColor: CARD, borderRadius: 8, padding: 12, marginRight: 10, width: 116, borderWidth: 2, borderColor: 'transparent' },
  pickerCardSelected: { borderColor: ACCENT },
  pickerBrand: { fontFamily: SANS_SEMI, fontSize: 11, color: MUTED, marginBottom: 3 },
  pickerItem: { fontFamily: SANS, fontSize: 11, color: TEXT, lineHeight: 15, marginBottom: 8 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 3 },
  badgeBuy: { backgroundColor: GREEN },
  badgePass: { backgroundColor: PASS_RED },
  badgeText: { fontFamily: SANS_SEMI, fontSize: 9, color: '#fff', letterSpacing: 1 },
  resultCard: { backgroundColor: CARD, borderRadius: 8, padding: 16, marginTop: 16 },
  resultScroll: { maxHeight: 260, marginBottom: 12 },
  resultText: { fontFamily: SANS, fontSize: 13, color: TEXT, lineHeight: 21 },
  shareBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingTop: 10, borderTopWidth: 1, borderTopColor: BORDER },
  shareBtnText: { fontFamily: SANS_SEMI, fontSize: 11, color: TEXT, letterSpacing: 2 },
});

// ─── Screen styles ────────────────────────────────────

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG, paddingHorizontal: 24, paddingTop: 32 },
  content: { paddingBottom: 48 },

  pageTitle: { fontFamily: SERIF, fontSize: 32, color: TEXT, letterSpacing: 6, marginBottom: 4 },
  subtitle: { fontFamily: SANS, fontSize: 13, color: MUTED, letterSpacing: 1, marginBottom: 28 },
  toolList: { gap: 4 },
  toolRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: BORDER, gap: 14 },
  toolIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: CARD, alignItems: 'center', justifyContent: 'center' },
  toolText: { flex: 1 },
  toolTitle: { fontFamily: SANS_BOLD, fontSize: 14, color: TEXT, marginBottom: 2 },
  toolDesc: { fontFamily: SANS, fontSize: 12, color: MUTED, lineHeight: 17 },

  label: { fontFamily: SANS_SEMI, fontSize: 11, color: MUTED, letterSpacing: 2, marginBottom: 10 },

  segmented: { flexDirection: 'row', backgroundColor: CARD, borderRadius: 8, padding: 3, marginBottom: 20, gap: 3 },
  segment: { flex: 1, paddingVertical: 9, borderRadius: 6, alignItems: 'center' },
  segmentOn: { backgroundColor: ACCENT },
  segmentText: { fontFamily: SANS_SEMI, fontSize: 12, color: MUTED },
  segmentTextSm: { fontSize: 11 },
  segmentTextOn: { color: '#fff' },

  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: CARD, borderRadius: 8, paddingHorizontal: 14, marginBottom: 20 },
  inputPrefix: { fontFamily: SANS, fontSize: 16, color: MUTED, marginRight: 4 },
  input: { fontFamily: SANS, flex: 1, height: 48, fontSize: 16, color: TEXT },

  breakdown: { backgroundColor: CARD, borderRadius: 8, padding: 16, marginTop: 4 },
  bRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7 },
  bLabel: { fontFamily: SANS, fontSize: 13, color: MUTED },
  bVal: { fontFamily: SANS_SEMI, fontSize: 13, color: TEXT },
  bLabelBold: { fontFamily: SANS_BOLD, fontSize: 15, color: TEXT },
  bValBold: { fontFamily: SANS_BOLD, fontSize: 20 },
  bDivider: { height: 1, backgroundColor: BORDER, marginVertical: 4 },

  generateBtn: { backgroundColor: ACCENT, borderRadius: 8, paddingVertical: 16, alignItems: 'center', marginBottom: 4 },
  generateBtnOff: { opacity: 0.4 },
  generateBtnText: { fontFamily: SANS_SEMI, color: '#fff', fontSize: 13, letterSpacing: 2 },

  error: { fontFamily: SANS, fontSize: 13, color: PASS_RED, textAlign: 'center', marginTop: 12 },
});
