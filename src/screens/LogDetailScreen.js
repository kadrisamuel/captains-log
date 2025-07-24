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
import { LogStorage } from '../utils/LogStorage';
import strings from '../utils/strings';
import { useTheme } from '../context/ThemeContext';

const LogDetailScreen = ({ route, navigation }) => {
  const { logId } = route.params;
  const [log, setLog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editContent, setEditContent] = useState('');
  const { darkMode } = useTheme(); // <-- use context

  // Themed colors
  const backgroundColor = darkMode ? '#1e293b' : '#f0f9ff';
  const cardBg = darkMode ? '#334155' : 'white';
  const borderColor = darkMode ? '#475569' : '#e2e8f0';
  const titleColor = darkMode ? '#38bdf8' : '#075985';
  const locationColor = darkMode ? '#cbd5e1' : '#64748b';
  const dateLabelColor = darkMode ? '#94a3b8' : '#94a3b8';
  const dateColor = darkMode ? '#cbd5e1' : '#64748b';
  const contentTextColor = darkMode ? '#f1f5f9' : '#334155';
  const buttonTextColor = '#fff';
  const shareButtonBg = '#10b981';
  const editButtonBg = darkMode ? '#0ea5e9' : '#075985';
  const deleteButtonBg = '#ef4444';
  const loadingTextColor = darkMode ? '#cbd5e1' : '#64748b';
  const errorTextColor = '#ef4444';
  const inputBg = darkMode ? '#475569' : '#f1f5f9';
  const inputTextColor = darkMode ? '#f1f5f9' : '#334155';
  const headerSaveButtonColor = '#f1f5f9';

  useEffect(() => {
    loadLog();
  }, [logId]);

  useEffect(() => {
    if (isEditing) {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity onPress={handleSaveEdit} style={{ marginRight: 16 }}>
            <Text style={{
  color: headerSaveButtonColor,
  fontWeight: 'bold',
  fontSize: 16,
}}>
  {strings.logDetail.save}
</Text>
          </TouchableOpacity>
        ),
      });
    } else {
      navigation.setOptions({ headerRight: undefined });
    }
  }, [isEditing, editTitle, editLocation, editContent]);

  const loadLog = async () => {
    try {
      setIsLoading(true);
      const logData = await LogStorage.getLogById(logId);
      if (logData) {
        setLog(logData);
      } else {
        // Not found alert
        Alert.alert(
          strings.logDetail.error,
          strings.logDetail.notFound,
          [{ text: strings.logDetail.ok, onPress: () => navigation.goBack() }]
        );
      }
    } catch (error) {
      console.error(strings.logDetail.error, error);
      // Failed to load alert
      Alert.alert(strings.logDetail.error, strings.logDetail.failedToLoad);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      strings.logDetail.deleteTitle,
      strings.logDetail.deleteMessage(log.title),
      [
        { text: strings.logDetail.cancel, style: 'cancel' },
        {
          text: strings.logDetail.delete,
          style: 'destructive',
          onPress: async () => {
            try {
              await LogStorage.deleteLog(logId);
              Alert.alert(
                strings.logDetail.successDelete,
                '',
                [{ text: strings.logDetail.ok, onPress: () => navigation.goBack() }]
              );
            } catch (error) {
              Alert.alert(strings.logDetail.error, strings.logDetail.failedToDelete);
            }
          }
        }
      ]
    );
  };

  const handleShare = async () => {
    try {
      const shareContent = `${log.title}\n\n${log.location ? `${strings.logDetail.locationLabel}${log.location}\n\n` : ''}${log.content}\n\n${strings.logDetail.created} ${formatDate(log.createdAt)}`;
      
      await Share.share({
        message: shareContent,
        title: log.title,
      });
    } catch (error) {
      console.error(strings.logDetail.errorSharing, error);
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
      // Save edit success
      Alert.alert(strings.logDetail.successUpdate);
    } catch (error) {
      // Save edit failure
      Alert.alert(strings.logDetail.error, strings.logDetail.failedToUpdate);
    }
  };

  // TODO: dynamically localize date format
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
      <View style={[styles.loadingContainer, { backgroundColor }]}>
        <ActivityIndicator size="large" color={editButtonBg} />
        <Text style={[styles.loadingText, { color: loadingTextColor }]}>{strings.logDetail.loading}</Text>
      </View>
    );
  }

  if (!log) {
    return (
      <View style={[styles.errorContainer, { backgroundColor }]}>
        <Text style={[styles.errorText, { color: errorTextColor }]}>{strings.logDetail.notFound}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ScrollView style={styles.content}>
        <View style={[styles.header, { backgroundColor: cardBg, borderBottomColor: borderColor }]}>
          {isEditing ? (
            <>
              <TextInput
                style={[
                  styles.title,
                  { backgroundColor: inputBg, color: inputTextColor }
                ]}
                value={editTitle}
                onChangeText={setEditTitle}
                placeholder={strings.logDetail.titlePlaceholder}
                placeholderTextColor={locationColor}
              />
              <View style={styles.locationContainer}>
                <Text style={styles.locationIcon}>📍</Text>
                <TextInput
                  style={[
                    styles.location,
                    { backgroundColor: inputBg, color: inputTextColor }
                  ]}
                  value={editLocation}
                  onChangeText={setEditLocation}
                  placeholder={strings.logDetail.locationPlaceholder}
                  placeholderTextColor={locationColor}
                />
              </View>
            </>
          ) : (
            <>
              <TouchableOpacity onPress={handleEdit} activeOpacity={0.7}>
                <Text style={[styles.title, { color: titleColor }]}>{log.title}</Text>
              </TouchableOpacity>
              {log.location ? (
                <TouchableOpacity onPress={handleEdit} activeOpacity={0.7}>
                  <View style={styles.locationContainer}>
                    <Text style={styles.locationIcon}>📍</Text>
                    <Text style={[styles.location, { color: locationColor }]}>{log.location}</Text>
                  </View>
                </TouchableOpacity>
              ) : null}
            </>
          )}
          
          <View style={styles.dateContainer}>
            <Text style={[styles.dateLabel, { color: dateLabelColor }]}>{strings.logDetail.created}</Text>
            <Text style={[styles.date, { color: dateColor }]}>{formatDate(log.createdAt)}</Text>
          </View>
          
          {log.updatedAt !== log.createdAt && (
            <View style={styles.dateContainer}>
              <Text style={[styles.dateLabel, { color: dateLabelColor }]}>{strings.logDetail.updated}</Text>
              <Text style={[styles.date, { color: dateColor }]}>{formatDate(log.updatedAt)}</Text>
            </View>
          )}
        </View>

        <View style={[styles.contentContainer, { backgroundColor: cardBg }]}>
          {isEditing ? (
            <TextInput
              style={[
                styles.contentText,
                { backgroundColor: inputBg, color: inputTextColor, minHeight: 120 }
              ]}
              value={editContent}
              onChangeText={setEditContent}
              placeholder={strings.logDetail.contentPlaceholder}
              placeholderTextColor={locationColor}
              multiline
            />
          ) : (
            <TouchableOpacity onPress={handleEdit} activeOpacity={0.7}>
              <Text style={[styles.contentText, { color: contentTextColor }]}>{log.content}</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: cardBg, borderTopColor: borderColor }]}>
        {isEditing ? (
          <>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: shareButtonBg }]}
              onPress={handleSaveEdit}
            >
              <Text style={[styles.shareButtonText, { color: buttonTextColor }]}>{strings.logDetail.save}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: deleteButtonBg }]}
              onPress={handleCancelEdit}
            >
              <Text style={[styles.deleteButtonText, { color: buttonTextColor }]}>{strings.logDetail.cancelEdit}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: shareButtonBg }]}
              onPress={handleShare}
            >
              <Text style={[styles.shareButtonText, { color: buttonTextColor }]}>{strings.logDetail.share}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, { backgroundColor: editButtonBg }]}
              onPress={handleEdit}
            >
              <Text style={[styles.editButtonText, { color: buttonTextColor }]}>{strings.logDetail.edit}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, { backgroundColor: deleteButtonBg }]}
              onPress={handleDelete}
            >
              <Text style={[styles.deleteButtonText, { color: buttonTextColor }]}>{strings.logDetail.delete}</Text>
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