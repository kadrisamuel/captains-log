// src/screens/LogDetailScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Share,
  TextInput
} from 'react-native';
import { LogStorage } from '../services/LogStorage';

const LogDetailScreen = ({ route, navigation }) => {
  const { logId } = route.params;
  const [log, setLog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    loadLog();
  }, [logId]);

  const loadLog = async () => {
    try {
      setIsLoading(true);
      const logData = await LogStorage.getLogById(logId);
      if (logData) {
        setLog(logData);
      } else {
        Alert.alert('Error', 'Log not found', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      console.error('Error loading log:', error);
      Alert.alert('Error', 'Failed to load log');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Log',
      `Are you sure you want to delete "${log.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await LogStorage.deleteLog(logId);
              Alert.alert('Success', 'Log deleted successfully', [
                { text: 'OK', onPress: () => navigation.goBack() }
              ]);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete log');
            }
          }
        }
      ]
    );
  };
  // TODO: Implement share functionality with some reasonable data structure
  const handleShare = async () => {
    try {
      const shareContent = `${log.title}\n\n${log.location ? `Location: ${log.location}\n\n` : ''}${log.content}\n\nCreated: ${formatDate(log.createdAt)}`;
      
      await Share.share({
        message: shareContent,
        title: log.title,
      });
    } catch (error) {
      console.error('Error sharing log:', error);
    }
  };

  const handleEdit = () => {
    setEditTitle(log.title || '');
    setEditLocation(log.location || '');
    setEditContent(log.content || '');
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    try {
      const updatedLog = {
        ...log,
        title: editTitle,
        location: editLocation,
        content: editContent,
        updatedAt: new Date().toISOString(),
      };
      await LogStorage.updateLog(log.id, updatedLog);
      setLog(updatedLog);
      setIsEditing(false);
      navigation.goBack();
      Alert.alert('Success', 'Log updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update log');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#075985" />
        <Text style={styles.loadingText}>Loading log...</Text>
      </View>
    );
  }

  if (!log) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Log not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          {isEditing ? (
            <>
              <TextInput
                style={[styles.title, {backgroundColor: '#f1f5f9'}]}
                value={editTitle}
                onChangeText={setEditTitle}
                placeholder="Title"
              />
              <View style={styles.locationContainer}>
                <Text style={styles.locationIcon}>📍</Text>
                <TextInput
                  style={[styles.location, {backgroundColor: '#f1f5f9'}]}
                  value={editLocation}
                  onChangeText={setEditLocation}
                  placeholder="Location"
                />
              </View>
            </>
          ) : (
            <>
              <Text style={styles.title}>{log.title}</Text>
              {log.location ? (
                <View style={styles.locationContainer}>
                  <Text style={styles.locationIcon}>📍</Text>
                  <Text style={styles.location}>{log.location}</Text>
                </View>
              ) : null}
            </>
          )}
          
          <View style={styles.dateContainer}>
            <Text style={styles.dateLabel}>Created:</Text>
            <Text style={styles.date}>{formatDate(log.createdAt)}</Text>
          </View>
          
          {log.updatedAt !== log.createdAt && (
            <View style={styles.dateContainer}>
              <Text style={styles.dateLabel}>Updated:</Text>
              <Text style={styles.date}>{formatDate(log.updatedAt)}</Text>
            </View>
          )}
        </View>

        <View style={styles.contentContainer}>
          {isEditing ? (
            <TextInput
              style={[styles.contentText, {backgroundColor: '#f1f5f9', minHeight: 120}]}
              value={editContent}
              onChangeText={setEditContent}
              placeholder="Content"
              multiline
            />
          ) : (
            <Text style={styles.contentText}>{log.content}</Text>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {isEditing ? (
          <>
            <TouchableOpacity
              style={[styles.button, styles.shareButton]}
              onPress={handleSaveEdit}
            >
              <Text style={styles.shareButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={handleCancelEdit}
            >
              <Text style={styles.deleteButtonText}>Cancel</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={[styles.button, styles.shareButton]}
              onPress={handleShare}
            >
              <Text style={styles.shareButtonText}>Share</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.editButton]}
              onPress={handleEdit}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={handleDelete}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  content: {
    flex: 1,
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#075985',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  location: {
    fontSize: 16,
    color: '#64748b',
    flex: 1,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
  },
  dateLabel: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
    marginRight: 8,
  },
  date: {
    fontSize: 14,
    color: '#64748b',
  },
  contentContainer: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 10,
    minHeight: 400,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#334155',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  shareButton: {
    backgroundColor: '#10b981',
  },
  shareButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  editButton: {
    backgroundColor: '#075985',
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#ef4444',
  },
  deleteButtonText: {
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
  },
  errorText: {
    fontSize: 18,
    color: '#ef4444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#334155',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#4caf50',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default LogDetailScreen;