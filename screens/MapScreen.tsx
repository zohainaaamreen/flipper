import { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Dimensions,
} from 'react-native';
import MapView, { Marker, Callout, Region } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

const BEIGE = '#F5F0E8';
const BLACK = '#1A1A1A';
const GREEN = '#2D6A4F';
const MUTED = '#9C8F7E';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type StoreType = 'thrift' | 'vintage' | 'consignment' | 'luxury';

type Store = {
  id: string;
  name: string;
  area: string;
  note: string;
  type: StoreType;
  latitude: number;
  longitude: number;
};

const STORES: Store[] = [
  { id: '1', name: 'Housing Works Thrift', area: 'Gramercy · 157 E 23rd St', note: 'Best for designer finds', type: 'thrift', latitude: 40.7398, longitude: -73.9850 },
  { id: '2', name: "Beacon's Closet", area: 'Williamsburg · 74 Guernsey St', note: 'Great vintage selection', type: 'vintage', latitude: 40.7235, longitude: -73.9513 },
  { id: '3', name: "Beacon's Closet", area: 'Park Slope · 92 5th Ave', note: 'Great vintage selection', type: 'vintage', latitude: 40.6736, longitude: -73.9763 },
  { id: '4', name: 'Buffalo Exchange', area: 'East Village · 332 E 11th St', note: 'Curated resale', type: 'consignment', latitude: 40.7285, longitude: -73.9822 },
  { id: '5', name: 'Buffalo Exchange', area: 'Williamsburg · 504 Driggs Ave', note: 'Curated resale', type: 'consignment', latitude: 40.7178, longitude: -73.9502 },
  { id: '6', name: 'The RealReal', area: 'SoHo · 80 Wooster St', note: 'Luxury consignment', type: 'luxury', latitude: 40.7245, longitude: -74.0029 },
  { id: '7', name: 'Crossroads Trading', area: 'Greenwich Village · 97 E 4th St', note: 'Mid-range vintage', type: 'consignment', latitude: 40.7256, longitude: -73.9872 },
  { id: '8', name: 'L Train Vintage', area: 'Williamsburg · 204 Bedford Ave', note: 'Pound sale events', type: 'vintage', latitude: 40.7183, longitude: -73.9571 },
  { id: '9', name: 'Goodwill NYC', area: 'Upper West Side · 217 W 79th St', note: 'High volume, low price', type: 'thrift', latitude: 40.7840, longitude: -73.9797 },
  { id: '10', name: 'Cure Thrift Shop', area: 'Gramercy · 111 E 12th St', note: 'Hidden gems', type: 'thrift', latitude: 40.7322, longitude: -73.9882 },
  { id: '11', name: 'New York Vintage', area: 'Chelsea · 117 W 25th St', note: 'High-end vintage archive', type: 'luxury', latitude: 40.7461, longitude: -73.9936 },
  { id: '12', name: 'Desert Vintage', area: 'Lower East Side · 34 E 1st St', note: 'Affordable downtown finds', type: 'vintage', latitude: 40.7228, longitude: -73.9875 },
  { id: '13', name: 'Salvation Army', area: "Hell's Kitchen · 536 W 46th St", note: 'Large floor, lots to dig through', type: 'thrift', latitude: 40.7617, longitude: -73.9975 },
  { id: '14', name: 'Screaming Mimi\'s', area: 'NoHo · 382 Lafayette St', note: 'Curated decades-based vintage', type: 'vintage', latitude: 40.7264, longitude: -73.9952 },
];

const TYPE_COLORS: Record<StoreType, string> = {
  thrift: '#2D6A4F',
  vintage: '#B7860B',
  consignment: '#1A1A1A',
  luxury: '#C0392B',
};

const TYPE_LABELS: Record<StoreType, string> = {
  thrift: 'Thrift',
  vintage: 'Vintage',
  consignment: 'Consignment',
  luxury: 'Luxury',
};

const NYC_REGION: Region = {
  latitude: 40.7384,
  longitude: -73.9862,
  latitudeDelta: 0.18,
  longitudeDelta: 0.14,
};

