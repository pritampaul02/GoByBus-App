import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { router,useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import TheamedText from '@/components/global/TheamedText';
import { useAuthStore } from '@/store/useAuthStore';

export default function ProfileScreen() {
  const theme = Colors[useColorScheme() ?? 'light'];
  const { top, bottom } = useSafeAreaInsets();
  const { user, logout } = useAuthStore();

  const navigation = useNavigation();

  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    logout();
    router.replace('/(auth)/login');
  };

  const handleEditProfile = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.navigate('/(protected)/edit-profile');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: top + 16 }]}>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.openDrawer();
          }}
          style={[styles.menuButton, { backgroundColor: theme.card }]}
        >
          <Ionicons name="menu" size={24} color={theme.tint} />
        </TouchableOpacity>
        <TheamedText style={[styles.headerText, { color: theme.text }]}>Profile</TheamedText>
        <TouchableOpacity
          onPress={handleEditProfile}
          style={[styles.editButton, { backgroundColor: theme.card }]}
        >
          <Ionicons name="create-outline" size={24} color={theme.tint} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={[styles.profileSection, { backgroundColor: theme.card }]}>
          <Image
            source={{
              uri: user?.profileImage || 'https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/11_avatar-512.png',
            }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <TheamedText style={[styles.name, { color: theme.text }]}>{user?.name}</TheamedText>
            <TheamedText style={[styles.email, { color: theme.icon }]}>{user?.email}</TheamedText>
            <View style={[styles.roleBadge, { backgroundColor: theme.tint }]}>
              <TheamedText style={styles.roleText}>{user?.role}</TheamedText>
            </View>
          </View>
        </View>

        {/* Stats Section */}
        <View style={[styles.statsSection, { backgroundColor: theme.card }]}>
          <View style={styles.statItem}>
            <TheamedText style={[styles.statValue, { color: theme.text }]}>12</TheamedText>
            <TheamedText style={[styles.statLabel, { color: theme.icon }]}>Trips</TheamedText>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
          <View style={styles.statItem}>
            <TheamedText style={[styles.statValue, { color: theme.text }]}>5</TheamedText>
            <TheamedText style={[styles.statLabel, { color: theme.icon }]}>Favorites</TheamedText>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
          <View style={styles.statItem}>
            <TheamedText style={[styles.statValue, { color: theme.text }]}>3</TheamedText>
            <TheamedText style={[styles.statLabel, { color: theme.icon }]}>Reviews</TheamedText>
          </View>
        </View>

        {/* Settings Section */}
        <View style={[styles.settingsSection, { backgroundColor: theme.card }]}>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              // router.navigate('/(protected)/notifications');
              Alert.alert('Coming Soon', 'This feature is coming soon.');
            }}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={24} color={theme.tint} />
              <TheamedText style={[styles.settingText, { color: theme.text }]}>
                Notifications
              </TheamedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.icon} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              // router.navigate('/(protected)/privacy');
              Alert.alert('Coming Soon', 'This feature is coming soon.');
            }}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="shield-outline" size={24} color={theme.tint} />
              <TheamedText style={[styles.settingText, { color: theme.text }]}>
                Privacy & Security
              </TheamedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.icon} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.navigate('/(protected)/(drawer)/(tabs)/emmergency');
            }}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="help-circle-outline" size={24} color={theme.tint} />
              <TheamedText style={[styles.settingText, { color: theme.text }]}>
                Help & Support
              </TheamedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.icon} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: theme.alert }]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color="white" />
          <TheamedText style={styles.logoutText}>Logout</TheamedText>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
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
  headerText: {
    fontSize: 24,
    fontWeight: '700',
  },
  editButton: {
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
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  profileSection: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    marginBottom: 8,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  statsSection: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  statDivider: {
    width: 1,
    height: '100%',
  },
  settingsSection: {
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
