// src/screens/SettingsScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import strings from '../utils/strings';
import { useGeolocation } from '../context/GeolocationContext'; // <-- add this

const SettingsScreen = () => {
  const [notifications, setNotifications] = useState(true);
  const { darkMode, setDarkMode } = useTheme();
  const { geolocationEnabled, setGeolocationEnabled } = useGeolocation();

  const buildType = __DEV__ ? 'Debug' : 'Release';

  // Define themed colors
  const backgroundColor = darkMode ? '#1e293b' : '#f0f9ff';
  const textColor = darkMode ? '#f1f5f9' : '#334155';
  const sectionTitleColor = darkMode ? '#f1f5f9' : '#334155';
  const borderColor = darkMode ? '#334155' : '#e2e8f0';
  const buttonBg = darkMode ? '#0ea5e9' : '#075985';
  const buttonTextColor = '#fff';
  const buildTypeLabelColor = darkMode ? '#cbd5e1' : '#64748b';
  const buildTypeValueColor = darkMode ? '#f1f5f9' : '#334155';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.sectionTitle, { color: sectionTitleColor }]}>{strings.settings.appSettings}</Text>
      
      <View style={[styles.settingItem, { borderBottomColor: borderColor }]}>
        <Text style={[styles.settingLabel, { color: textColor }]}>{strings.settings.notifications}</Text>
        <Switch
          value={notifications}
          onValueChange={setNotifications}
          trackColor={{ false: "#cbd5e1", true: "#0284c7" }}
          thumbColor={notifications ? "#075985" : "#f4f4f5"}
        />
      </View>
      
      <View style={[styles.settingItem, { borderBottomColor: borderColor }]}>
        <Text style={[styles.settingLabel, { color: textColor }]}>{strings.settings.darkMode}</Text>
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
          trackColor={{ false: "#cbd5e1", true: "#0284c7" }}
          thumbColor={darkMode ? "#075985" : "#f4f4f5"}
        />
      </View>
      
      <View style={[styles.settingItem, { borderBottomColor: borderColor }]}>
        <Text style={[styles.settingLabel, { color: textColor }]}>{strings.settings.locationTracking}</Text>
        <Switch
          value={geolocationEnabled}
          onValueChange={setGeolocationEnabled}
          trackColor={{ false: "#cbd5e1", true: "#0284c7" }}
          thumbColor={geolocationEnabled ? "#075985" : "#f4f4f5"}
        />
      </View>
      
      <Text style={[styles.sectionTitle, { color: sectionTitleColor }]}>{strings.settings.account}</Text>
      
      <TouchableOpacity style={[styles.button, { backgroundColor: buttonBg }]}>
        <Text style={[styles.buttonText, { color: buttonTextColor }]}>{strings.settings.exportLogData}</Text>
      </TouchableOpacity>
      
      {/* <TouchableOpacity style={[styles.button, styles.dangerButton]}>
        <Text style={styles.buttonText}>{strings.settings.signOut}</Text>
      </TouchableOpacity> */}
      
      <View style={styles.buildTypeContainer}>
        <Text style={[styles.buildTypeLabel, { color: buildTypeLabelColor }]}>Build:</Text>
        <Text style={[styles.buildTypeValue, { color: buildTypeValueColor }]}>{buildType}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  settingLabel: {
    fontSize: 16,
  },
  button: {
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
    marginRight: 6,
  },
  buildTypeValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;