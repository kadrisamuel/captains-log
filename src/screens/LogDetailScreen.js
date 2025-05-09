// src/screens/LogDetailScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const LogDetailScreen = ({ route }) => {
  // In a real app, you'd fetch the log details based on the ID
  const { logId } = route.params;
  
  // Dummy data for demonstration
  const logData = {
    id: logId,
    title: 'First Day at Sea',
    date: '2025-04-15',
    weather: 'Sunny, light winds',
    location: 'N 34° 05\' W 118° 22\'',
    content: 'Today marks our first day of the journey. The crew is in good spirits and the weather has been exceptionally cooperative. We departed from the harbor at 0600 hours, with clear skies and a gentle breeze.\n\nThe ship is performing admirably after the recent maintenance. Engine readings are all within optimal parameters. We expect to reach our first checkpoint by tomorrow evening if conditions hold.\n\nFirst Officer Williams conducted a thorough safety drill, and I\'m pleased to report that all crew members responded efficiently. Response time has improved by 12% compared to our last voyage.\n\nWill make another entry tomorrow with our progress update.'
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{logData.title}</Text>
        <Text style={styles.date}>{logData.date}</Text>
      </View>
      
      <View style={styles.metadataContainer}>
        <View style={styles.metadataItem}>
          <Text style={styles.metadataLabel}>Weather</Text>
          <Text style={styles.metadataValue}>{logData.weather}</Text>
        </View>
        <View style={styles.metadataItem}>
          <Text style={styles.metadataLabel}>Location</Text>
          <Text style={styles.metadataValue}>{logData.location}</Text>
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.content}>{logData.content}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  headerContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#075985',
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    color: '#64748b',
  },
  metadataContainer: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metadataItem: {
    flex: 1,
  },
  metadataLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  metadataValue: {
    fontSize: 16,
    color: '#334155',
    fontWeight: '500',
  },
  contentContainer: {
    backgroundColor: 'white',
    padding: 20,
    minHeight: 400,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#334155',
  }
});

export default LogDetailScreen;