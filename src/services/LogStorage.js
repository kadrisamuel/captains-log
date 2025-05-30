// src/services/LogStorage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const LOGS_STORAGE_KEY = '@user_logs';

export class LogStorage {
  
  // Save a new log entry
  static async saveLog(logData) {
    try {
      // Create log object with timestamp and unique ID
      const log = {
        id: Date.now().toString(), // Simple ID generation
        title: logData.title,
        location: logData.location,
        content: logData.content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Get existing logs
      const existingLogs = await this.getAllLogs();
      
      // Add new log to the beginning of the array
      const updatedLogs = [log, ...existingLogs];
      
      // Save back to storage
      await AsyncStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(updatedLogs));
      
      return log;
    } catch (error) {
      console.error('Error saving log:', error);
      throw error;
    }
  }

  // Get all logs
  static async getAllLogs() {
    try {
      const logsJson = await AsyncStorage.getItem(LOGS_STORAGE_KEY);
      return logsJson ? JSON.parse(logsJson) : [];
    } catch (error) {
      console.error('Error getting logs:', error);
      return [];
    }
  }

  // Get a specific log by ID
  static async getLogById(id) {
    try {
      const logs = await this.getAllLogs();
      return logs.find(log => log.id === id);
    } catch (error) {
      console.error('Error getting log by ID:', error);
      return null;
    }
  }

  // Update an existing log
  static async updateLog(id, updatedData) {
    try {
      const logs = await this.getAllLogs();
      const logIndex = logs.findIndex(log => log.id === id);
      
      if (logIndex === -1) {
        throw new Error('Log not found');
      }

      // Update the log
      logs[logIndex] = {
        ...logs[logIndex],
        ...updatedData,
        updatedAt: new Date().toISOString()
      };

      await AsyncStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(logs));
      return logs[logIndex];
    } catch (error) {
      console.error('Error updating log:', error);
      throw error;
    }
  }

  // Delete a log by ID
  static async deleteLog(id) {
    try {
      const logs = await this.getAllLogs();
      const filteredLogs = logs.filter(log => log.id !== id);
      
      await AsyncStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(filteredLogs));
      return true;
    } catch (error) {
      console.error('Error deleting log:', error);
      throw error;
    }
  }

  // Search logs by title or content
  static async searchLogs(query) {
    try {
      const logs = await this.getAllLogs();
      const lowercaseQuery = query.toLowerCase();
      
      return logs.filter(log => 
        //log.title.toLowerCase().includes(lowercaseQuery) ||
        log.content.toLowerCase().includes(lowercaseQuery) ||
        log.location.toLowerCase().includes(lowercaseQuery)
      );
    } catch (error) {
      console.error('Error searching logs:', error);
      return [];
    }
  }

  // Clear all logs (use with caution)
  static async clearAllLogs() {
    try {
      await AsyncStorage.removeItem(LOGS_STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing logs:', error);
      throw error;
    }
  }

  // Get logs count
  static async getLogsCount() {
    try {
      const logs = await this.getAllLogs();
      return logs.length;
    } catch (error) {
      console.error('Error getting logs count:', error);
      return 0;
    }
  }
}