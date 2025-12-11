// src/config/environment.js

// --- Constants ---
export const MONGODB_FLE_API_URL = process.env.REACT_APP_MONGODB_FLE_API_URL || 'http://localhost:5001';

// --- Helper Functions ---

/**
 * Determines if the current environment is production.
 * @returns {boolean} True if in production, otherwise false.
 */
const isProduction = () => process.env.NODE_ENV === 'production';

/**
 * Retrieves the base URL for the main API.
 * In production, it uses the value from the environment variable.
 * In development, it defaults to a local server address.
 * @returns {string} The API base URL.
 */
export const getApiBaseUrl = () => {
  return isProduction()
    ? process.env.REACT_APP_API_URL
    : 'http://localhost:5000/api';
};

/**
 * Retrieves the URL for the MongoDB FLE (Field-Level Encryption) API.
 * Uses the constant `MONGODB_FLE_API_URL`.
 * @returns {string} The MongoDB FLE API URL.
 */
export const getMongoDBFLEApiUrl = () => {
  return MONGODB_FLE_API_URL;
};
