// src/screens/NewLogScreen.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { LogStorage } from '../services/LogStorage';
import SpeechToText from '../services/SpeechToText';

const NewLogScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const onSpeechResults = (results) => {
    // results is usually an array of recognized phrases
    setContent(results && results.length > 0 ? results[0] : '');
  };

  const onSpeechError = (error) => {
    Alert.alert('Speech Recognition Error', error?.message || 'Unknown error');
  };

  const startRecording = async () => {
    try {
      await SpeechToText.startListening(onSpeechResults, onSpeechError);
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = async () => {
    try {
      await SpeechToText.stopListening();
      setIsRecording(false);
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const saveLog = async () => {
    // Validate input
    /*if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your log entry.');
      return;
    }*/

    if (!content.trim()) {
      Alert.alert('Error', 'Please enter some content for your log entry.');
      return;
    }

    setIsSaving(true);

    try {
      const logData = {
        //title: title.trim(),
        location: location.trim(),
        content: content.trim()
      };

      const savedLog = await LogStorage.saveLog(logData);
      
      Alert.alert(
        'Success', 
        'Log entry saved successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Clear form and navigate back
              //setTitle('');
              setLocation('');
              setContent('');
              navigation.goBack();
            }
          }
        ]
      );
      
    } catch (error) {
      Alert.alert('Error', 'Failed to save log entry. Please try again.');
      console.error('Save log error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={styles.container}>
{/*  removed the title input for now
       <View style={styles.formGroup}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter log title"
            editable={!isSaving}
          />
        </View> */}
        
        <View style={styles.row}>
          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="Freeform text"
              editable={!isSaving}
            />
          </View>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Log Entry *</Text>
          <TextInput
            style={styles.textArea}
            value={content}
            onChangeText={setContent}
            placeholder="Write your log entry here..."
            multiline
            numberOfLines={10}
            textAlignVertical="top"
            editable={!isSaving}
          />
        </View>
        
        <TouchableOpacity 
          style={[styles.button, isSaving && styles.buttonDisabled]}
          onPress={saveLog}
          disabled={isSaving}
        >
          {isSaving ? (
            <View style={styles.buttonContent}>
              <ActivityIndicator color="white" size="small" />
              <Text style={[styles.buttonText, { marginLeft: 8 }]}>Saving...</Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>Save Log Entry</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
      <TouchableOpacity
          style={[styles.recordButton, isSaving && styles.recordButtonDisabled]}
          onPress={toggleRecording}
          onP
          disabled={isSaving}>
          {isSaving ? (
            <View style={styles.recordButtonContent}>
              <ActivityIndicator color="white" size="small" />
              <Text style={[styles.recordButtonText, { marginLeft: 8 }]}>Saving...</Text>
            </View>
          ) : (
            <Text style={styles.recordButtonText}>Record</Text>
          )}
        </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f9ff',
  },
  formGroup: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
    color: '#334155',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 200,
  },
  button: {
    backgroundColor: '#075985',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  buttonDisabled: {
    backgroundColor: '#94a3b8',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
    recordButton: {
    position: 'absolute',
    width: '20%',
    height: '10%',
    left: '50%',
    transform: [{ translateX: -35 }],
    alignItems: 'center',
    justifyContent: 'center',
    bottom: '10%',
    backgroundColor: '#ef4444',
    borderRadius: '50%',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  recordButtonText: {
    fontSize: 24,
    color: 'white',
  },
  recordButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  recordButtonContent: {
    flexDirection: 'column',
    alignItems: 'center',
  },
});

export default NewLogScreen;