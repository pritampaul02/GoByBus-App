import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function ProtectedLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(drawer)" />
        <Stack.Screen name="login" />
        <Stack.Screen name="complete-profile" />
        <Stack.Screen name="search-result" />
        <Stack.Screen name="bus-details" />
        <Stack.Screen name="all-buses" />
      </Stack>
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}
