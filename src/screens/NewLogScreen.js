// src/screens/NewLogScreen.js
import React, { useState, useEffect, useLayoutEffect } from 'react';
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
import { LogStorage } from '../utils/LogStorage';
import SpeechToText from '../utils/SpeechToText';
import Geolocation from 'react-native-geolocation-service';
import strings from '../utils/strings';
import { useGeolocation } from '../context/GeolocationContext';
import { useTheme } from '../context/ThemeContext'; // <-- import useTheme to access darkMode
import { Ionicons } from '@expo/vector-icons'; // or use any icon library you use

const NewLogScreen = ({ navigation, route }) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [titleFieldWidth, setTitleFieldWidth] = useState(0);
  const { geolocationEnabled } = useGeolocation();
  const { darkMode } = useTheme(); // <-- use darkMode from ThemeContext

  // Themed colors
  const backgroundColor = darkMode ? '#1e293b' : '#f0f9ff';
  const textColor = darkMode ? '#f1f5f9' : '#334155';
  const labelColor = darkMode ? '#f1f5f9' : '#334155';
  const inputBg = darkMode ? '#334155' : 'white';
  const inputBorder = darkMode ? '#64748b' : '#cbd5e1';
  const buttonBg = darkMode ? '#0ea5e9' : '#075985';
  const recordButtonBg = '#ef4444';
  const recordButtonDisabledBg = '#94a3b8';
  const headerSaveButtonColor = '#f1f5f9';
  const placeholderTextColor = darkMode ? '#94a3b8' : '#64748b';

  const onSpeechResults = (results) => {
    // Join all recognized phrases with a space (or any separator you prefer)
    setContent(results && results.length > 0 ? results.join(' ') : '');
  };

  const onSpeechError = (error) => {
    Alert.alert(
      strings.newLog.speechRecognitionError,
      error?.message || strings.newLog.unknownError
    );
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

    // Estimate max chars: width / (fontSize * 0.6) is a good heuristic for average char width
    const fontSize = styles.input.fontSize || 16;
    const avgCharWidth = fontSize * 0.6;
    const maxTitleChars = titleFieldWidth
      ? Math.floor(titleFieldWidth / avgCharWidth)
      : 30; // fallback if width not measured

    let trimmedTitle = title.trim();
    const trimmedContent = content.trim();


    if (!trimmedTitle && trimmedContent) {
      trimmedTitle = trimmedContent.length > maxTitleChars
        ? trimmedContent.substring(0, maxTitleChars - 3) + '...'
        : trimmedContent;
    } else if (trimmedTitle.length > maxTitleChars) {
      trimmedTitle = trimmedTitle.substring(0, maxTitleChars - 3) + '...';
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
    } catch (error) {
      Alert.alert('Error', strings.newLog.savingError);
      console.error('Save log error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    // Start recording if opened with app shortcut record=true
    if (route?.params?.record) {
      startRecording();
    }

    // Only request geolocation if enabled
    if (geolocationEnabled) {
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
    }

    SpeechToText.reset();

    return () => {
      SpeechToText.destroy();
    };
  }, [geolocationEnabled]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', async (e) => {
      if (isRecording) {
        // Prevent default behavior of leaving the screen
        e.preventDefault();
        await stopRecording();
        // Now allow navigation to proceed
        navigation.dispatch(e.data.action);
      }
    });
    return unsubscribe;
  }, [navigation, isRecording]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={saveLog}
          disabled={isSaving}
          style={{
            marginRight: 16,
            opacity: isSaving ? 0.5 : 1,
            padding: 6,
            height: 36,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{
            color: headerSaveButtonColor,
            fontWeight: 'bold',
            fontSize: 16,
          }}>
            {strings.newLog.saveButton}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, saveLog, isSaving, darkMode, strings.newLog.saveButton]);

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={[styles.container, { backgroundColor }]}>
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: labelColor }]}>{strings.newLog.titleLabel}</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: inputBg, borderColor: inputBorder, color: textColor }
            ]}
            value={title}
            onChangeText={setTitle}
            placeholder={strings.newLog.titlePlaceholder}
            placeholderTextColor={placeholderTextColor}
            editable={!isSaving}
            onLayout={e => setTitleFieldWidth(e.nativeEvent.layout.width)}
          />
        </View>
        
        <View style={styles.row}>
          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={[styles.label, { color: labelColor }]}>{strings.newLog.locationLabel}</Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: inputBg, borderColor: inputBorder, color: textColor }
              ]}
              value={location}
              onChangeText={setLocation}
              placeholder={strings.newLog.locationPlaceholder}
              placeholderTextColor={placeholderTextColor}
              editable={!isSaving}
            />
          </View>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: labelColor }]}>{strings.newLog.contentLabel}</Text>
          <TextInput
            style={[
              styles.textArea,
              { backgroundColor: inputBg, borderColor: inputBorder, color: textColor }
            ]}
            value={content}
            onChangeText={setContent}
            placeholder={strings.newLog.contentPlaceholder}
            placeholderTextColor={placeholderTextColor}
            multiline
            numberOfLines={10}
            textAlignVertical="top"
            editable={!isSaving}
          />
        </View>
        
        <TouchableOpacity 
          style={[
            styles.button,
            { backgroundColor: buttonBg },
            isSaving && styles.buttonDisabled
          ]}
          onPress={saveLog}
          disabled={isSaving}
        >
          {isSaving ? (
            <View style={styles.buttonContent}>
              <ActivityIndicator color="white" size="small" />
              <Text style={[styles.buttonText, { marginLeft: 8 }]}>
                {strings.newLog.saving}
              </Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>{strings.newLog.saveButton}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
      <TouchableOpacity
        style={[
          styles.recordButton,
          { backgroundColor: isSaving ? recordButtonDisabledBg : recordButtonBg },
        ]}
        onPress={toggleRecording}
        disabled={isSaving}
      >
        {isSaving ? (
          <View style={styles.recordButtonContent}>
            <ActivityIndicator color="white" size="small" />
            <Text style={[styles.recordButtonText, { marginLeft: 8 }]}>
              {strings.newLog.saving}
            </Text>
          </View>
        ) : (
          <Text style={styles.recordButtonText}>
            {isRecording ? strings.newLog.stop : strings.newLog.record}
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
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 200,
  },
  button: {
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
    borderRadius: 999,
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