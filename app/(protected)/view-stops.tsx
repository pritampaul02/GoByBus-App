import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { useBusStopStore } from '@/store/useBusStopStore';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import * as Haptics from 'expo-haptics';
import { format } from 'date-fns';
import { SafeAreaView } from 'react-native-safe-area-context';

const ViewStops = () => {
  const { busId } = useLocalSearchParams();
  const { fetchSchedules, schedulesByBus, loading } = useBusStopStore();
  const theme = Colors[useColorScheme() ?? 'light'];
  const schedule = schedulesByBus[busId.toString()];

  useEffect(() => {
    fetchSchedules(busId.toString());
  }, [busId]);

  const formatTime = (timeString: string) => {
    try {
      return format(new Date(timeString), 'hh:mm a');
    } catch {
      return timeString;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Header */}
      <View style={[styles.headerContainer, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.back();
            }}
            style={[styles.menuButton]}
          >
            <Ionicons name="arrow-back" size={24} color={theme.tint} />
          </TouchableOpacity>

          <Text style={[styles.headerText, { color: theme.text }]}>Bus Schedule</Text>
        </View>
      </View>

      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {loading ? (
          <ActivityIndicator size="large" color={theme.tint} style={styles.loader} />
        ) : !schedule ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="time-outline" size={48} color={theme.tabIconDefault} />
            <Text style={[styles.emptyText, { color: theme.text }]}>
              No schedule available for this bus
            </Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* Schedule Overview */}
            <View style={[styles.overviewCard, { backgroundColor: theme.card }]}>
              <View style={styles.overviewRow}>
                <Ionicons name="time-outline" size={20} color={theme.tint} />
                <Text style={[styles.overviewText, { color: theme.text }]}>
                  {schedule.departureTime
                    ? `Departs at ${formatTime(schedule.departureTime)}`
                    : 'No departure time'}
                </Text>
              </View>

              <View style={styles.overviewRow}>
                <Ionicons name="time-outline" size={20} color={theme.tint} />
                <Text style={[styles.overviewText, { color: theme.text }]}>
                  {schedule.arrivalTime
                    ? `Arrives at ${formatTime(schedule.arrivalTime)}`
                    : 'No arrival time'}
                </Text>
              </View>

              {schedule.fare && (
                <View style={styles.overviewRow}>
                  <Ionicons name="cash-outline" size={20} color={theme.tint} />
                  <Text style={[styles.overviewText, { color: theme.text }]}>
                    Total fare: ₹{schedule.fare.toFixed(2)}
                  </Text>
                </View>
              )}
            </View>

            {/* Stops List */}
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Stops</Text>

            {schedule.schedule.map((stop, index) => (
              <View key={stop._id} style={[styles.stopCard, { backgroundColor: theme.card }]}>
                <View style={styles.stopHeader}>
                  <View style={[styles.stopNumber, { backgroundColor: theme.tint }]}>
                    <Text style={styles.stopNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={[styles.stopName, { color: theme.text }]}>{stop.stand.name}</Text>
                </View>

                <View style={styles.stopDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons name="time-outline" size={16} color={theme.tabIconDefault} />
                    <Text style={[styles.detailText, { color: theme.text }]}>
                      {formatTime(stop.arrivalTime)}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Ionicons name="location-outline" size={16} color={theme.tabIconDefault} />
                    <Text style={[styles.detailText, { color: theme.text }]}>
                      {stop.stand.distance} km
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Ionicons name="cash-outline" size={16} color={theme.tabIconDefault} />
                    <Text style={[styles.detailText, { color: theme.text }]}>
                      ₹{stop.stand.price.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    width: 40,
    height: 40,
    marginRight: 15,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
    fontFamily: 'Inter_500Medium',
  },
  overviewCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  overviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  overviewText: {
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  stopCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  stopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stopNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stopNumberText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
  stopName: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
    flex: 1,
  },
  stopDetails: {
    marginLeft: 40,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
});

export default ViewStops;
