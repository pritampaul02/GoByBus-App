import axios from 'axios';

export const BASE_URL = 'https://go-by-bus.vercel.app/api/';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 25000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export default axiosInstance;
