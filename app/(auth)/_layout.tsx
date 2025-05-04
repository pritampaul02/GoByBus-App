import { Stack } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect } from 'react';
import { router } from 'expo-router';

export default function AuthLayout() {
  const { isLoggedIn, token, user } = useAuthStore();

  useEffect(() => {
    if (isLoggedIn && token && user?.name && user?.email) {
      router.replace('/(protected)/(drawer)/(tabs)/search');
    }
  }, [isLoggedIn, token, user]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="complete-profile" />
    </Stack>
  );
}
