import axios from 'axios';

// Backend Server Path
const API = axios.create({
  baseURL: 'http://localhost:5000/api/auth',
});

// Register API
export const registerUser = (formData) => API.post('/register', formData);

// Login API
export const loginUser = (formData) => API.post('/login', formData)