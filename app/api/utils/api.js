import axios from 'axios';

const api = axios.create({
  baseURL: 'https://edigital-service.vercel.app/api', // Cambia a tu base URL del backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
