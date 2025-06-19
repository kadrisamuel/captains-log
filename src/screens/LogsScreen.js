// src/screens/LogsScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LogStorage } from '../utils/LogStorage';
import strings from '../utils/strings';
import { Swipeable } from 'react-native-gesture-handler';
import { useTheme } from '../context/ThemeContext'; // <-- add this

const LogsListScreen = ({ navigation }) => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { darkMode } = useTheme(); // <-- use darkMode from ThemeContext

  // Themed colors
  const backgroundColor = darkMode ? '#1e293b' : '#f0f9ff';
  const textColor = darkMode ? '#f1f5f9' : '#334155';
  const inputBg = darkMode ? '#334155' : 'white';
  const inputBorder = darkMode ? '#64748b' : '#cbd5e1';
  const logItemBg = darkMode ? '#334155' : 'white';
  const logItemBorder = darkMode ? '#475569' : '#e2e8f0';
  const logTitleColor = darkMode ? '#f1f5f9' : '#1e293b';
  const logLocationColor = darkMode ? '#cbd5e1' : '#64748b';
  const logPreviewColor = darkMode ? '#e2e8f0' : '#475569';
  const logDateColor = darkMode ? '#94a3b8' : '#94a3b8';
  const emptyStateTextColor = darkMode ? '#cbd5e1' : '#64748b';
  const emptyStateSubtextColor = darkMode ? '#94a3b8' : '#94a3b8';
  const fabBg = darkMode ? '#0ea5e9' : '#075985';

  // Load logs when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadLogs();
    }, [])
  );

  const loadLogs = async () => {
    try {
      setIsLoading(true);
      const allLogs = await LogStorage.getAllLogs();
      setLogs(allLogs);
      setFilteredLogs(allLogs);
    } catch (error) {
      console.error('Error loading logs:', error);
      Alert.alert(strings.logs.error, strings.logs.failedToLoadLogs);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadLogs();
    setIsRefreshing(false);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredLogs(logs);
    } else {
      const filtered = logs.filter(log =>
        log.title.toLowerCase().includes(query.toLowerCase()) ||
        log.content.toLowerCase().includes(query.toLowerCase()) ||
        log.location.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredLogs(filtered);
    }
  };

  const handleDeleteLog = (logId, logTitle) => {
    Alert.alert(
      strings.logs.deleteLogTitle,
      strings.logs.deleteLogMessage(logTitle),
      [
        { text: strings.logs.cancel, style: 'cancel' },
        {
          text: strings.logs.delete,
          style: 'destructive',
          onPress: async () => {
            try {
              await LogStorage.deleteLog(logId);
              await loadLogs();
            } catch (error) {
              Alert.alert(strings.logs.error, strings.logs.failedToDeleteLog);
            }
          }
        }
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const datePart = date.toLocaleDateString();
    const timePart = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return strings.logs.logDateAt(datePart, timePart);
  };

  const renderLogItem = ({ item }) => (
    <Swipeable renderRightActions={() => renderRightActions(item)}>
      <View style={[styles.logItem, { backgroundColor: logItemBg, borderColor: logItemBorder }]}>
        <TouchableOpacity
          style={styles.logContent}
          onPress={() => navigation.navigate('LogDetail', { logId: item.id })}
        >
          <Text style={[styles.logTitle, { color: logTitleColor }]}>{item.title}</Text>
          {item.location ? (
            <Text style={[styles.logLocation, { color: logLocationColor }]}>📍 {item.location}</Text>
          ) : null}
          <Text style={[styles.logPreview, { color: logPreviewColor }]} numberOfLines={2}>
            {item.content}
          </Text>
          <Text style={[styles.logDate, { color: logDateColor }]}>
            {formatDate(item.createdAt)}
          </Text>
        </TouchableOpacity>
      </View>
    </Swipeable>
  );

  const renderRightActions = (item) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => handleDeleteLog(item.id, item.title)}
    >
      <Text style={styles.deleteButtonText}>🗑️</Text>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyStateText, { color: emptyStateTextColor }]}>{strings.logs.noLogs}</Text>
      <Text style={[styles.emptyStateSubtext, { color: emptyStateSubtextColor }]}>
        {searchQuery ? strings.logs.tryDifferentSearch : strings.logs.createFirstLog}
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor }]}>
        <ActivityIndicator size="large" color={fabBg} />
        <Text style={[styles.loadingText, { color: logLocationColor }]}>{strings.logs.loading}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <TextInput
          style={[
            styles.searchInput,
            { backgroundColor: inputBg, borderColor: inputBorder, color: textColor }
          ]}
          placeholder={strings.logs.searchPlaceholder}
          placeholderTextColor={darkMode ? '#94a3b8' : '#94a3b8'}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <FlatList
        data={filteredLogs}
        keyExtractor={(item) => item.id}
        renderItem={renderLogItem}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[fabBg]}
          />
        }
        contentContainerStyle={filteredLogs.length === 0 ? styles.emptyContainer : null}
      />
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: fabBg }]}
        onPress={() => navigation.navigate('NewLog')}
      >
        <Text style={styles.fabText}>{strings.logs.fabAdd}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 8,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    placeholderTextColor: '#94a3b8',
  },
  addButton: {
    backgroundColor: '#075985',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  logContent: {
    flex: 1,
    padding: 16,
  },
  logTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  logLocation: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  logPreview: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 8,
  },
  logDate: {
    fontSize: 12,
    color: '#94a3b8',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
    height: '100%',
  },
  deleteButtonText: {
    fontSize: 20,
  },
  emptyContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#64748b',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#075985',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
  },
  fab: {
    position: 'absolute',
    width: 75,
    height: 75,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#075985',
    borderRadius: '50%',
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

export default LogsListScreen;