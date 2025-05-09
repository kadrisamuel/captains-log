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
  Platform
} from 'react-native';

const NewLogScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [weather, setWeather] = useState('');
  const [location, setLocation] = useState('');
  const [content, setContent] = useState('');

  const saveLog = () => {
    // Here you would save the log to your data store
    // For now, we'll just navigate back
    console.log({ title, weather, location, content });
    navigation.goBack();
  };

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
          />
        </View>
        
        <View style={styles.row}>
          <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.label}>Weather</Text>
            <TextInput
              style={styles.input}
              value={weather}
              onChangeText={setWeather}
              placeholder="Current weather"
            />
          </View>
          
          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="Current coordinates"
            />
          </View>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Log Entry</Text>
          <TextInput
            style={styles.textArea}
            value={content}
            onChangeText={setContent}
            placeholder="Write your log entry here..."
            multiline
            numberOfLines={10}
            textAlignVertical="top"
          />
        </View>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={saveLog}
        >
          <Text style={styles.buttonText}>Save Log Entry</Text>
        </TouchableOpacity>
      </ScrollView>
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
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default NewLogScreen;