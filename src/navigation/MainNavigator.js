// src/navigation/MainNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screens/HomeScreen'; 
import App from '../App';
import BottomTabNavigator from './BottomTabNavigator';
import LogsScreen from '../screens/LogsScreen';
import LogDetailScreen from '../screens/LogDetailScreen';
import NewLogScreen from '../screens/NewLogScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createStackNavigator();

const MainNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#075985', // A nice navy blue
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="Home" 
        component={Home} 
        options={{ title: 'Welcome' }}
      />
      <Stack.Screen 
        name="BottomNavigator" 
        component={BottomTabNavigator} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Logs" 
        component={LogsScreen} 
        options={{ title: "Log Entries" }}
      />
      <Stack.Screen 
        name="App" 
        component={App} 
        options={{ title: "Captain's Log" }}
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