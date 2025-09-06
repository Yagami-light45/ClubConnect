// src/utils/env.js

/**
 * Get environment variable that works with both Vite and Create React App
 * @param {string} name - Environment variable name (without prefix)
 * @param {string} defaultValue - Default value if not found
 * @returns {string} Environment variable value
 */
export const getEnvVar = (name, defaultValue = '') => {
  // Check for Vite environment variables (VITE_ prefix)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    const viteVar = import.meta.env[`VITE_${name}`];
    if (viteVar !== undefined) {
      return viteVar;
    }
  }
  
  // Check for Create React App environment variables (REACT_APP_ prefix)
  if (typeof process !== 'undefined' && process.env) {
    const craVar = process.env[`REACT_APP_${name}`];
    if (craVar !== undefined) {
      return craVar;
    }
  }
  
  return defaultValue;
};

/**
 * Check if we're in development mode
 */
export const isDevelopment = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.DEV;
  }
  if (typeof process !== 'undefined' && process.env) {
    return process.env.NODE_ENV === 'development';
  }
  return true; // Default to development
};

/**
 * App configuration
 */
export const config = {
  apiUrl: getEnvVar('API_URL', 'http://localhost:5000'),
  useMock: getEnvVar('USE_MOCK', 'true') === 'true',
  isDev: isDevelopment()
};