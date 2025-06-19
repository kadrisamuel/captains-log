import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemScheme = Appearance.getColorScheme(); // 'light' or 'dark'
  const [themeMode, setThemeMode] = useState('system'); // 'system', 'light', or 'dark'
  const [darkMode, setDarkMode] = useState(systemScheme === 'dark');

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

  return (
    <ThemeContext.Provider value={{ darkMode, themeMode, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);