import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import ChatScreen from '../screens/ChatScreen';
import GraphScreen from '../screens/GraphScreen';
import HomeScreen from '../screens/HomeScreen';
import SwitchProfileScreen from '../screens/SwitchProfileScreen';
import FloatingTabBar from './FloatingTabBar';
import { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

/** Logout has no screen — FloatingTabBar intercepts the press and resets to Login. */
const Empty = () => null;

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <FloatingTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Graph" component={GraphScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Profile" component={SwitchProfileScreen} />
      <Tab.Screen name="Logout" component={Empty} />
    </Tab.Navigator>
  );
}
