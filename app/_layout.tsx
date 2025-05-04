import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as NavigationBar from 'expo-navigation-bar';
import React from 'react';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  React.useEffect(() => {
    NavigationBar.setBackgroundColorAsync(Colors[colorScheme || 'light'].background);
    NavigationBar.setButtonStyleAsync(colorScheme === 'light' ? 'dark' : 'light');
  }, [colorScheme]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(protected)" />
      </Stack>
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}
