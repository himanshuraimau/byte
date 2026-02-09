/**
 * App Configuration
 */

export const Config = {
  appName: 'Byte',
  version: '1.0.0',
  
  // Timer
  defaultDurationPresets: [60, 90, 120], // minutes
  timerUpdateInterval: 1000, // milliseconds
  
  // Timeline
  entriesPerPage: 50,
  
  // API
  // Use environment variable if available, otherwise fallback to defaults
  // The base URL should include /api since endpoints don't include it
  // For Android emulator: http://10.0.2.2:3000/api
  // For iOS simulator/web: http://localhost:3000/api
  // For physical device: http://<your-computer-ip>:3000/api
  apiBaseUrl: (() => {
    const url = (process.env.EXPO_PUBLIC_API_URL || '').trim();
    if (!url) return 'http://localhost:3000/api';
    const base = url.replace(/\/api\/?$/, '');
    return `${base}/api`;
  })(),
  
  // Date
  dateFormat: 'YYYY-MM-DD', // ISO 8601
  timeFormat: 'h:mm A', // 12-hour format
};
