import axios from 'axios';

const API = axios.create({
  baseURL: ' https://complaint-mangement-backend.onrender.com/api/',
  headers: {
    'Content-Type': 'application/json'
  }
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
