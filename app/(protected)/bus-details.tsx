import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BusDetails() {
  const theme = Colors[useColorScheme() ?? 'light'];
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();

  const { busName, departure, arrival, duration, price, stops } = useLocalSearchParams<{
    busName: string;
    departure: string;
    arrival: string;
    duration: string;
    price: string;
    stops: string[];
  }>();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.background,
            paddingTop: top + 15,
            borderBottomColor: theme.card,
          },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.tint} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Bus Details</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Title */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.busName, { color: theme.text }]}>{busName}</Text>
          <Text style={[styles.price, { color: theme.tint }]}>{price}</Text>
        </View>

        {/* Journey Info */}
        <View style={[styles.infoBox, { borderColor: theme.border }]}>
          <View style={styles.timeSection}>
            <Text style={[styles.timeText, { color: theme.text }]}>{departure}</Text>
            <Text style={[styles.label, { color: theme.icon }]}>Departure</Text>
          </View>
          <Ionicons name="arrow-forward" size={20} color={theme.icon} />
          <View style={styles.timeSection}>
            <Text style={[styles.timeText, { color: theme.text }]}>{arrival}</Text>
            <Text style={[styles.label, { color: theme.icon }]}>Arrival</Text>
          </View>
        </View>

        {/* Duration */}
        <View style={styles.durationRow}>
          <Ionicons name="time-outline" size={18} color={theme.icon} />
          <Text style={[styles.durationText, { color: theme.text }]}>Duration: {duration}</Text>
        </View>

        {/* Stops */}
        <View style={styles.stopsSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Stops</Text>
          {stops?.length ? (
            (stops as string[]).map((stop, idx) => (
              <View key={idx} style={styles.stopItem}>
                <Ionicons name="bus-outline" size={18} color={theme.icon} />
                <Text style={[styles.stopText, { color: theme.text }]}>{stop}</Text>
              </View>
            ))
          ) : (
            <Text style={[styles.emptyText, { color: theme.icon }]}>No stop info available</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  busName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  timeSection: {
    alignItems: 'center',
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  label: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 2,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  durationText: {
    fontSize: 15,
    marginLeft: 6,
  },
  stopsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  stopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  stopText: {
    fontSize: 15,
    marginLeft: 8,
  },
  emptyText: {
    fontSize: 14,
    opacity: 0.6,
  },
});
