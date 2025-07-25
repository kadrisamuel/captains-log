// src/utils/strings.js
const strings = {
  logs: {
    searchPlaceholder: "Search logs...",
    loading: "Loading logs...",
    noLogs: "No logs found",
    tryDifferentSearch: "Try a different search term",
    createFirstLog: "Create your first log entry!",
    deleteLogTitle: "Delete Log",
    deleteLogMessage: (title) => `Are you sure you want to delete "${title}"?`,
    delete: "Delete",
    cancel: "Cancel",
    logDateAt: (date, time) => `${date} at ${time}`,
    fabAdd: "+",
    error: "Error",
    failedToLoadLogs: "Failed to load logs",
    failedToDeleteLog: "Failed to delete log",
  },
  newLog: {
    titleLabel: "Title",
    titlePlaceholder: "Enter log title",
    locationLabel: "Location",
    locationPlaceholder: "Location or coordinates",
    contentLabel: "Log Entry *",
    contentPlaceholder: "Write your log entry here...",
    saveButton: "Save",
    saving: "Saving...",
    record: "Record",
    stop: "Stop",
    savingSuccess: "Log entry saved successfully!",
    savingError: "Failed to save log entry. Please try again.",
    speechRecognitionError: "Speech Recognition Error",
    unknownError: "Unknown error",
    error: "Error",
  },
  logDetail: {
    locationLabel: "Location: ",
    loading: "Loading log...",
    notFound: "Log not found",
    error: "Error: ",
    errorSharing: "Error sharing log: ",
    failedToLoad: "Failed to load log",
    deleteTitle: "Delete Log",
    deleteMessage: (title) => `Are you sure you want to delete "${title}"?`,
    delete: "Delete",
    cancel: "Cancel",
    successDelete: "Log deleted successfully",
    successUpdate: "Log updated successfully!",
    failedToDelete: "Failed to delete log",
    failedToUpdate: "Failed to update log",
    share: "Share",
    edit: "Edit",
    save: "Save",
    cancelEdit: "Cancel",
    created: "Created:",
    updated: "Updated:",
    contentPlaceholder: "Content",
    locationPlaceholder: "Location",
    titlePlaceholder: "Title",
    ok: "OK",
  },
  settings: {
    appSettings: "App Settings",
    darkMode: "Dark Mode",
    locationTracking: "Location Tracking",
    exportLogData: "Export Log Data",
    build: "Build:",
    exportFailed: "Export failed",
    debug: "Debug",
    release: "Release",
    systemTheme: "System",
    lightTheme: "Light",
    darkTheme: "Dark",
  },
    home: {
    welcome: "Welcome to Captain's Log",
    subtitle: "Record your journey",
    viewAllLogs: "View All Logs",
    newManualLog: "New Manual Log",
    recordVoiceLog: "Record Voice Log",
  },
};

export default strings;