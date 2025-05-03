import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { format } from 'date-fns';
import axiosInstance from '@/api/axios';
import { useAuthStore } from '@/store/useAuthStore';
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

export default function BusDetailsScreen() {
  const theme = Colors[useColorScheme() ?? 'light'];
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();
  const { schedule } = useLocalSearchParams<{ schedule: string }>();
  const token = useAuthStore((state) => state.token);

  // Parse the schedule data
  const scheduleData: Schedule = schedule ? JSON.parse(schedule) : null;
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);

  // Check if bus is favorite on mount
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const response = await axiosInstance.get('user/favorites', {
          headers: { token },
        });
        const favorites = response.data.favorites || [];
        setIsFavorite(favorites.some((fav: any) => fav._id === scheduleData?.bus._id));
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };

    if (scheduleData && token) {
      checkFavoriteStatus();
    }
  }, [scheduleData, token]);

  const toggleFavorite = async () => {
    if (!scheduleData || !token || loadingFavorite) return;

    setLoadingFavorite(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      if (isFavorite) {
        // Remove from favorites
        await axiosInstance.delete(`user/favorites/${scheduleData.bus._id}`, {
          headers: { token },
        });
      } else {
        // Add to favorites
        await axiosInstance.post(
          'user/favorites/add',
          { busId: scheduleData.bus._id },
          { headers: { token } },
        );
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoadingFavorite(false);
    }
  };

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

  if (!scheduleData) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.text }]}>No bus data available</Text>
      </SafeAreaView>
    );
  }

  const totalPrice = scheduleData.schedule[scheduleData.schedule.length - 1].stand.price.toFixed(2);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
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
        <Text style={[styles.headerTitle, { color: theme.text }]}>Bus Details</Text>
        {loadingFavorite ? (
          <ActivityIndicator size={'small'} color={theme.alert} />
        ) : (
          <TouchableOpacity onPress={toggleFavorite} disabled={loadingFavorite}>
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={isFavorite ? theme.alert : theme.icon}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Bus Info Card */}
        <View style={[styles.busInfoCard, { backgroundColor: theme.card }]}>
          <View>
            <Text style={[styles.busName, { color: theme.text }]}>{scheduleData.bus.name}</Text>
            <View style={styles.busDetailsRow}>
              <View
                style={[
                  styles.busTypeBadge,
                  { backgroundColor: getBusTypeColor(scheduleData.bus.busType) },
                ]}
              >
                <Text style={styles.busTypeText}>{scheduleData.bus.busType.toUpperCase()}</Text>
              </View>
              <Text style={[styles.busNumber, { color: theme.icon }]}>
                {scheduleData.bus.busNumber}
              </Text>
              <Text style={[styles.registration, { color: theme.icon }]}>
                {scheduleData.bus.registrationNumber}
              </Text>
            </View>
          </View>

          <View style={styles.priceContainer}>
            <Text style={[styles.price, { color: theme.tint }]}>₹{totalPrice}</Text>
            <Text style={[styles.seats, { color: theme.icon }]}>
              {scheduleData.bus.seatCapacity} seats
            </Text>
          </View>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          {scheduleData.bus.isAC && (
            <View style={[styles.featureBadge, { backgroundColor: theme.card }]}>
              <Ionicons name="snow" size={16} color="#03A9F4" />
              <Text style={[styles.featureText, { color: theme.text }]}>AC</Text>
            </View>
          )}
          {scheduleData.bus.isExpress && (
            <View style={[styles.featureBadge, { backgroundColor: theme.card }]}>
              <Ionicons name="rocket" size={16} color="#FF5722" />
              <Text style={[styles.featureText, { color: theme.text }]}>Express</Text>
            </View>
          )}
        </View>

        {/* Journey Timeline */}
        <View style={[styles.timelineCard, { backgroundColor: theme.card }]}>
          <View style={styles.timelineHeader}>
            <Text style={[styles.timelineTitle, { color: theme.text }]}>Journey Timeline</Text>
            <Text style={[styles.duration, { color: theme.icon }]}>{scheduleData.duration}</Text>
          </View>

          <View style={styles.timelineContent}>
            <View style={styles.timeSection}>
              <Text style={[styles.timeText, { color: theme.text }]}>
                {formatTime(scheduleData.sourceTime)}
              </Text>
              <Text style={[styles.locationText, { color: theme.text }]}>
                {scheduleData.schedule[0].stand.name}
              </Text>
            </View>

            <View style={styles.stopsIndicator}>
              <View style={[styles.stopDot, { backgroundColor: theme.tint }]} />
              <View style={[styles.stopLine, { backgroundColor: theme.icon }]} />
              <View style={[styles.stopDot, { backgroundColor: theme.tint }]} />
            </View>

            <View style={styles.timeSection}>
              <Text style={[styles.timeText, { color: theme.text }]}>
                {formatTime(scheduleData.destinationTime)}
              </Text>
              <Text style={[styles.locationText, { color: theme.text }]}>
                {scheduleData.schedule[scheduleData.schedule.length - 1].stand.name}
              </Text>
            </View>
          </View>
        </View>

        {/* All Stops */}
        <View style={[styles.stopsCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            All Stops ({scheduleData.schedule.length})
          </Text>

          {scheduleData.schedule.map((stop, index) => (
            <View key={stop._id} style={styles.stopItem}>
              <View style={styles.stopLeft}>
                <View style={[styles.stopNumber, { backgroundColor: theme.tint }]}>
                  <Text style={styles.stopNumberText}>{index + 1}</Text>
                </View>
                <Text style={[styles.stopName, { color: theme.text }]}>{stop.stand.name}</Text>
              </View>
              <View style={styles.stopRight}>
                <Text style={[styles.stopTime, { color: theme.text }]}>
                  {formatTime(stop.arrivalTime)}
                </Text>
                {index !== 0 && (
                  <Text style={[styles.stopPrice, { color: theme.tint }]}>
                    ₹{stop.stand.price.toFixed(2)}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ... (keep your existing styles)

// import React from 'react';
// import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
// import { useLocalSearchParams, useNavigation } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import { useColorScheme } from 'react-native';
// import { Colors } from '@/constants/Colors';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import * as Haptics from 'expo-haptics';
// import { format } from 'date-fns';

// interface Schedule {
//   _id: string;
//   bus: {
//     _id: string;
//     name: string;
//     registrationNumber: string;
//     busNumber: string;
//     busType: string;
//     seatCapacity: number;
//     isAC: boolean;
//     isExpress: boolean;
//   };
//   schedule: {
//     stand: {
//       _id: string;
//       name: string;
//       distance: number;
//       price: number;
//     };
//     arrivalTime: string;
//     _id: string;
//   }[];
//   sourceTime: string;
//   destinationTime: string;
//   duration: string;
// }

// export default function BusDetailsScreen() {
//   const theme = Colors[useColorScheme() ?? 'light'];
//   const navigation = useNavigation();
//   const { top } = useSafeAreaInsets();
//   const { schedule } = useLocalSearchParams<{ schedule: string }>();

//   // Parse the schedule data
//   const scheduleData: Schedule = schedule ? JSON.parse(schedule) : null;

//   if (!scheduleData) {
//     return (
//       <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
//         <Text style={[styles.errorText, { color: theme.text }]}>No bus data available</Text>
//       </SafeAreaView>
//     );
//   }

//   const formatTime = (timeString: string) => {
//     try {
//       const [hours, minutes] = timeString.split(':');
//       const date = new Date();
//       date.setHours(parseInt(hours, 10));
//       date.setMinutes(parseInt(minutes, 10));
//       return format(date, 'hh:mm a');
//     } catch {
//       return timeString;
//     }
//   };

//   const getBusTypeColor = (type: string) => {
//     switch (type.toLowerCase()) {
//       case 'volvo':
//         return '#4CAF50';
//       case 'mini':
//         return '#2196F3';
//       case 'sleeper':
//         return '#9C27B0';
//       default:
//         return '#607D8B';
//     }
//   };

//   const totalPrice = scheduleData.schedule[scheduleData.schedule.length - 1].stand.price.toFixed(2);

//   return (
//     <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
//       {/* Header */}
//       <View
//         style={[
//           styles.header,
//           {
//             backgroundColor: theme.background,
//             paddingTop: top + 15,
//             borderBottomColor: theme.border,
//           },
//         ]}
//       >
//         <TouchableOpacity
//           onPress={() => {
//             Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
//             navigation.goBack();
//           }}
//         >
//           <Ionicons name="arrow-back" size={24} color={theme.tint} />
//         </TouchableOpacity>
//         <Text style={[styles.headerTitle, { color: theme.text }]}>Bus Details</Text>
//         <TouchableOpacity
//           onPress={() => {
//             Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
//           }}
//         >
//           <Ionicons name="heart-outline" size={24} color={theme.alert} />
//         </TouchableOpacity>
//       </View>

//       {/* Content */}
//       <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
//         {/* Bus Info Card */}
//         <View style={[styles.busInfoCard, { backgroundColor: theme.card }]}>
//           <View>
//             <Text style={[styles.busName, { color: theme.text }]}>{scheduleData.bus.name}</Text>
//             <View style={styles.busDetailsRow}>
//               <View
//                 style={[
//                   styles.busTypeBadge,
//                   { backgroundColor: getBusTypeColor(scheduleData.bus.busType) },
//                 ]}
//               >
//                 <Text style={styles.busTypeText}>{scheduleData.bus.busType.toUpperCase()}</Text>
//               </View>
//               <Text style={[styles.busNumber, { color: theme.icon }]}>
//                 {scheduleData.bus.busNumber}
//               </Text>
//               <Text style={[styles.registration, { color: theme.icon }]}>
//                 {scheduleData.bus.registrationNumber}
//               </Text>
//             </View>
//           </View>

//           <View style={styles.priceContainer}>
//             <Text style={[styles.price, { color: theme.tint }]}>₹{totalPrice}</Text>
//             <Text style={[styles.seats, { color: theme.icon }]}>
//               {scheduleData.bus.seatCapacity} seats
//             </Text>
//           </View>
//         </View>

//         {/* Features */}
//         <View style={styles.featuresContainer}>
//           {scheduleData.bus.isAC && (
//             <View style={[styles.featureBadge, { backgroundColor: theme.card }]}>
//               <Ionicons name="snow" size={16} color="#03A9F4" />
//               <Text style={[styles.featureText, { color: theme.text }]}>AC</Text>
//             </View>
//           )}
//           {scheduleData.bus.isExpress && (
//             <View style={[styles.featureBadge, { backgroundColor: theme.card }]}>
//               <Ionicons name="rocket" size={16} color="#FF5722" />
//               <Text style={[styles.featureText, { color: theme.text }]}>Express</Text>
//             </View>
//           )}
//         </View>

//         {/* Journey Timeline */}
//         <View style={[styles.timelineCard, { backgroundColor: theme.card }]}>
//           <View style={styles.timelineHeader}>
//             <Text style={[styles.timelineTitle, { color: theme.text }]}>Journey Timeline</Text>
//             <Text style={[styles.duration, { color: theme.icon }]}>{scheduleData.duration}</Text>
//           </View>

//           <View style={styles.timelineContent}>
//             <View style={styles.timeSection}>
//               <Text style={[styles.timeText, { color: theme.text }]}>
//                 {formatTime(scheduleData.sourceTime)}
//               </Text>
//               <Text style={[styles.locationText, { color: theme.text }]}>
//                 {scheduleData.schedule[0].stand.name}
//               </Text>
//             </View>

//             <View style={styles.stopsIndicator}>
//               <View style={[styles.stopDot, { backgroundColor: theme.tint }]} />
//               <View style={[styles.stopLine, { backgroundColor: theme.icon }]} />
//               <View style={[styles.stopDot, { backgroundColor: theme.tint }]} />
//             </View>

//             <View style={styles.timeSection}>
//               <Text style={[styles.timeText, { color: theme.text }]}>
//                 {formatTime(scheduleData.destinationTime)}
//               </Text>
//               <Text style={[styles.locationText, { color: theme.text }]}>
//                 {scheduleData.schedule[scheduleData.schedule.length - 1].stand.name}
//               </Text>
//             </View>
//           </View>
//         </View>

//         {/* All Stops */}
//         <View style={[styles.stopsCard, { backgroundColor: theme.card }]}>
//           <Text style={[styles.sectionTitle, { color: theme.text }]}>
//             All Stops ({scheduleData.schedule.length})
//           </Text>

//           {scheduleData.schedule.map((stop, index) => (
//             <View key={stop._id} style={styles.stopItem}>
//               <View style={styles.stopLeft}>
//                 <View style={[styles.stopNumber, { backgroundColor: theme.tint }]}>
//                   <Text style={styles.stopNumberText}>{index + 1}</Text>
//                 </View>
//                 <Text style={[styles.stopName, { color: theme.text }]}>{stop.stand.name}</Text>
//               </View>
//               <View style={styles.stopRight}>
//                 <Text style={[styles.stopTime, { color: theme.text }]}>
//                   {formatTime(stop.arrivalTime)}
//                 </Text>
//                 {index !== 0 && (
//                   <Text style={[styles.stopPrice, { color: theme.tint }]}>
//                     ₹{stop.stand.price.toFixed(2)}
//                   </Text>
//                 )}
//               </View>
//             </View>
//           ))}
//         </View>
//       </ScrollView>

//       {/* Book Button */}
//       {/* <TouchableOpacity
//         style={[styles.bookButton, { backgroundColor: theme.tint, opacity: 0.6 }]}
//         onPress={() => {
//           Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
//           // Navigate to booking screen
//         }}
//         disabled
//       > */}
//       {/* <Text style={[styles.bookButtonText, { color: theme.card }]}>Book Now</Text> */}
//       {/* <Text style={[styles.bookButtonText, { color: theme.card }]}>
//           Booking will come in future
//         </Text>
//       </TouchableOpacity> */}
//     </SafeAreaView>
//   );
// }

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
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  content: {
    padding: 20,
    paddingBottom: 80,
  },
  busInfoCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  busName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  busDetailsRow: {
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
    marginRight: 8,
    opacity: 0.8,
  },
  registration: {
    fontSize: 14,
    opacity: 0.6,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  seats: {
    fontSize: 14,
  },
  featuresContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  featureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  featureText: {
    fontSize: 14,
    marginLeft: 6,
  },
  timelineCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  duration: {
    fontSize: 14,
  },
  timelineContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeSection: {
    alignItems: 'center',
    width: '30%',
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    textAlign: 'center',
  },
  stopsIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '40%',
    justifyContent: 'center',
  },
  stopDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  stopLine: {
    flex: 1,
    height: 2,
    marginHorizontal: 8,
  },
  stopsCard: {
    borderRadius: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  stopItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  stopLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  stopNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stopNumberText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  stopName: {
    fontSize: 15,
    flex: 1,
  },
  stopRight: {
    alignItems: 'flex-end',
  },
  stopTime: {
    fontSize: 14,
    marginBottom: 4,
  },
  stopPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
  bookButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