export default function MapScreen() {
  const [view, setView] = useState<'map' | 'list'>('map');
  const [selected, setSelected] = useState<Store | null>(null);

  return (
    <View style={styles.container}>
      <View style={styles.toggle}>
        <TouchableOpacity
          style={[styles.toggleBtn, view === 'map' && styles.toggleActive]}
          onPress={() => setView('map')}
        >
          <Ionicons name="map-outline" size={14} color={view === 'map' ? BEIGE : MUTED} />
          <Text style={[styles.toggleText, view === 'map' && styles.toggleTextActive]}>Map</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, view === 'list' && styles.toggleActive]}
          onPress={() => setView('list')}
        >
          <Ionicons name="list-outline" size={14} color={view === 'list' ? BEIGE : MUTED} />
          <Text style={[styles.toggleText, view === 'list' && styles.toggleTextActive]}>List</Text>
        </TouchableOpacity>
      </View>

      {view === 'map' ? (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={NYC_REGION}
            showsUserLocation
            showsCompass={false}
          >
            {STORES.map((store) => (
              <Marker
                key={store.id}
                coordinate={{ latitude: store.latitude, longitude: store.longitude }}
                onPress={() => setSelected(store)}
                pinColor={TYPE_COLORS[store.type]}
              >
                <View style={[styles.pin, { backgroundColor: TYPE_COLORS[store.type] }]}>
                  <Ionicons name="shirt-outline" size={11} color="#fff" />
                </View>
                <Callout tooltip>
                  <View style={styles.callout}>
                    <Text style={styles.calloutName}>{store.name}</Text>
                    <Text style={styles.calloutArea}>{store.area}</Text>
                    <Text style={styles.calloutNote}>{store.note}</Text>
                    <View style={[styles.calloutBadge, { backgroundColor: TYPE_COLORS[store.type] }]}>
                      <Text style={styles.calloutBadgeText}>{TYPE_LABELS[store.type]}</Text>
                    </View>
                  </View>
                </Callout>
              </Marker>
            ))}
          </MapView>

          <View style={styles.legend}>
            {(Object.keys(TYPE_COLORS) as StoreType[]).map((type) => (
              <View key={type} style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: TYPE_COLORS[type] }]} />
                <Text style={styles.legendText}>{TYPE_LABELS[type]}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : (
        <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
          <Text style={styles.listTitle}>NYC Thrift & Vintage</Text>
          {(Object.keys(TYPE_COLORS) as StoreType[]).map((type) => {
            const group = STORES.filter((s) => s.type === type);
            return (
              <View key={type} style={styles.group}>
                <View style={styles.groupHeader}>
                  <View style={[styles.groupDot, { backgroundColor: TYPE_COLORS[type] }]} />
                  <Text style={styles.groupLabel}>{TYPE_LABELS[type]}</Text>
                </View>
                {group.map((store) => (
                  <View key={store.id} style={styles.storeCard}>
                    <Text style={styles.storeName}>{store.name}</Text>
                    <Text style={styles.storeArea}>{store.area}</Text>
                    <Text style={styles.storeNote}>{store.note}</Text>
                  </View>
                ))}
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BEIGE },
  toggle: {
    flexDirection: 'row',
    margin: 12,
    backgroundColor: '#EDE8DF',
    borderRadius: 8,
    padding: 3,
    alignSelf: 'center',
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 20,
    borderRadius: 6,
    gap: 5,
  },
  toggleActive: { backgroundColor: BLACK },
  toggleText: { fontSize: 12, fontWeight: '700', color: MUTED, letterSpacing: 1 },
  toggleTextActive: { color: BEIGE },
  mapContainer: { flex: 1 },
  map: { flex: 1 },
  pin: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  callout: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  calloutName: { fontSize: 13, fontWeight: '900', color: BLACK, marginBottom: 2 },
  calloutArea: { fontSize: 11, color: MUTED, marginBottom: 4 },
  calloutNote: { fontSize: 11, color: BLACK, opacity: 0.6, marginBottom: 8, fontStyle: 'italic' },
  calloutBadge: { alignSelf: 'flex-start', paddingVertical: 3, paddingHorizontal: 8, borderRadius: 3 },
  calloutBadgeText: { color: '#fff', fontSize: 9, fontWeight: '700', letterSpacing: 1 },
  legend: {
    position: 'absolute',
    bottom: 24,
    left: 12,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 8,
    padding: 10,
    gap: 5,
  },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 11, color: BLACK, fontWeight: '600' },
  list: { flex: 1 },
  listContent: { padding: 20, paddingBottom: 48 },
  listTitle: { fontSize: 20, fontWeight: '900', color: BLACK, letterSpacing: 4, marginBottom: 20 },
  group: { marginBottom: 24 },
  groupHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  groupDot: { width: 10, height: 10, borderRadius: 5 },
  groupLabel: { fontSize: 11, fontWeight: '700', color: BLACK, letterSpacing: 2, textTransform: 'uppercase' },
  storeCard: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0D9CE',
  },
  storeName: { fontSize: 14, fontWeight: '700', color: BLACK, marginBottom: 2 },
  storeArea: { fontSize: 12, color: MUTED, marginBottom: 2 },
  storeNote: { fontSize: 11, color: BLACK, opacity: 0.45, fontStyle: 'italic' },
});
