// src/screens/LogsScreen.js
import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const LogsScreen = ({ navigation }) => {
  // Dummy data - replace with your actual data source
  const logs = [
    { id: '1', title: 'First Day at Sea', date: '2025-04-15', preview: 'Smooth sailing today...' },
    { id: '2', title: 'Storm Approaching', date: '2025-04-14', preview: 'Weather forecast indicates...' },
    { id: '3', title: 'Engine Maintenance', date: '2025-04-13', preview: 'Performed routine check on...' },
  ];

  const renderLogItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.logItem}
      onPress={() => navigation.navigate('LogDetail', { logId: item.id })}
    >
      <Text style={styles.logTitle}>{item.title}</Text>
      <Text style={styles.logDate}>{item.date}</Text>
      <Text style={styles.logPreview}>{item.preview}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={logs}
        renderItem={renderLogItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('NewLog')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  listContent: {
    padding: 16,
  },
  logItem: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#075985',
    marginBottom: 8,
  },
  logDate: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  logPreview: {
    fontSize: 16,
    color: '#334155',
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#075985',
    borderRadius: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabText: {
    fontSize: 24,
    color: 'white',
  },
});

export default LogsScreen;