// src/services/SpeechToText.js

import Voice, {
  SpeechRecognizedEvent,
  SpeechResultsEvent,
  SpeechErrorEvent,
} from "@react-native-voice/voice";

const [recognized, setRecognized] = useState("");
const [pitch, setPitch] = useState("");
const [error, setError] = useState("");
const [end, setEnd] = useState("");
const [started, setStarted] = useState("");
const [results, setResults] = useState([]);
const [partialResults, setPartialResults] = useState([]);

export class SpeechToText { 
    static async startListening(onSpeechResults, onSpeechError) {
        try {
        Voice.onSpeechRecognized = (event) => {
            setRecognized(event.value);
        };
        Voice.onSpeechResults = (event) => {
            setResults(event.value);
            if (onSpeechResults) onSpeechResults(event.value);
        };
        Voice.onSpeechError = (event) => {
            setError(event.error);
            if (onSpeechError) onSpeechError(event.error);
        };
        await Voice.start("en-US");
        } catch (error) {
        console.error("Error starting speech recognition:", error);
        }
    }
    
    static async stopListening() {
        try {
        await Voice.stop();
        } catch (error) {
        console.error("Error stopping speech recognition:", error);
        }
    }
    
    static async cancelListening() {
        try {
        await Voice.cancel();
        } catch (error) {
        console.error("Error canceling speech recognition:", error);
        }
    }

    static async destroy() {
        try {
        await Voice.destroy();
        } catch (error) {
        console.error("Error destroying speech recognition instance:", error);
        }
    }

    static async reset() {
        setRecognized("");
        setPitch("");
        setError("");
        setEnd("");
        setStarted("");
        setResults([]);
        setPartialResults([]);
    }

    static async getCurrentResults() {
        return {
            recognized,
            pitch,
            error,
            end,
            started,
            results,
            partialResults
        };
    }

    static async setLanguage(language) {
        try {
            await Voice.setLanguage(language);
        } catch (error) {
            console.error("Error setting language:", error);
        }
    }

    static async getSupportedLanguages() {
        try {
            const languages = await Voice.getSupportedLanguages();
            return languages;
        } catch (error) {
            console.error("Error getting supported languages:", error);
            return [];
        }
    }

    static async isAvailable() {
        try {
            const available = await Voice.isAvailable();
            return available;
        } catch (error) {
            console.error("Error checking availability:", error);
            return false;
        }
    }
    
    static async getCurrentLocale() {
        try {
            const locale = await Voice.getCurrentLocale();
            return locale;
        } catch (error) {
            console.error("Error getting current locale:", error);
            return null;
        }
    }

}