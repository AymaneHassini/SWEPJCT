//MainContainer.js conatins the bottom tab navigation once the user logs in
import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Screens
import HomeScreen from './screen/HomeScreen';
import NotificationScreen from './screen/NotificationScreen';
import ProfileScreen from './screen/ProfileScreen';
import ListScreen from './screen/ListScreen';

// Screen names
const homeName = "Home";
const Notifications = "Notifications";
const Rides = "Rides";
const Profile = "Profile";

const Tab = createBottomTabNavigator();

function MainContainer({ route }) {
  const { userData } = route.params || {};
  
  return (
    <Tab.Navigator
      initialRouteName={homeName}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === homeName) {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === Notifications) {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === Rides) {
            iconName = focused ? 'car' : 'car-outline';
          } else if (route.name === Profile) {
            iconName = focused ? 'person' : 'person-outline';
          }
          // Return the icon component
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'grey',
        tabBarLabelStyle: { fontSize: 10 },
        tabBarStyle: { height: 70 }, // Adjusted height
      })}
    >
      <Tab.Screen name={homeName} component={HomeScreen} initialParams={{ userData: userData }} />
      <Tab.Screen name={Rides} component={ListScreen} initialParams={{ userData: userData }} options={{headerShown: false}} />
      <Tab.Screen name={Notifications} component={NotificationScreen} initialParams={{ userData: userData }} />
      <Tab.Screen name={Profile} component={ProfileScreen} initialParams={{ userData: userData }} />
    </Tab.Navigator>
  );
}

export default MainContainer;
