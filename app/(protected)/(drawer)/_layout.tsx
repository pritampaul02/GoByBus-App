import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { Platform, useColorScheme } from 'react-native';
import TabsIcon from '@/components/ui/TabsIcon';
import { Colors } from '@/constants/Colors';
import CustomDrawer from '@/components/ui/CustomDrawer';
import { useAuthStore } from '@/store/useAuthStore';

export default function DrawerLayout() {
  const theme = Colors[useColorScheme() ?? 'light'];

  const { user } = useAuthStore();
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerType: Platform.OS === 'android' && 'back',
        drawerHideStatusBarOnOpen: Platform.OS === 'ios',
        drawerActiveBackgroundColor: theme.tabIconSelected,
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: theme.tabIconDefault,
      }}
      drawerContent={CustomDrawer}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          title: 'Home',
          drawerIcon: ({ size, color }: any) => (
            <TabsIcon name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          title: 'Profile',
          drawerIcon: ({ size, color }: any) => (
            <TabsIcon name="person-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="add-bus"
        options={{
          title: 'Add Bus',
          drawerIcon: ({ size, color }: any) => (
            <TabsIcon name="bus-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="add-bus-stops"
        options={{
          title: 'Add Bus Stops',
          drawerIcon: ({ size, color }: any) => (
            <TabsIcon name="map-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="report"
        options={{
          title: 'Report',
          drawerIcon: ({ size, color }: any) => (
            <TabsIcon name="ban-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="fevourite-bus"
        options={{
          title: 'Fevourite Bus',
          drawerIcon: ({ size, color }: any) => (
            <TabsIcon name="heart-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}
