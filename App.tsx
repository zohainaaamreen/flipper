import { enableScreens } from 'react-native-screens';
enableScreens(false);
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, StyleSheet } from 'react-native';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import {
  CormorantGaramond_400Regular,
  CormorantGaramond_700Bold,
} from '@expo-google-fonts/cormorant-garamond';
import TrendsScreen from './screens/TrendsScreen';
import DashboardScreen from './screens/DashboardScreen';
import CameraScreen from './screens/CameraScreen';
import MapScreen from './screens/MapScreen';
import AssistantScreen from './screens/AssistantScreen';
import ResultsScreen from './screens/ResultsScreen';
import SettingsScreen from './screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const ACCENT = '#600000';
const TEXT = '#000000';
const BG = '#FFFFFF';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];
const icon = (name: IoniconName) =>
  ({ color }: { color: string }) => <Ionicons name={name} size={22} color={color} />;

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    CormorantGaramond_400Regular,
    CormorantGaramond_700Bold,
  });

  if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: BG }} />;

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ navigation, route }) => ({
          tabBarActiveTintColor: ACCENT,
          tabBarInactiveTintColor: '#bbb',
          tabBarStyle: styles.tabBar,
          headerStyle: styles.header,
          headerTintColor: TEXT,
          headerShadowVisible: false,
          headerTitleStyle: styles.headerTitle,
          headerRight: route.name === 'Settings' ? undefined : () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Settings' as never)}
              style={styles.settingsBtn}
            >
              <Ionicons name="settings-outline" size={20} color={TEXT} />
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
                <Ionicons name="add" size={30} color={BG} />
              </View>
            ),
          }}
        />

        <Tab.Screen name="Map" component={MapScreen} options={{ tabBarIcon: icon('map-outline') }} />
        <Tab.Screen name="Assistant" component={AssistantScreen} options={{ tabBarIcon: icon('chatbubble-outline') }} />

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
    backgroundColor: BG,
    borderTopColor: '#E8E8E8',
    height: 60,
    paddingBottom: 8,
  },
  header: { backgroundColor: BG },
  headerTitle: { fontFamily: 'Poppins_600SemiBold', fontSize: 14, letterSpacing: 1 },
  settingsBtn: { marginRight: 16 },
  cameraButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
});
