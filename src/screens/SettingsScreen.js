// src/screens/SettingsScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import strings from '../constants/strings';


const SettingsScreen = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [locationTracking, setLocationTracking] = useState(true);
  
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
          value={locationTracking}
          onValueChange={setLocationTracking}
          trackColor={{ false: "#cbd5e1", true: "#0284c7" }}
          thumbColor={locationTracking ? "#075985" : "#f4f4f5"}
        />
      </View>
      
      <Text style={styles.sectionTitle}>{strings.settings.account}</Text>
      
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>{strings.settings.exportLogData}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.button, styles.dangerButton]}>
        <Text style={styles.buttonText}>{strings.settings.signOut}</Text>
      </TouchableOpacity>
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
  }
});

export default SettingsScreen;