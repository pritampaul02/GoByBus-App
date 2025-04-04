import TabsIcon from '@/components/ui/TabsIcon';
import { Colors } from '@/constants/Colors';
import { Tabs } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native';

export default function _layout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: true,
        tabBarActiveTintColor: theme.text,
      }}
    >
      <Tabs.Screen
        name="ticket"
        options={{
          tabBarIcon: ({ focused, size, color }) => (
            <TabsIcon name={focused ? 'ticket' : 'ticket-outline'} size={size} color={color} />
          ),
          title: 'Ticket',
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ focused, size, color }) => (
            <TabsIcon name={focused ? 'search' : 'search-outline'} size={size} color={color} />
          ),
          title: 'Search',
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="emmergency"
        options={{
          tabBarIcon: ({ focused, size, color }) => (
            <TabsIcon name={focused ? 'help' : 'help-outline'} size={size} color={color} />
          ),
          title: 'Help',
        }}
      />
    </Tabs>
  );
}
