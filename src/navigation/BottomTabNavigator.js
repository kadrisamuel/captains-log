// src/navigation/BottomTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import LogsScreen from '../screens/LogsScreen';
//import ProfileScreen from './screens/ProfileScreen';

// You can replace these with actual icon imports later
const Icon = ({ name }) => (
  <View style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
    <Text>{name[0].toUpperCase()}</Text>
  </View>
);

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#075985',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
        }
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color }) => <Icon name="Home" color={color} />,
          headerTitle: "Captain's Log",
          headerStyle: {
            backgroundColor: '#075985',
          },
          headerTintColor: '#fff',
        }}
      />
      <Tab.Screen 
        name="Logs" 
        component={LogsScreen}
        options={{
          tabBarIcon: ({ color }) => <Icon name="Logs" color={color} />,
          headerTitle: "All Logs",
          headerStyle: {
            backgroundColor: '#075985',
          },
          headerTintColor: '#fff',
        }}
      />

    </Tab.Navigator>
  );
};

export default BottomTabNavigator;