// src/services/SpeechToText.js

import Voice from "@react-native-voice/voice";

class SpeechToText {
  recognized = "";
  pitch = "";
  error = "";
  end = "";
  started = "";
  results = [];
  partialResults = [];

  constructor() {
    Voice.onSpeechRecognized = (event) => {
      this.recognized = event.value;
    };
    Voice.onSpeechResults = (event) => {
      this.results = event.value;
    };
    Voice.onSpeechError = (event) => {
      this.error = event.error;
    };
    // Add other event handlers as needed
  }

  async startListening(onSpeechResults, onSpeechError) {
    try {
      Voice.onSpeechResults = (event) => {
        this.results = event.value;
        if (onSpeechResults) onSpeechResults(event.value);
      };
      Voice.onSpeechError = (event) => {
        this.error = event.error;
        if (onSpeechError) onSpeechError(event.error);
      };
      await Voice.start("en-US");
    } catch (error) {
      console.error("Error starting speech recognition:", error);
    }
  }

  async stopListening() {
    try {
      await Voice.stop();
    } catch (error) {
      console.error("Error stopping speech recognition:", error);
    }
  }

  async cancelListening() {
    try {
      await Voice.cancel();
    } catch (error) {
      console.error("Error canceling speech recognition:", error);
    }
  }

  async destroy() {
    try {
      await Voice.destroy();
    } catch (error) {
      console.error("Error destroying speech recognition instance:", error);
    }
  }

  async reset() {
    this.recognized = "";
    this.pitch = "";
    this.error = "";
    this.end = "";
    this.started = "";
    this.results = [];
    this.partialResults = [];
  }

  getCurrentResults() {
    return {
      recognized: this.recognized,
      pitch: this.pitch,
      error: this.error,
      end: this.end,
      started: this.started,
      results: this.results,
      partialResults: this.partialResults,
    };
  }

  async setLanguage(language) {
    try {
      await Voice.setLanguage(language);
    } catch (error) {
      console.error("Error setting language:", error);
    }
  }

  async getSupportedLanguages() {
    try {
      const languages = await Voice.getSupportedLanguages();
      return languages;
    } catch (error) {
      console.error("Error getting supported languages:", error);
      return [];
    }
  }

  async isAvailable() {
    try {
      const available = await Voice.isAvailable();
      return available;
    } catch (error) {
      console.error("Error checking availability:", error);
      return false;
    }
  }

  async getCurrentLocale() {
    try {
      const locale = await Voice.getCurrentLocale();
      return locale;
    } catch (error) {
      console.error("Error getting current locale:", error);
      return null;
    }
  }
}

export default new SpeechToText();