// src/navigation/MainNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext'; // <-- import useTheme

// Import screens
// import HomeScreen from '../screens/HomeScreen';
import LogsScreen from '../screens/LogsScreen';
import LogDetailScreen from '../screens/LogDetailScreen';
import NewLogScreen from '../screens/NewLogScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Simple icon component (replace with your icons later)
const Icon = ({ name, color }) => (
  <View style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ color }}>{name[0].toUpperCase()}</Text>
  </View>
);

// Create navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom tab navigator
const BottomTabNavigator = () => {
  const { darkMode } = useTheme();

  const tabBarBg = darkMode ? '#1e293b' : '#f0f9ff';
  const tabBarActiveTintColor = darkMode ? '#38bdf8' : '#075985';
  const tabBarInactiveTintColor = darkMode ? '#64748b' : 'gray';
  const headerBg = darkMode ? '#334155' : '#075985';
  const headerTintColor = '#fff';

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor,
        tabBarInactiveTintColor,
        tabBarStyle: {
          backgroundColor: tabBarBg,
          paddingBottom: 5,
          paddingTop: 5,
        },
        headerStyle: {
          backgroundColor: headerBg,
        },
        headerTintColor,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
{/*       <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color }) => <Icon name="Home" color={color} />,
          headerTitle: "Captain's Log",
        }}
      /> */}
      <Tab.Screen 
        name="Logs" 
        component={LogsScreen}
        options={{
          tabBarIcon: ({ color }) => <Icon name="Logs" color={color} />,
          headerTitle: "All Logs",
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color }) => <Icon name="Settings" color={color} />,
          headerTitle: "Settings",
        }}
      />
    </Tab.Navigator>
  );
};

// Main navigator
const MainNavigator = () => {
  const { darkMode } = useTheme();

  const headerBg = darkMode ? '#334155' : '#075985';
  const headerTintColor = '#fff';

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: headerBg,
        },
        headerTintColor,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="TabHome" 
        component={BottomTabNavigator} 
        options={{ headerShown: false, title: "Back" }} 
      />
      <Stack.Screen 
        name="LogDetail" 
        component={LogDetailScreen} 
        options={{ title: "Log Entry" }} 
      />
      <Stack.Screen 
        name="NewLog" 
        component={NewLogScreen} 
        options={{ title: "New Log Entry" }} 
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ title: "Settings" }} 
      /> 
    </Stack.Navigator>
  );
};

export default MainNavigator;