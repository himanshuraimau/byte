/**
 * App Configuration
 */

export const Config = {
  appName: 'Byte',
  version: '1.0.0',
  
  // Database
  databaseName: 'byte.db',
  
  // Timer
  defaultDurationPresets: [60, 90, 120], // minutes
  timerUpdateInterval: 1000, // milliseconds
  
  // Timeline
  entriesPerPage: 50,
  
  // Date
  dateFormat: 'YYYY-MM-DD', // ISO 8601
  timeFormat: 'h:mm A', // 12-hour format
};
