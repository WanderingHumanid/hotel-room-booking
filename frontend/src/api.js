import axios from 'axios';

// Use environment variable for API URL, fallback to local development
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api/';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;
