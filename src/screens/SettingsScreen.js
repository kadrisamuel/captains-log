// src/screens/SettingsScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Share, Alert } from 'react-native';
import RNFS from 'react-native-fs';
import { useTheme } from '../context/ThemeContext';
import strings from '../utils/strings';
import { useGeolocation } from '../context/GeolocationContext';
import { LogStorage } from '../utils/LogStorage'; 
import DeviceInfo from 'react-native-device-info';

const SettingsScreen = () => {
  const [notifications, setNotifications] = useState(true);
  const { darkMode, themeMode, setThemeMode } = useTheme();
  const { geolocationEnabled, setGeolocationEnabled } = useGeolocation();

  const buildType = __DEV__ ? 'Debug' : 'Release';
  const buildNumber = DeviceInfo.getVersion(); // or getBuildNumber()

  // Define themed colors
  const backgroundColor = darkMode ? '#1e293b' : '#f0f9ff';
  const textColor = darkMode ? '#f1f5f9' : '#334155';
  const sectionTitleColor = darkMode ? '#f1f5f9' : '#334155';
  const borderColor = darkMode ? '#334155' : '#e2e8f0';
  const buttonBg = darkMode ? '#0ea5e9' : '#075985';
  const buttonTextColor = '#fff';
  const buildTypeLabelColor = darkMode ? '#cbd5e1' : '#64748b';
  const buildTypeValueColor = darkMode ? '#f1f5f9' : '#334155';

  // Export logs as JSON and share
  const exportLogs = async () => {
    try {
      const logs = await LogStorage.getAllLogs(); // Adjust this to your actual method
      const json = JSON.stringify(logs, null, 2);
      const path = `${RNFS.DocumentDirectoryPath}/captainslog-export.json`;
      await RNFS.writeFile(path, json, 'utf8');
      await Share.share({
        url: 'file://' + path,
        //message: 'Captain\'s Log export',
        //title: 'Exported Logs',
      });
    } catch (e) {
      Alert.alert('Export failed', e.message || 'Could not export logs.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.sectionTitle, { color: sectionTitleColor }]}>{strings.settings.appSettings}</Text>
      
      <View style={[styles.settingItem, { borderBottomColor: borderColor }]}>
        <Text style={[styles.settingLabel, { color: textColor }]}>Theme</Text>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={[
              styles.themeButton,
              themeMode === 'system' && { borderColor: buttonBg, borderWidth: 2 }
            ]}
            onPress={() => setThemeMode('system')}
          >
            <Text style={{ color: textColor }}>System</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.themeButton,
              themeMode === 'light' && { borderColor: buttonBg, borderWidth: 2 }
            ]}
            onPress={() => setThemeMode('light')}
          >
            <Text style={{ color: textColor }}>Light</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.themeButton,
              themeMode === 'dark' && { borderColor: buttonBg, borderWidth: 2 }
            ]}
            onPress={() => setThemeMode('dark')}
          >
            <Text style={{ color: textColor }}>Dark</Text>
          </TouchableOpacity>
        </View>
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
      
      <TouchableOpacity
        style={[styles.button, { backgroundColor: buttonBg }]}
        onPress={exportLogs}
      >
        <Text style={[styles.buttonText, { color: buttonTextColor }]}>
          {strings.settings.exportLogData || 'Export Log Data'}
        </Text>
      </TouchableOpacity>
      
      <View style={styles.buildTypeContainer}>
        <Text style={[styles.buildTypeLabel, { color: buildTypeLabelColor }]}>Build:</Text>
        <Text style={[styles.buildTypeValue, { color: buildTypeValueColor }]}>
          {buildType} ({buildNumber})
        </Text>
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
  themeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginHorizontal: 4,
    borderColor: 'transparent',
    borderWidth: 2,
  },
});

export default SettingsScreen;