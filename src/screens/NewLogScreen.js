// src/screens/NewLogScreen.js
import React, { useState, useEffect } from 'react';
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
import Geolocation from 'react-native-geolocation-service';

const NewLogScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const onSpeechResults = (results) => {
    // Join all recognized phrases with a space (or any separator you prefer)
    setContent(results && results.length > 0 ? results.join(' ') : '');
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
    // If recording, stop it first
    if (isRecording) {
      await stopRecording();
    }

    // If title is empty, set it as the first 20 characters of content + "..." if needed
    let trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedContent) {
      Alert.alert('Error', 'Please enter some content for your log entry.');
      return;
    }

    if (!trimmedTitle) {
      trimmedTitle = trimmedContent.length > 20
        ? trimmedContent.substring(0, 20) + '...'
        : trimmedContent;
    }

    setIsSaving(true);

    try {
      const logData = {
        title: trimmedTitle,
        location: location.trim(),
        content: trimmedContent,
      };

      const savedLog = await LogStorage.saveLog(logData);
      setTitle('');
      setLocation('');
      setContent('');
      navigation.goBack();
      Alert.alert('Success', 'Log entry saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save log entry. Please try again.');
      console.error('Save log error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    Geolocation.requestAuthorization('whenInUse').then((result) => {
      if (result === 'granted' || result === true) {
        Geolocation.getCurrentPosition(
          async position => {
            const { latitude, longitude } = position.coords;
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
              );
              const data = await response.json();
              // Try to get city, town, or village from the address
              const address = data.address || {};
              const city =
                address.city ||
                address.town ||
                address.village ||
                address.hamlet ||
                address.state ||
                address.county ||
                data.display_name || // fallback to display_name
                `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
              setLocation(city);
            } catch (err) {
              setLocation(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
              console.log('Reverse geocoding error:', err);
            }
          },
          error => {
            console.log('Geolocation error:', error);
          },
          { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
        );
      }
    });

    SpeechToText.reset();

    return () => {
      SpeechToText.destroy();
    };
  }, []);

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={styles.container}>
 
       <View style={styles.formGroup}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter log title"
            editable={!isSaving}
          />
        </View>
        
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
          disabled={isSaving}
        >
          {isSaving ? (
            <View style={styles.recordButtonContent}>
              <ActivityIndicator color="white" size="small" />
              <Text style={[styles.recordButtonText, { marginLeft: 8 }]}>Saving...</Text>
            </View>
          ) : (
            <Text style={styles.recordButtonText}>
              {isRecording ? 'Stop' : 'Record'}
            </Text>
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