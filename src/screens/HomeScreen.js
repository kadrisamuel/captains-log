// src/screens/HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import strings from '../utils/strings';


const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{strings.home.welcome}</Text>
      <Text style={styles.subtitle}>{strings.home.subtitle}</Text>

      <TouchableOpacity 
        style={[styles.button, styles.secondaryButton]}
        onPress={() => navigation.navigate('Logs')}
      >
        <Text style={styles.buttonText}>{strings.home.viewAllLogs}</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('NewLog')}
      >
        <Text style={styles.buttonText}>{strings.home.newManualLog}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('NewLog')}
      >
        <Text style={styles.buttonText}>{strings.home.recordVoiceLog}</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f9ff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#075985',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 40,
    color: '#64748b',
  },
  button: {
    backgroundColor: '#075985',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#0284c7',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;