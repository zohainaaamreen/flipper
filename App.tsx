import { enableScreens } from 'react-native-screens';
enableScreens(false);
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import TrendsScreen from './screens/TrendsScreen';
import DashboardScreen from './screens/DashboardScreen';
import CameraScreen from './screens/CameraScreen';
import MapScreen from './screens/MapScreen';
import AssistantScreen from './screens/AssistantScreen';
import ResultsScreen from './screens/ResultsScreen';
import SettingsScreen from './screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const BLACK = '#1A1A1A';
const BEIGE = '#F5F0E8';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];
const icon = (name: IoniconName) =>
  ({ color }: { color: string }) => <Ionicons name={name} size={22} color={color} />;

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ navigation, route }) => ({
          tabBarActiveTintColor: BLACK,
          tabBarInactiveTintColor: '#bbb',
          tabBarStyle: styles.tabBar,
          headerStyle: styles.header,
          headerTintColor: BLACK,
          headerShadowVisible: false,
          headerRight: route.name === 'Settings' ? undefined : () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Settings' as never)}
              style={styles.settingsBtn}
            >
              <Ionicons name="settings-outline" size={20} color={BLACK} />
            </TouchableOpacity>
          ),
        })}
      >
        <Tab.Screen name="Trends" component={TrendsScreen} options={{ tabBarIcon: icon('trending-up') }} />
        <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ tabBarIcon: icon('grid-outline') }} />

        <Tab.Screen
          name="Camera"
          component={CameraScreen}
          options={{
            tabBarLabel: '',
            headerTitle: 'Scan',
            tabBarIcon: () => (
              <View style={styles.cameraButton}>
                <Ionicons name="add" size={30} color={BEIGE} />
              </View>
            ),
          }}
        />

        <Tab.Screen name="Map" component={MapScreen} options={{ tabBarIcon: icon('map-outline') }} />
        <Tab.Screen name="Assistant" component={AssistantScreen} options={{ tabBarIcon: icon('chatbubble-outline') }} />

        {/* Hidden screens — fully removed from tab bar layout */}
        <Tab.Screen
          name="Results"
          component={ResultsScreen}
          options={{ tabBarButton: () => null, tabBarItemStyle: { display: 'none' }, headerTitle: 'Scan Results' }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ tabBarButton: () => null, tabBarItemStyle: { display: 'none' }, headerTitle: 'Settings' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: BEIGE,
    borderTopColor: '#E0D9CE',
    height: 60,
    paddingBottom: 8,
  },
  header: { backgroundColor: BEIGE },
  settingsBtn: { marginRight: 16 },
  cameraButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: BLACK,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});
