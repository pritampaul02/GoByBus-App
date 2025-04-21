import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Share, useColorScheme, View } from 'react-native';
import TheamedText from '@/components/global/TheamedText';
import { Colors } from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TabsIcon from './TabsIcon';

const CustomDrawer = (props: any) => {
  const theme = Colors[useColorScheme() ?? 'light'];
  const { top, bottom } = useSafeAreaInsets();

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    let hrs = date.getHours();
    const mins = String(date.getMinutes()).padStart(2, '0');
    const secs = String(date.getSeconds()).padStart(2, '0');
    const ampm = hrs >= 12 ? 'PM' : 'AM';

    hrs = hrs % 12;
    hrs = hrs ? hrs : 12; // 0 => 12

    return `${String(hrs).padStart(2, '0')}:${mins}:${secs} ${ampm}`;
  };

  const isLoggedIn = true;

  const handleShareApp = async () => {
    try {
      const message = 'Hey! Check out this amazing app: https://lens-lock.vercel.app';

      // if (Platform.OS === 'web') {
      //   // Web doesn't support Share API properly
      //   await Clipboard.setStringAsync('https://yourappdownloadlink.com');
      //   Alert.alert('Link Copied!', 'You can now paste it anywhere to share.');
      //   return;
      // }

      await Share.share({
        message,
        url: 'https://lens-lock.vercel.app',
        title: 'Download Our App',
      });
    } catch (error) {
      console.error('Error sharing app:', error);
      Alert.alert('Sharing Failed', 'Something went wrong while trying to share the app.');
    }
  };

  const handleClearHistory = () => {
    console.log('History Cleared');
  };

  const handleAuthAction = () => {
    if (isLoggedIn) {
      router.push('/login');
    } else {
      router.navigate('/login');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* User Info Header */}
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
        <TheamedText size={22} align="center" style={{ fontWeight: '700', marginTop: 10 }}>
          User Name
        </TheamedText>
        <TheamedText size={14} align="center" style={{ marginBottom: 5 }}>
          user@emailid.com
        </TheamedText>

        {/* Real Timer */}
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
        <DrawerItemList {...props} />

        {/* Extra Items */}
        <DrawerItem
          label="Share App"
          onPress={handleShareApp}
          labelStyle={{ fontSize: 16, color: theme.tabIconDefault }}
          icon={({ color, size }: any) => (
            <TabsIcon name="share-social-outline" color={theme.tabIconDefault} size={size} />
          )}
        />
        <DrawerItem
          label="Clear History"
          onPress={handleClearHistory}
          labelStyle={{ fontSize: 16, color: theme.tabIconDefault }}
          icon={({ color, size }: any) => (
            // <MaterialCommunityIcons name="history" color={theme.tabIconDefault} size={size} />
            <TabsIcon name="timer-outline" color={theme.tabIconDefault} size={size} />
          )}
        />
      </DrawerContentScrollView>

      {/* Footer: Login or Logout */}
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
          label={isLoggedIn ? 'Logout' : 'Login'}
          onPress={handleAuthAction}
          labelStyle={{ fontSize: 16, color: theme.alert, fontWeight: '700' }}
          icon={({ color, size }: any) => (
            <TabsIcon
              name={isLoggedIn ? 'log-out-outline' : 'log-in-outline'}
              color={theme.alert}
              size={size}
            />
          )}
        />
      </View>
    </View>
  );
};

export default CustomDrawer;

// import { Drawer } from 'expo-router/drawer';
// import React from 'react';
// import { Image, Platform, Text, useColorScheme, View } from 'react-native';
// import TabsIcon from '@/components/ui/TabsIcon';
// import Drawe from '@/components/ui/CustomDrawer';
// import { Colors } from '@/constants/Colors';

// import TheamedText from '@/components/global/TheamedText';
// import { router } from 'expo-router';
// import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
// const CustomDrawer = (props: any) => {
//   return (
//     <View style={{ flex: 1 }}>
//       <DrawerContentScrollView
//         {...props}
//         scrollEnabled={false}
//         contentContainerStyle={{ backgroundColor: '#dde3fe' }}
//       >
//         <View style={{ marginBottom: 30 }}>
//           <Image
//             source={{
//               uri: 'https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/11_avatar-512.png',
//             }}
//             style={{
//               height: 150,
//               width: 150,
//               borderRadius: 50,
//               alignSelf: 'center',
//             }}
//           />
//           <TheamedText align="center" size={25} style={{ fontWeight: 700 }}>
//             User Name
//           </TheamedText>
//           <TheamedText align="center" size={15} style={{ fontWeight: 200 }}>
//             user@emailid.com
//           </TheamedText>
//         </View>
//         <DrawerItemList {...props} />
//         <DrawerItem label={'Login'} onPress={() => router.navigate('/login')} />
//       </DrawerContentScrollView>
//     </View>
//   );
// };
