import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect } from 'react';
import { router } from 'expo-router';

export default function ProtectedLayout() {
  const { isLoggedIn, token, user } = useAuthStore();

  useEffect(() => {
    if (!isLoggedIn || !token || !user?.name || !user?.email) {
      router.replace('/(auth)/login');
    }
  }, [isLoggedIn, token, user]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(drawer)" />
        <Stack.Screen name="search-result" />
        <Stack.Screen name="bus-details" />
        <Stack.Screen name="add-bus" />
        <Stack.Screen name="add-bus-stops" />
        <Stack.Screen name="all-buses" />
        <Stack.Screen name="view-stops" />
      </Stack>
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}
