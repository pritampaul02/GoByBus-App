import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Share, useColorScheme, View } from 'react-native';
import TheamedText from '@/components/global/TheamedText';
import { Colors } from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TabsIcon from './TabsIcon';
import { useAuthStore } from '@/store/useAuthStore';
import { useSearchStore } from '@/store/useSearchStore';

const CustomDrawer = (props: any) => {
  const theme = Colors[useColorScheme() ?? 'light'];
  const { top, bottom } = useSafeAreaInsets();
  const { user, logout } = useAuthStore();

  const [currentTime, setCurrentTime] = useState(new Date());

  const { clearRecentSearches } = useSearchStore();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    let hrs = date.getHours();
    const mins = String(date.getMinutes()).padStart(2, '0');
    const secs = String(date.getSeconds()).padStart(2, '0');
    const ampm = hrs >= 12 ? 'PM' : 'AM';
    hrs = hrs % 12 || 12;
    return `${String(hrs).padStart(2, '0')}:${mins}:${secs} ${ampm}`;
  };

  const handleShareApp = async () => {
    try {
      await Share.share({
        message:
          'Hey! Check out this amazing app: https://play.google.com/store/apps/details?id=com.example.app',
        url: 'https://play.google.com/store/apps/details?id=com.example.app',
        title: 'Download Our App',
      });
    } catch (error) {
      console.error('Error sharing app:', error);
      Alert.alert('Sharing Failed', 'Something went wrong while trying to share the app.');
    }
  };

  const handleClearHistory = () => {
    clearRecentSearches();
  };

  const handleAuthAction = () => {
    logout();
    router.replace('/(auth)/login');
  };

  // Filter routes based on role
  const filteredRoutes = props.state.routes.filter((route: any) => {
    if (!user || user.role !== 'driver') {
      return !['your-bus', 'my-stops'].includes(route.name);
    }
    return true;
  });

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Header */}
      <View
        style={{
          padding: 20,
          backgroundColor: theme.card,
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
          alignItems: 'center',
          paddingTop: top + 10,
          paddingBottom: 5,
        }}
      >
        <Image
          source={{
            uri: 'https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/11_avatar-512.png',
          }}
          style={{
            height: 120,
            width: 120,
            borderRadius: 99,
          }}
        />
        <TheamedText
          size={14}
          align="center"
          style={{
            textTransform: 'capitalize',
            backgroundColor: theme.background,
            padding: 8,
            borderRadius: 15,
            color: theme.tint,
            marginTop: -20,
            elevation: 2,
          }}
        >
          {user?.role}
        </TheamedText>
        <TheamedText size={22} align="center" style={{ fontWeight: '700', marginTop: 10 }}>
          {user?.name ?? 'User Name'}
        </TheamedText>
        <TheamedText size={14} align="center" style={{ marginBottom: 5 }}>
          {user?.email}
        </TheamedText>

        {/* Clock */}
        <View
          style={{
            marginTop: 5,
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 20,
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'center',
            gap: 4,
          }}
        >
          <TheamedText
            style={{
              fontSize: 36,
              fontWeight: '300',
              letterSpacing: 2,
              color: theme.icon,
            }}
          >
            {formatTime(currentTime).split(' ')[0]}
          </TheamedText>
          <TheamedText size={18} style={{ fontWeight: '100' }}>
            {formatTime(currentTime).split(' ')[1]}
          </TheamedText>
        </View>
      </View>

      {/* Drawer Items */}
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: theme.background,
          paddingTop: 10,
        }}
      >
        {filteredRoutes.map((route: any, index: number) => {
          const { key, name } = route;
          const descriptor = props.descriptors[key];
          const isFocused = props.state.index === index;

          if (!descriptor) return null;

          return (
            <DrawerItem
              key={key}
              label={descriptor.options.title ?? name}
              icon={descriptor.options.drawerIcon}
              focused={isFocused}
              onPress={() => props.navigation.navigate(name)}
              activeTintColor={theme.card}
              inactiveTintColor={theme.tabIconDefault}
              activeBackgroundColor={theme.tabIconSelected}
              labelStyle={{ color: isFocused ? '#fff' : theme.tabIconDefault, fontSize: 16 }}
            />
          );
        })}

        {/* Extra Items */}
        <DrawerItem
          label="Share App"
          onPress={handleShareApp}
          labelStyle={{ fontSize: 16, color: theme.tabIconDefault }}
          icon={({ size }: any) => (
            <TabsIcon name="share-social-outline" color={theme.tabIconDefault} size={size} />
          )}
        />
        <DrawerItem
          label="Clear History"
          onPress={handleClearHistory}
          labelStyle={{ fontSize: 16, color: theme.tabIconDefault }}
          icon={({ size }: any) => (
            <TabsIcon name="timer-outline" color={theme.tabIconDefault} size={size} />
          )}
        />
      </DrawerContentScrollView>

      {/* Footer: Logout */}
      <View
        style={{
          padding: 10,
          borderTopWidth: 1,
          borderTopColor: theme.border,
          marginBottom: bottom > 0 ? bottom : 10,
          backgroundColor: theme.background,
        }}
      >
        <DrawerItem
          label="Logout"
          onPress={handleAuthAction}
          labelStyle={{ fontSize: 16, color: theme.alert, fontWeight: '700' }}
          icon={({ size }: any) => (
            <TabsIcon name="log-out-outline" color={theme.alert} size={size} />
          )}
        />
      </View>
    </View>
  );
};

export default CustomDrawer;
