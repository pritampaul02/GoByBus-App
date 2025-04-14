import TabsIcon from '@/components/ui/TabsIcon';
import { Colors } from '@/constants/Colors';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, useColorScheme } from 'react-native';

export default function _layout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: true,
        tabBarActiveTintColor: theme.tabIconSelected,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
        tabBarIconStyle: {
          marginBottom: 5,
        },
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTintColor: theme.text,
      }}
    >
      <Tabs.Screen
        name="ticket"
        options={{
          tabBarIcon: ({ focused, size, color }: any) => (
            <TabsIcon name={focused ? 'ticket' : 'ticket-outline'} size={size} color={color} />
          ),
          headerShown: false,
          title: 'Ticket',
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ focused, size, color }: any) => (
            <TabsIcon name={focused ? 'search' : 'search-outline'} size={size} color={color} />
          ),
          title: 'Search',
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="emmergency"
        options={{
          tabBarIcon: ({ focused, size, color }: any) => (
            <TabsIcon name={focused ? 'help' : 'help-outline'} size={size} color={color} />
          ),
          headerShown: false,
          title: 'Help',
        }}
      />
    </Tabs>
  );
}
