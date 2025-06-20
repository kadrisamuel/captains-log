import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_MODE_KEY = '@theme_mode';
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemScheme = Appearance.getColorScheme();
  const [themeMode, setThemeModeState] = useState('system'); // 'system', 'light', or 'dark'
  const [darkMode, setDarkMode] = useState(systemScheme === 'dark');

  // Load themeMode from storage on mount
  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(THEME_MODE_KEY);
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        setThemeModeState(stored);
      }
    })();
  }, []);

  // Save themeMode to storage whenever it changes
  useEffect(() => {
    AsyncStorage.setItem(THEME_MODE_KEY, themeMode);
  }, [themeMode]);

  // Listen for system changes if user hasn't overridden
  useEffect(() => {
    if (themeMode === 'system') {
      setDarkMode(Appearance.getColorScheme() === 'dark');
      const listener = Appearance.addChangeListener(({ colorScheme }) => {
        setDarkMode(colorScheme === 'dark');
      });
      return () => listener.remove();
    }
  }, [themeMode]);

  // If user selects light/dark, override system
  useEffect(() => {
    if (themeMode === 'light') setDarkMode(false);
    if (themeMode === 'dark') setDarkMode(true);
  }, [themeMode]);

  // Wrap setThemeMode to update state
  const setThemeMode = (mode) => {
    setThemeModeState(mode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, themeMode, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);