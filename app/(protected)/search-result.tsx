import React from 'react';
import { useNavigation, useLocalSearchParams } from 'expo-router';
import { SafeAreaView, View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { format } from 'date-fns';
import { getBusTypeColor } from '@/utils/getBusTypeColor';

interface Schedule {
  _id: string;
  bus: {
    _id: string;
    name: string;
    registrationNumber: string;
    busNumber: string;
    busType: string;
    seatCapacity: number;
    isAC: boolean;
    isExpress: boolean;
  };
  schedule: {
    stand: {
      _id: string;
      name: string;
      distance: number;
      price: number;
    };
    arrivalTime: string;
    _id: string;
  }[];
  sourceTime: string;
  destinationTime: string;
  duration: string;
}

export default function SearchResultsScreen() {
  const navigation = useNavigation();
  const theme = Colors[useColorScheme() ?? 'light'];
  const { top } = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    from: string;
    to: string;
    schedules: string;
  }>();

  // Parse the schedules from string to array
  const schedules: Schedule[] = params.schedules ? JSON.parse(params.schedules) : [];
  const from = params.from || 'Unknown';
  const to = params.to || 'Unknown';

  const formatTime = (timeString: string) => {
    try {
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      return format(date, 'hh:mm a');
    } catch {
      return timeString;
    }
  };

  const renderItem = ({ item }: { item: Schedule }) => (
    <TouchableOpacity
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        navigation.navigate('bus-details', { schedule: JSON.stringify(item) });
      }}
      style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
      activeOpacity={0.9}
    >
      <View style={styles.cardHeader}>
        <View>
          <Text style={[styles.busName, { color: theme.text }]}>{item.bus.name}</Text>
          <View style={styles.busDetails}>
            <View
              style={[styles.busTypeBadge, { backgroundColor: getBusTypeColor(item.bus.busType) }]}
            >
              <Text style={styles.busTypeText}>{item.bus.busType.toUpperCase()}</Text>
            </View>
            <Text style={[styles.busNumber, { color: theme.icon }]}>{item.bus.busNumber}</Text>
          </View>
        </View>

        <View style={styles.priceContainer}>
          <Text style={[styles.price, { color: theme.tint }]}>
            ₹{item.schedule[item.schedule.length - 1].stand.price.toFixed(2)}
          </Text>
          <Text style={[styles.duration, { color: theme.icon }]}>{item.duration}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.timeContainer}>
          <Text style={[styles.time, { color: theme.text }]}>{formatTime(item.sourceTime)}</Text>
          <Text style={[styles.label, { color: theme.icon }]}>Departure</Text>
        </View>

        <View style={styles.stopsIndicator}>
          <View style={[styles.stopDot, { backgroundColor: theme.tint }]} />
          <View style={[styles.stopLine, { backgroundColor: theme.icon }]} />
          <View style={[styles.stopDot, { backgroundColor: theme.tint }]} />
        </View>

        <View style={styles.timeContainer}>
          <Text style={[styles.time, { color: theme.text }]}>
            {formatTime(item.destinationTime)}
          </Text>
          <Text style={[styles.label, { color: theme.icon }]}>Arrival</Text>
        </View>
      </View>

      <View style={styles.stopsContainer}>
        <Ionicons name="bus" size={16} color={theme.icon} />
        <Text style={[styles.stopsText, { color: theme.text }]}>
          {item.schedule.length} stops • {item.bus.seatCapacity} seats
        </Text>
        {item.bus.isAC && (
          <View style={styles.acBadge}>
            <Ionicons name="snow" size={14} color="#03A9F4" />
            <Text style={styles.acText}>AC</Text>
          </View>
        )}
        {item.bus.isExpress && (
          <View style={styles.expressBadge}>
            <Ionicons name="rocket" size={14} color="#FF5722" />
            <Text style={styles.expressText}>Express</Text>
          </View>
        )}
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
            borderBottomColor: theme.border,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            navigation.goBack();
          }}
        >
          <Ionicons name="arrow-back" size={24} color={theme.tint} />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>
            {from}
          </Text>
          <Ionicons name="arrow-forward" size={16} color={theme.icon} />
          <Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>
            {to}
          </Text>
        </View>

        <View style={{ width: 24 }} />
      </View>

      {schedules.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="bus-outline" size={48} color={theme.icon} />
          <Text style={[styles.emptyText, { color: theme.text }]}>
            No buses found for this route
          </Text>
        </View>
      ) : (
        <FlatList
          data={schedules}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  headerTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    maxWidth: '40%',
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    opacity: 0.7,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  busName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  busDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  busTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
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
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  duration: {
    fontSize: 14,
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timeContainer: {
    alignItems: 'center',
    minWidth: 80,
  },
  time: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    opacity: 0.7,
  },
  stopsIndicator: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  stopDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stopLine: {
    flex: 1,
    height: 1,
    marginHorizontal: 4,
  },
  stopsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  stopsText: {
    fontSize: 14,
    marginLeft: 8,
    marginRight: 12,
  },
  acBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(3, 169, 244, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  acText: {
    fontSize: 12,
    color: '#03A9F4',
    marginLeft: 4,
  },
  expressBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 87, 34, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  expressText: {
    fontSize: 12,
    color: '#FF5722',
    marginLeft: 4,
  },
});

// import React from 'react';
// import { useNavigation, useLocalSearchParams } from 'expo-router';
// import { SafeAreaView, View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useColorScheme } from 'react-native';
// import { Colors } from '@/constants/Colors';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import BusCard from '@/components/search/BusCard';

// export default function SearchResult() {
//   const navigation = useNavigation();
//   const theme = Colors[useColorScheme() ?? 'light'];
//   const { from, to, schedules } = useLocalSearchParams<{
//     from: string;
//     to: string;
//     schedules: string; // received as JSON string
//   }>();
//   const { top } = useSafeAreaInsets();

//   const parsedSchedules = schedules ? JSON.parse(schedules) : [];

//   return (
//     <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
//       <View
//         style={[
//           styles.header,
//           {
//             backgroundColor: theme.background,
//             paddingTop: top + 15,
//             borderBottomColor: theme.card,
//           },
//         ]}
//       >
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color={theme.tint} />
//         </TouchableOpacity>
//         <Text style={[styles.headerTitle, { color: theme.text }]}>
//           {from && to ? `${from} → ${to}` : 'Search Results'}
//         </Text>
//         <View style={{ width: 24 }} />
//       </View>

//       <FlatList
//         data={parsedSchedules}
//         keyExtractor={(item) => item._id}
//         renderItem={({ item }) => (
//           <BusCard
//             item={item}
//             theme={theme}
//             onPress={() => navigation.navigate('bus-details', { ...item })}
//           />
//         )}
//         contentContainerStyle={styles.list}
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingBottom: 16,
//     justifyContent: 'space-between',
//     borderBottomWidth: 1,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   list: {
//     paddingHorizontal: 20,
//     paddingTop: 16,
//     paddingBottom: 32,
//   },
// });
