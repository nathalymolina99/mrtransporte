import axios from 'axios';

let API_URL;

if (process.env.NODE_ENV === 'development') {
  API_URL = 'http://localhost:4000/api';
} else {
  API_URL = 'https://tu-api-produccion.com/api';
}

const api = axios.create({
  baseURL: API_URL,
});

export default api;