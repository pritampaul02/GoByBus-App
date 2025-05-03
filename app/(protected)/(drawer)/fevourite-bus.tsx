import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import axiosInstance from '@/api/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { getBusTypeColor } from '@/utils/getBusTypeColor';

interface FavoriteBus {
  _id: string;
  name: string;
  busNumber: string;
  busType: string;
  isAC: boolean;
  isExpress: boolean;
  seatCapacity: number;
  registrationNumber: string;
}

export default function FavoritesScreen() {
  const theme = Colors[useColorScheme() ?? 'light'];
  const navigation = useNavigation();
  const { top, bottom } = useSafeAreaInsets();
  const token = useAuthStore((state) => state.token);

  const [favorites, setFavorites] = useState<FavoriteBus[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFavorites = async () => {
    try {
      const response = await axiosInstance.get('user/favorites', {
        headers: { token },
      });
      setFavorites(response.data.favorites || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchFavorites();
    }
  }, [token]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchFavorites();
  };

  const removeFavorite = async (busId: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await axiosInstance.delete(`user/favorites/${busId}`, {
        headers: { token },
      });
      setFavorites(favorites.filter((bus) => bus._id !== busId));
    } catch (error) {
      console.error('Error removing favorite:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const renderItem = ({ item }: { item: FavoriteBus }) => (
    <View style={[styles.busCard, { backgroundColor: theme.card }]}>
      <View style={styles.busInfo}>
        <Text style={[styles.busName, { color: theme.text }]}>{item.name}</Text>
        <View style={styles.busDetails}>
          <View style={[styles.busTypeBadge, { backgroundColor: getBusTypeColor(item.busType) }]}>
            <Text style={styles.busTypeText}>{item.busType.toUpperCase()}</Text>
          </View>
          <Text style={[styles.busNumber, { color: theme.icon }]}>{item.busNumber}</Text>
        </View>
      </View>

      <View style={styles.busFeatures}>
        {item.isAC && (
          <View style={styles.featureBadge}>
            <Ionicons name="snow" size={16} color="#03A9F4" />
            <Text style={[styles.featureText, { color: theme.text }]}>AC</Text>
          </View>
        )}
        {item.isExpress && (
          <View style={styles.featureBadge}>
            <Ionicons name="rocket" size={16} color="#FF5722" />
            <Text style={[styles.featureText, { color: theme.text }]}>Express</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        onPress={() => removeFavorite(item._id)}
        style={[styles.removeButton, { backgroundColor: theme.background }]}
      >
        <Ionicons name="heart" size={20} color={theme.alert} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Header */}
      <View style={[styles.headerContainer, { paddingTop: top + 16 }]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              navigation.openDrawer();
            }}
            style={[styles.menuButton, { backgroundColor: theme.card }]}
          >
            <Ionicons name="menu" size={24} color={theme.tint} />
          </TouchableOpacity>

          <Text style={[styles.headerText, { color: theme.text }]}>Favorite Buses</Text>

          <View style={{ width: 54 }} />
        </View>
      </View>

      {/* Content */}
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {loading ? (
          <ActivityIndicator size="large" color={theme.tint} style={styles.loader} />
        ) : favorites.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="heart-outline" size={64} color={theme.icon} />
            <Text style={[styles.emptyText, { color: theme.text }]}>No favorite buses yet</Text>
            <Text style={[styles.emptySubtext, { color: theme.icon }]}>
              Tap the heart icon on bus details to add favorites
            </Text>
          </View>
        ) : (
          <FlatList
            data={favorites}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={[styles.listContainer, { paddingBottom: bottom + 20 }]}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  busCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  busInfo: {
    flex: 1,
  },
  busName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  busDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  busTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  busTypeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  busNumber: {
    fontSize: 14,
    opacity: 0.8,
  },
  busFeatures: {
    flexDirection: 'row',
    marginHorizontal: 12,
  },
  featureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  featureText: {
    fontSize: 14,
    marginLeft: 4,
  },
  removeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
});
