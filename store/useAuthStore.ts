import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

interface AuthState {
  loading: boolean;
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
  setLoading: (loading: boolean) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist<AuthState>(
    (set) => ({
      loading: false,
      isLoggedIn: false,
      user: null,
      token: null,
      setLoading: (loading) => set({ loading }),
      login: (user, token) => set({ user, token, isLoggedIn: true }),
      logout: () => set({ user: null, token: null, isLoggedIn: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage), // AsyncStorage for Expo
    },
  ),
);
