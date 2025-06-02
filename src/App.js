// src/App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import MainNavigator from './navigation/MainNavigator';

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
    <NavigationContainer linking={linking}>
      <StatusBar barStyle="dark-content" />
      <MainNavigator />
    </NavigationContainer>
  );
};

export default App;