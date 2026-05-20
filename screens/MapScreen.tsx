import { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Linking,
} from 'react-native';
import MapView, { Marker, Callout, Region } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

const BG = '#FFFFFF';
const CARD = '#F5F5F5';
const ACCENT = '#600000';
const TEXT = '#000000';
const MUTED = '#6B6B6B';
const BORDER = '#E8E8E8';

const SANS = 'Poppins_400Regular';
const SANS_SEMI = 'Poppins_600SemiBold';
const SANS_BOLD = 'Poppins_700Bold';
const SERIF = 'CormorantGaramond_700Bold';

type StoreType = 'thrift' | 'vintage' | 'consignment' | 'luxury';
type Borough = 'Manhattan' | 'Brooklyn' | 'Queens' | 'Bronx' | 'Staten Island';

type Store = {
  id: string;
  name: string;
  area: string;
  note: string;
  type: StoreType;
  borough: Borough;
  latitude: number;
  longitude: number;
};

const STORES: Store[] = [
  // ── Manhattan ──────────────────────────────────────
  { id: 'm1',  name: 'Housing Works Thrift',      area: 'Gramercy · 157 E 23rd St',       note: 'Best for designer finds',              type: 'thrift',      borough: 'Manhattan',      latitude: 40.7398, longitude: -73.9850 },
  { id: 'm2',  name: 'Housing Works Thrift',      area: 'Chelsea · 143 W 17th St',         note: 'Great furniture and clothes mix',       type: 'thrift',      borough: 'Manhattan',      latitude: 40.7401, longitude: -74.0002 },
  { id: 'm3',  name: 'Housing Works Thrift',      area: 'SoHo · 130 Crosby St',            note: 'Curated drops, high foot traffic',      type: 'thrift',      borough: 'Manhattan',      latitude: 40.7232, longitude: -73.9973 },
  { id: 'm4',  name: 'Goodwill NYC',              area: 'Upper West Side · 217 W 79th St', note: 'High volume, low price',                type: 'thrift',      borough: 'Manhattan',      latitude: 40.7840, longitude: -73.9797 },
  { id: 'm5',  name: 'Salvation Army',            area: "Hell's Kitchen · 536 W 46th St",  note: 'Large floor, lots to dig through',      type: 'thrift',      borough: 'Manhattan',      latitude: 40.7617, longitude: -73.9975 },
  { id: 'm6',  name: 'Cure Thrift Shop',          area: 'East Village · 111 E 12th St',    note: 'Hidden gems, rotating stock',           type: 'thrift',      borough: 'Manhattan',      latitude: 40.7322, longitude: -73.9882 },
  { id: 'm7',  name: 'Angel Street Thrift',       area: 'Chelsea · 118 W 17th St',         note: 'Affordable, well-organized',            type: 'thrift',      borough: 'Manhattan',      latitude: 40.7404, longitude: -74.0001 },
  { id: 'm8',  name: 'Buffalo Exchange',          area: 'East Village · 332 E 11th St',    note: 'Curated resale, good brand mix',        type: 'consignment', borough: 'Manhattan',      latitude: 40.7285, longitude: -73.9822 },
  { id: 'm9',  name: 'Crossroads Trading',        area: 'NoHo · 97 E 4th St',              note: 'Mid-range vintage',                     type: 'consignment', borough: 'Manhattan',      latitude: 40.7256, longitude: -73.9872 },
  { id: 'm10', name: 'INA NYC',                   area: 'SoHo · 101 Thompson St',          note: 'High-end consignment, great labels',    type: 'consignment', borough: 'Manhattan',      latitude: 40.7245, longitude: -74.0005 },
  { id: 'm11', name: 'Screaming Mimi\'s',         area: 'NoHo · 382 Lafayette St',         note: 'Curated decades-based vintage',         type: 'vintage',     borough: 'Manhattan',      latitude: 40.7264, longitude: -73.9952 },
  { id: 'm12', name: 'Desert Vintage',            area: 'Lower East Side · 34 E 1st St',   note: 'Affordable downtown finds',             type: 'vintage',     borough: 'Manhattan',      latitude: 40.7228, longitude: -73.9875 },
  { id: 'm13', name: 'Tokio 7',                   area: 'East Village · 64 E 7th St',      note: 'Designer consignment, great for bags',  type: 'vintage',     borough: 'Manhattan',      latitude: 40.7274, longitude: -73.9867 },
  { id: 'm14', name: 'The RealReal',              area: 'SoHo · 80 Wooster St',            note: 'Authenticated luxury consignment',      type: 'luxury',      borough: 'Manhattan',      latitude: 40.7245, longitude: -74.0029 },
  { id: 'm15', name: 'New York Vintage',          area: 'Chelsea · 117 W 25th St',         note: 'High-end archive, serious buyers only', type: 'luxury',      borough: 'Manhattan',      latitude: 40.7461, longitude: -73.9936 },
  { id: 'm16', name: 'Encore Resale Boutique',    area: 'Upper East Side · 1132 Madison Ave', note: 'UES luxury resale institution',       type: 'luxury',      borough: 'Manhattan',      latitude: 40.7773, longitude: -73.9615 },

  // ── Brooklyn ───────────────────────────────────────
  { id: 'b1',  name: "Beacon's Closet",           area: 'Williamsburg · 74 Guernsey St',   note: 'Best buying prices in the city',        type: 'vintage',     borough: 'Brooklyn',       latitude: 40.7235, longitude: -73.9513 },
  { id: 'b2',  name: "Beacon's Closet",           area: 'Park Slope · 92 5th Ave',         note: 'Great vintage selection',               type: 'vintage',     borough: 'Brooklyn',       latitude: 40.6736, longitude: -73.9763 },
  { id: 'b3',  name: "Beacon's Closet",           area: 'Greenpoint · 10 W 25th St',       note: 'Newer location, less picked over',      type: 'vintage',     borough: 'Brooklyn',       latitude: 40.7296, longitude: -73.9482 },
  { id: 'b4',  name: 'L Train Vintage',           area: 'Williamsburg · 204 Bedford Ave',  note: 'Pound sale events on Mondays',          type: 'vintage',     borough: 'Brooklyn',       latitude: 40.7183, longitude: -73.9571 },
  { id: 'b5',  name: 'L Train Vintage',           area: 'Bushwick · 1377 Myrtle Ave',      note: 'Great workwear and denim selection',    type: 'vintage',     borough: 'Brooklyn',       latitude: 40.6982, longitude: -73.9314 },
  { id: 'b6',  name: 'Buffalo Exchange',          area: 'Williamsburg · 504 Driggs Ave',   note: 'Curated resale',                        type: 'consignment', borough: 'Brooklyn',       latitude: 40.7178, longitude: -73.9502 },
  { id: 'b7',  name: 'Fox & Fawn',               area: 'Prospect Heights · 570 Vanderbilt Ave', note: 'Neighborhood vintage gem',         type: 'vintage',     borough: 'Brooklyn',       latitude: 40.6784, longitude: -73.9637 },
  { id: 'b8',  name: 'Housing Works Thrift',      area: 'Park Slope · 267 7th Ave',        note: 'Reliable finds, great prices',          type: 'thrift',      borough: 'Brooklyn',       latitude: 40.6678, longitude: -73.9802 },
  { id: 'b9',  name: 'Salvation Army',            area: 'Crown Heights · 1220 Atlantic Ave', note: 'Large stock, worth the dig',          type: 'thrift',      borough: 'Brooklyn',       latitude: 40.6776, longitude: -73.9365 },
  { id: 'b10', name: 'Goodwill',                  area: 'East New York · 2880 Atlantic Ave', note: 'High volume, low competition',         type: 'thrift',      borough: 'Brooklyn',       latitude: 40.6631, longitude: -73.8935 },
  { id: 'b11', name: 'Value Village',             area: 'Flatbush · 1881 Flatbush Ave',    note: 'Pound sales on weekends',               type: 'thrift',      borough: 'Brooklyn',       latitude: 40.6261, longitude: -73.9440 },

  // ── Queens ─────────────────────────────────────────
  { id: 'q1',  name: 'Value Village',             area: 'Ridgewood · 6823 Fresh Pond Rd',  note: 'Best thrift in Queens, huge floor',     type: 'thrift',      borough: 'Queens',         latitude: 40.7062, longitude: -73.9012 },
  { id: 'q2',  name: 'Goodwill',                  area: 'Jackson Heights · 74-15 Roosevelt Ave', note: 'Diverse stock, affordable',        type: 'thrift',      borough: 'Queens',         latitude: 40.7477, longitude: -73.8917 },
  { id: 'q3',  name: 'Salvation Army',            area: 'Woodhaven · 80-17 Jamaica Ave',   note: 'High volume, low prices',               type: 'thrift',      borough: 'Queens',         latitude: 40.6937, longitude: -73.8551 },
  { id: 'q4',  name: 'Goodwill',                  area: 'Jamaica · 148-01 Jamaica Ave',    note: 'Large floor, always restocking',        type: 'thrift',      borough: 'Queens',         latitude: 40.7019, longitude: -73.8026 },
  { id: 'q5',  name: 'Housing Works Thrift',      area: 'Forest Hills · 71-25 Austin St',  note: 'Well-curated for a thrift store',       type: 'thrift',      borough: 'Queens',         latitude: 40.7209, longitude: -73.8462 },

  // ── Bronx ──────────────────────────────────────────
  { id: 'x1',  name: 'Goodwill',                  area: 'South Bronx · 201 E 161st St',    note: 'High turnover, check often',            type: 'thrift',      borough: 'Bronx',          latitude: 40.8245, longitude: -73.9248 },
  { id: 'x2',  name: 'Salvation Army',            area: 'Morrisania · 1333 Boston Rd',     note: 'Large donation floor',                  type: 'thrift',      borough: 'Bronx',          latitude: 40.8298, longitude: -73.8990 },
  { id: 'x3',  name: 'Value Village',             area: 'Parkchester · 3028 Westchester Ave', note: 'Underrated, less picked over',        type: 'thrift',      borough: 'Bronx',          latitude: 40.8339, longitude: -73.8571 },
  { id: 'x4',  name: 'Housing Works Thrift',      area: 'Fordham · 748 Fordham Rd',        note: 'Solid finds near Fordham University',   type: 'thrift',      borough: 'Bronx',          latitude: 40.8594, longitude: -73.8963 },

  // ── Staten Island ──────────────────────────────────
  { id: 's1',  name: 'Goodwill',                  area: 'Charleston · 2945 Veterans Rd W', note: 'Largest SI thrift, good clothing rack', type: 'thrift',      borough: 'Staten Island',  latitude: 40.5168, longitude: -74.2079 },
  { id: 's2',  name: 'Salvation Army',            area: 'Grasmere · 1149 Richmond Ave',    note: 'Consistent stock, friendly staff',      type: 'thrift',      borough: 'Staten Island',  latitude: 40.5742, longitude: -74.1597 },
  { id: 's3',  name: 'St. Vincent de Paul',       area: 'Tompkinsville · 95 Victory Blvd', note: 'Hidden gem, low prices',               type: 'thrift',      borough: 'Staten Island',  latitude: 40.6353, longitude: -74.0987 },
];

