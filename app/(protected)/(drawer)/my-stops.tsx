import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router, useNavigation } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { FlashList } from '@shopify/flash-list';
import { useBusStore } from '@/store/useBusStore';

const BusCard = ({ item }: { item: any }) => {
  const theme = Colors[useColorScheme() ?? 'light'];

  const getBusTypeColor = () => {
    switch (item.busType) {
      case 'volvo':
        return '#4CAF50';
      case 'mini':
        return '#2196F3';
      case 'sleeper':
        return '#9C27B0';
      default:
        return '#607D8B';
    }
  };

  return (
    <TouchableOpacity
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push({ pathname: '/(protected)/view-stops', params: { busId: item._id } });
      }}
      activeOpacity={0.9}
      style={[styles.busCard, { backgroundColor: theme.card }]}
    >
      <View style={styles.busCardHeader}>
        <Text style={[styles.busNumber, { color: theme.text }]}>{item.busNumber}</Text>
        <View style={[styles.busTypeBadge, { backgroundColor: getBusTypeColor() }]}>
          <Text style={styles.busTypeText}>{item.busType.toUpperCase()}</Text>
        </View>
      </View>

      <Text style={[styles.busName, { color: theme.text }]} numberOfLines={1}>
        {item.name.trim()}
      </Text>

      <View style={styles.busDetailsContainer}>
        <View style={styles.busDetailRow}>
          <Ionicons name="bus-outline" size={16} color={theme.tabIconDefault} />
          <Text style={[styles.busDetailText, { color: theme.text }]}>
            {item.registrationNumber}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function MyBuses() {
  const theme = Colors[useColorScheme() ?? 'light'];
  const navigation = useNavigation();
  const { myBus, loading, fetchMyBus } = useBusStore();

  useEffect(() => {
    fetchMyBus();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Header */}
      <View style={[styles.headerContainer, { backgroundColor: theme.background }]}>
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

          <Text style={[styles.headerText, { color: theme.text }]}>Your bus & Stops</Text>

          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.navigate('/(protected)/add-bus-stops');
            }}
            style={[styles.menuButton, { backgroundColor: theme.card }]}
          >
            <Ionicons name="add" size={24} color={theme.tint} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {loading ? (
          <ActivityIndicator size="large" color={theme.tint} style={{ marginTop: 40 }} />
        ) : !myBus || myBus.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="bus-outline" size={64} color={theme.tabIconDefault} />
            <Text style={[styles.emptyStateText, { color: theme.text }]}>
              No buses found. Add your first bus!
            </Text>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: theme.tint }]}
              onPress={() => router.navigate('/(protected)/add-bus')}
            >
              <Text style={styles.addButtonText}>Add Bus</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlashList
            data={myBus}
            renderItem={({ item }) => <BusCard item={item} />}
            keyExtractor={(item) => item._id!}
            estimatedItemSize={150}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            onRefresh={fetchMyBus}
            refreshing={loading}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  headerContainer: {
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 20,
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
    paddingBottom: 20,
  },
  busCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  busCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  busName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  busNumber: {
    fontSize: 16,
    fontWeight: '500',
  },
  busTypeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  busTypeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  busDetailsContainer: {
    marginBottom: 12,
  },
  busDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  busDetailText: {
    marginLeft: 8,
    fontSize: 14,
  },
  busFeaturesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  featureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  featureText: {
    marginLeft: 4,
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  addButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
