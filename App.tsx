import { enableScreens } from 'react-native-screens';
enableScreens(false);
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import CameraScreen from './screens/CameraScreen';
import ResultsScreen from './screens/ResultsScreen';
import HistoryScreen from './screens/HistoryScreen';
import TrendsScreen from './screens/TrendsScreen';
import SettingsScreen from './screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const BLACK = '#1A1A1A';
const BEIGE = '#F5F0E8';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const tabIcon = (name: IoniconName) =>
  ({ color }: { color: string }) => <Ionicons name={name} size={24} color={color} />;

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: BLACK,
          tabBarInactiveTintColor: '#999',
          tabBarStyle: { backgroundColor: BEIGE, borderTopColor: '#E0D9CE' },
          headerStyle: { backgroundColor: BEIGE },
          headerTintColor: BLACK,
        }}
      >
        <Tab.Screen name="Camera" component={CameraScreen} options={{ tabBarIcon: tabIcon('camera') }} />
        <Tab.Screen name="Results" component={ResultsScreen} options={{ tabBarIcon: tabIcon('bar-chart') }} />
        <Tab.Screen name="History" component={HistoryScreen} options={{ tabBarIcon: tabIcon('time') }} />
        <Tab.Screen name="Trends" component={TrendsScreen} options={{ tabBarIcon: tabIcon('trending-up') }} />
        <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarIcon: tabIcon('settings') }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
