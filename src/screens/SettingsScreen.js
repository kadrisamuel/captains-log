// src/screens/SettingsScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import strings from '../utils/strings';
import { useGeolocation } from '../context/GeolocationContext'; // <-- add this

const SettingsScreen = () => {
  const [notifications, setNotifications] = useState(true);
  const { darkMode, setDarkMode } = useTheme(); // use context
  const { geolocationEnabled, setGeolocationEnabled } = useGeolocation(); // <-- use context

  const buildType = __DEV__ ? 'Debug' : 'Release';

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{strings.settings.appSettings}</Text>
      
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>{strings.settings.notifications}</Text>
        <Switch
          value={notifications}
          onValueChange={setNotifications}
          trackColor={{ false: "#cbd5e1", true: "#0284c7" }}
          thumbColor={notifications ? "#075985" : "#f4f4f5"}
        />
      </View>
      
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>{strings.settings.darkMode}</Text>
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
          trackColor={{ false: "#cbd5e1", true: "#0284c7" }}
          thumbColor={darkMode ? "#075985" : "#f4f4f5"}
        />
      </View>
      
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>{strings.settings.locationTracking}</Text>
        <Switch
          value={geolocationEnabled}
          onValueChange={setGeolocationEnabled}
          trackColor={{ false: "#cbd5e1", true: "#0284c7" }}
          thumbColor={geolocationEnabled ? "#075985" : "#f4f4f5"}
        />
      </View>
      
      <Text style={styles.sectionTitle}>{strings.settings.account}</Text>
      
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>{strings.settings.exportLogData}</Text>
      </TouchableOpacity>
      
{/*       <TouchableOpacity style={[styles.button, styles.dangerButton]}>
        <Text style={styles.buttonText}>{strings.settings.signOut}</Text>
      </TouchableOpacity>
 */}
      <View style={styles.buildTypeContainer}>
        <Text style={styles.buildTypeLabel}>Build:</Text>
        <Text style={styles.buildTypeValue}>{buildType}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f9ff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 15,
    color: '#334155',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  settingLabel: {
    fontSize: 16,
    color: '#334155',
  },
  button: {
    backgroundColor: '#075985',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  dangerButton: {
    backgroundColor: '#ef4444',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  buildTypeContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buildTypeLabel: {
    fontSize: 14,
    color: '#64748b',
    marginRight: 6,
  },
  buildTypeValue: {
    fontSize: 14,
    color: '#334155',
    fontWeight: 'bold',
  },
});

export default SettingsScreen;