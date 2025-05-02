import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  useWindowDimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Link, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import TheamedText from '@/components/global/TheamedText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useAuthStore } from '@/store/useAuthStore';
import TabsIcon from '@/components/ui/TabsIcon';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

const HEADER_HEIGHT = 250;

type User = {
  name?: string;
  email?: string;
  role?: 'driver' | 'passenger' | string;
};

const Profile = () => {
  const theme = Colors[useColorScheme() ?? 'light'];
  const navigation = useNavigation();
  const { top, bottom } = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { user } = useAuthStore() as { user: User };

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [0, HEADER_HEIGHT],
            [0, -HEADER_HEIGHT / 2],
            Extrapolate.CLAMP,
          ),
        },
        {
          scale: interpolate(scrollY.value, [-100, 0], [1.5, 1], Extrapolate.EXTEND),
        },
      ],
      opacity: interpolate(scrollY.value, [0, HEADER_HEIGHT / 2], [1, 0], Extrapolate.CLAMP),
    };
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Animated.View style={[styles.header, { height: HEADER_HEIGHT }, headerAnimatedStyle]}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=2070',
          }}
          style={styles.headerImage}
          resizeMode="cover"
        />
        <View style={[styles.headerOverlay, { backgroundColor: theme.tint }]} />
      </Animated.View>

      <View style={[styles.headerContent, { paddingTop: top + 16 }]}>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.openDrawer();
          }}
          style={[styles.menuButton, { backgroundColor: theme.card }]}
        >
          <Ionicons name="menu" size={24} color={theme.tint} />
        </TouchableOpacity>
      </View>

      <Animated.ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottom + 20 }]}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <Link href="/(protected)/all-buses" asChild style={{ marginTop: 200 }}>
          <Text>Bus</Text>
        </Link>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    zIndex: 5,
  },
  headerImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3,
  },
  headerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 16,
  },
  content: {
    paddingTop: 180,
    paddingHorizontal: 20,
  },
});

export default Profile;
