import axiosInstance from '@/api/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { handleApiError } from '@/utils/handleApiError';

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    handleApiError(error);
    return Promise.reject(error);
  },
);

export default axiosInstance;
