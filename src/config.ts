// Environment configuration
export const config = {
  // API Configuration
  // In production/staging, use relative URLs since frontend and backend are on same domain
  // In development, use localhost for the backend server
  apiUrl:
    process.env.NODE_ENV === 'production' ||
    process.env.REACT_APP_STAGING === 'true'
      ? '' // Empty string means relative URLs
      : process.env.REACT_APP_API_URL || 'http://localhost:8080',

  // Firebase Configuration (if still needed for other features)
  firebase: {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  },

  // App Configuration
  app: {
    name: 'VisaConnect',
    version: '1.0.0',
  },
};

export default config;
