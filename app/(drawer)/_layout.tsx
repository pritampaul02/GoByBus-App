import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { Image, Platform, Text, View } from 'react-native';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import TheamedText from '@/components/global/TheamedText';
import TabsIcon from '@/components/ui/TabsIcon';
import { router } from 'expo-router';

const CustomDrawer = (props: any) => {
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView
        {...props}
        scrollEnabled={false}
        contentContainerStyle={{ backgroundColor: '#dde3fe' }}
      >
        <View style={{ marginBottom: 30 }}>
          <Image
            source={{
              uri: 'https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/11_avatar-512.png',
            }}
            style={{
              height: 150,
              width: 150,
              borderRadius: 50,
              alignSelf: 'center',
            }}
          />
          <TheamedText align="center" size={25} style={{ fontWeight: 700 }}>
            User Name
          </TheamedText>
        </View>
        <DrawerItemList {...props} />
        <DrawerItem label={'Login'} onPress={() => router.navigate('/login')} />
      </DrawerContentScrollView>
    </View>
  );
};

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerType: Platform.OS === 'android' && 'back',
        drawerHideStatusBarOnOpen: true,
        drawerActiveBackgroundColor: '#5363df',
        drawerActiveTintColor: '#fff',
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
        name="report"
        options={{
          title: 'Report',
          drawerIcon: ({ size, color }: any) => (
            <TabsIcon name="ban-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          title: 'Settings',
          drawerIcon: ({ size, color }: any) => (
            <TabsIcon name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}
