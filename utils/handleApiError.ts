import { useAuthStore } from '@/store/useAuthStore';
import { Alert } from 'react-native';

export const handleApiError = (error: any) => {
  if (error.response) {
    const status = error.response.status;

    if (status === 401) {
      useAuthStore.getState().logout();
      Alert.alert('Session Expired', 'Please log in again.');
    } else if (status === 403) {
      Alert.alert('Access Denied', 'You are not allowed to perform this action.');
    } else if (status >= 500) {
      Alert.alert('Server Error', 'Something went wrong on our side.');
    }
  } else if (error.message) {
    Alert.alert('Network Error', error.message);
  } else {
    Alert.alert('Unknown Error', 'An unexpected error occurred.');
  }
};
