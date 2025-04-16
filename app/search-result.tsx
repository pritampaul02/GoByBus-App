import React from 'react';
import { useNavigation, useLocalSearchParams } from 'expo-router';
import { SafeAreaView, View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const dummyResults = [
  {
    id: '1',
    busName: 'Green Line Express',
    departure: '08:30 AM',
    arrival: '10:15 AM',
    duration: '1h 45m',
    price: '₹120',
    stops: ['Downtown', 'Central Park', 'Main Library'],
  },
  {
    id: '2',
    busName: 'Metro Transit',
    departure: '09:00 AM',
    arrival: '10:40 AM',
    duration: '1h 40m',
    price: '₹100',
    stops: ['Union Station', 'Airport'],
  },
];

export default function SearchResult() {
  const navigation = useNavigation();
  const theme = Colors[useColorScheme() ?? 'light'];
  const { from, to } = useLocalSearchParams<{ from: string; to: string }>();
  const { top } = useSafeAreaInsets();

  const renderItem = ({ item }: { item: (typeof dummyResults)[0] }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('bus-details', { ...item })}
      style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.busName, { color: theme.text }]}>{item.busName}</Text>
        <Text style={[styles.price, { color: theme.tint }]}>{item.price}</Text>
      </View>
      <View style={styles.cardBody}>
        <View>
          <Text style={[styles.time, { color: theme.text }]}>{item.departure}</Text>
          <Text style={[styles.label, { color: theme.icon }]}>Departure</Text>
        </View>
        <Ionicons name="arrow-forward" size={20} color={theme.icon} />
        <View>
          <Text style={[styles.time, { color: theme.text }]}>{item.arrival}</Text>
          <Text style={[styles.label, { color: theme.icon }]}>Arrival</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
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
        {from && to ? (
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            {from} → {to}
          </Text>
        ) : (
          <Text style={[styles.headerTitle, { color: theme.text }]}>Search Results</Text>
        )}
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={dummyResults}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
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
  list: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  busName: {
    fontSize: 16,
    fontWeight: '600',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  time: {
    fontSize: 15,
    fontWeight: '500',
  },
  label: {
    fontSize: 12,
    opacity: 0.7,
  },
});
