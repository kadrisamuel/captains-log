// src/App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import MainNavigator from './navigation/MainNavigator';
import { ThemeProvider } from './context/ThemeContext';
import { GeolocationProvider } from './context/GeolocationContext';

const linking = {
  prefixes: ['captainslog://'],
  config: {
    screens: {
      NewLog: {
        path: 'newlog',
        parse: {
          record: (record) => record === 'true',
        },
      },
      // ...other screens
    },
  },
};

const App = () => {
  return (
    <ThemeProvider>
      <GeolocationProvider>
        <NavigationContainer linking={linking}>
          <StatusBar barStyle="dark-content" />
          <MainNavigator />
        </NavigationContainer>
      </GeolocationProvider>
    </ThemeProvider>
  );
};

export default App;