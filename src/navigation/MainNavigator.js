// src/navigation/MainNavigator.js
import React from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from '../screens/HomeScreen'; 
import LogsScreen from '../screens/LogsScreen';
import LogDetailScreen from '../screens/LogDetailScreen';
import NewLogScreen from '../screens/NewLogScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Simple icon component (replace with your icons later)
const Icon = ({ name }) => (
  <View style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
    <Text>{name[0].toUpperCase()}</Text>
  </View>
);

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom tab navigator
const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#075985',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
        },
        headerStyle: {
          backgroundColor: '#075985',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={Home} 
        options={{
          tabBarIcon: ({ color }) => <Icon name="Home" color={color} />,
          headerTitle: "Captain's Log",
        }}
      />
      <Tab.Screen 
        name="Logs" 
        component={LogsScreen}
        options={{
          tabBarIcon: ({ color }) => <Icon name="Logs" color={color} />,
          headerTitle: "All Logs",
        }}
      />
    </Tab.Navigator>
  );
};

// Home stack with tabs
const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#075985',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Back" 
        component={BottomTabNavigator} 
        options={{ headerShown: false }} 
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

// Main navigator
const MainNavigator = () => {
  return <HomeStack />;
};

export default MainNavigator;