const BOROUGHS: Borough[] = ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'];

const TYPE_COLORS: Record<StoreType, string> = {
  thrift:      '#2D6A4F',
  vintage:     '#B7860B',
  consignment: '#444444',
  luxury:      '#600000',
};

const TYPE_LABELS: Record<StoreType, string> = {
  thrift:      'Thrift',
  vintage:     'Vintage',
  consignment: 'Consignment',
  luxury:      'Luxury',
};

const NYC_REGION: Region = {
  latitude: 40.7128,
  longitude: -73.9860,
  latitudeDelta: 0.42,
  longitudeDelta: 0.36,
};

function openGoogleMaps(store: Store) {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${store.latitude},${store.longitude}&destination_place_name=${encodeURIComponent(store.name + ' ' + store.area)}`;
  Linking.openURL(url);
}

export default function MapScreen() {
  const [view, setView] = useState<'map' | 'list'>('map');

  return (
    <View style={styles.container}>
      <View style={styles.toggle}>
        <TouchableOpacity
          style={[styles.toggleBtn, view === 'map' && styles.toggleActive]}
          onPress={() => setView('map')}
        >
          <Ionicons name="map-outline" size={14} color={view === 'map' ? '#fff' : MUTED} />
          <Text style={[styles.toggleText, view === 'map' && styles.toggleTextActive]}>Map</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, view === 'list' && styles.toggleActive]}
          onPress={() => setView('list')}
        >
          <Ionicons name="list-outline" size={14} color={view === 'list' ? '#fff' : MUTED} />
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
                pinColor={TYPE_COLORS[store.type]}
              >
                <View style={[styles.pin, { backgroundColor: TYPE_COLORS[store.type] }]}>
                  <Ionicons name="shirt-outline" size={10} color="#fff" />
                </View>
                <Callout tooltip onPress={() => openGoogleMaps(store)}>
                  <View style={styles.callout}>
                    <Text style={styles.calloutName}>{store.name}</Text>
                    <Text style={styles.calloutArea}>{store.area}</Text>
                    <Text style={styles.calloutNote}>{store.note}</Text>
                    <View style={styles.calloutBottom}>
                      <View style={[styles.calloutBadge, { backgroundColor: TYPE_COLORS[store.type] }]}>
                        <Text style={styles.calloutBadgeText}>{TYPE_LABELS[store.type]}</Text>
                      </View>
                      <View style={styles.directionsBtn}>
                        <Ionicons name="navigate-outline" size={11} color={ACCENT} />
                        <Text style={styles.directionsBtnText}>Directions</Text>
                      </View>
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

          <View style={styles.countBadge}>
            <Text style={styles.countText}>{STORES.length} stores</Text>
          </View>
        </View>
      ) : (
        <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
          <Text style={styles.listTitle}>NYC Thrift & Vintage</Text>
          <Text style={styles.listSub}>Tap any store to get directions</Text>
          {BOROUGHS.map((borough) => {
            const group = STORES.filter((s) => s.borough === borough);
            if (group.length === 0) return null;
            return (
              <View key={borough} style={styles.group}>
                <View style={styles.groupHeader}>
                  <Text style={styles.groupLabel}>{borough}</Text>
                  <Text style={styles.groupCount}>{group.length} stores</Text>
                </View>
                {group.map((store) => (
                  <TouchableOpacity
                    key={store.id}
                    style={styles.storeCard}
                    onPress={() => openGoogleMaps(store)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.storeCardLeft}>
                      <Text style={styles.storeName}>{store.name}</Text>
                      <Text style={styles.storeArea}>{store.area}</Text>
                      <Text style={styles.storeNote}>{store.note}</Text>
                    </View>
                    <View style={styles.storeCardRight}>
                      <View style={[styles.typeDot, { backgroundColor: TYPE_COLORS[store.type] }]} />
                      <Ionicons name="navigate-outline" size={14} color={ACCENT} style={{ marginTop: 6 }} />
                    </View>
                  </TouchableOpacity>
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
  container: { flex: 1, backgroundColor: BG },
  toggle: { flexDirection: 'row', margin: 12, backgroundColor: CARD, borderRadius: 8, padding: 3, alignSelf: 'center' },
  toggleBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 7, paddingHorizontal: 20, borderRadius: 6, gap: 5 },
  toggleActive: { backgroundColor: ACCENT },
  toggleText: { fontFamily: SANS_SEMI, fontSize: 12, color: MUTED, letterSpacing: 1 },
  toggleTextActive: { color: '#fff' },

  mapContainer: { flex: 1 },
  map: { flex: 1 },
  pin: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.3, shadowRadius: 2 },

  callout: { backgroundColor: '#fff', borderRadius: 10, padding: 12, width: 220, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 6 },
  calloutName: { fontFamily: SANS_BOLD, fontSize: 13, color: TEXT, marginBottom: 2 },
  calloutArea: { fontFamily: SANS, fontSize: 11, color: MUTED, marginBottom: 4 },
  calloutNote: { fontFamily: SANS, fontSize: 11, color: TEXT, opacity: 0.6, marginBottom: 10, fontStyle: 'italic' },
  calloutBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  calloutBadge: { alignSelf: 'flex-start', paddingVertical: 3, paddingHorizontal: 8, borderRadius: 3 },
  calloutBadgeText: { fontFamily: SANS_SEMI, color: '#fff', fontSize: 9, letterSpacing: 1 },
  directionsBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  directionsBtnText: { fontFamily: SANS_SEMI, fontSize: 11, color: ACCENT },

  legend: { position: 'absolute', bottom: 24, left: 12, backgroundColor: 'rgba(255,255,255,0.96)', borderRadius: 8, padding: 10, gap: 5 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  legendDot: { width: 9, height: 9, borderRadius: 5 },
  legendText: { fontFamily: SANS_SEMI, fontSize: 11, color: TEXT },

  countBadge: { position: 'absolute', bottom: 24, right: 12, backgroundColor: 'rgba(255,255,255,0.96)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  countText: { fontFamily: SANS_SEMI, fontSize: 11, color: MUTED },

  list: { flex: 1 },
  listContent: { padding: 20, paddingBottom: 48 },
  listTitle: { fontFamily: SERIF, fontSize: 26, color: TEXT, letterSpacing: 3, marginBottom: 4 },
  listSub: { fontFamily: SANS, fontSize: 12, color: MUTED, marginBottom: 24 },

  group: { marginBottom: 28 },
  groupHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, paddingBottom: 8, borderBottomWidth: 2, borderBottomColor: ACCENT },
  groupLabel: { fontFamily: SANS_BOLD, fontSize: 13, color: TEXT, letterSpacing: 1 },
  groupCount: { fontFamily: SANS, fontSize: 11, color: MUTED },

  storeCard: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: BORDER },
  storeCardLeft: { flex: 1, paddingRight: 12 },
  storeCardRight: { alignItems: 'center', paddingTop: 2 },
  storeName: { fontFamily: SANS_SEMI, fontSize: 14, color: TEXT, marginBottom: 2 },
  storeArea: { fontFamily: SANS, fontSize: 12, color: MUTED, marginBottom: 2 },
  storeNote: { fontFamily: SANS, fontSize: 11, color: TEXT, opacity: 0.45, fontStyle: 'italic' },
  typeDot: { width: 9, height: 9, borderRadius: 5 },
});
