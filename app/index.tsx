import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Animated, Easing } from 'react-native';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';

const SplashScreen = () => {
  const theme = Colors[useColorScheme() ?? 'light'];
  const scaleValue = new Animated.Value(0.8);
  const opacityValue = new Animated.Value(0);

  const { isLoggedIn, token } = useAuthStore();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 800,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: true,
      }),
      Animated.timing(opacityValue, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        isLoggedIn && token
          ? router.replace('/(protected)/(drawer)/(tabs)/search')
          : router.replace('/(auth)/login');
      }, 1000);
    });
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <Animated.View
        style={[
          styles.content,
          {
            transform: [{ scale: scaleValue }],
            opacity: opacityValue,
          },
        ]}
      >
        <Image
          source={require('@/assets/images/adaptive-icon.png')}
          style={styles.logo}
          resizeMode="cover"
        />

        <Animated.Text
          style={[
            styles.tagline,
            {
              opacity: opacityValue,
              color: theme.text,
            },
          ]}
        >
          Ride Smarter, Arrive Happier
        </Animated.Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  tagline: {
    position: 'absolute',
    fontSize: 18,
    fontWeight: '500',
    letterSpacing: 0.5,
    width: '100%',
    textAlign: 'center',
    bottom: 30,
  },
});

export default SplashScreen;
