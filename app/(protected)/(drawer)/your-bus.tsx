// components/BusList.tsx
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { router, useNavigation } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { FlashList } from '@shopify/flash-list';
import { SwipeableBusCard as BusCard } from '@/components/ui/BusCard';
import { useBusStore } from '@/store/useBusStore';

export default function BusList() {
  const theme = Colors[useColorScheme() ?? 'light'];
  const navigation = useNavigation();
  const { myBus, loading, fetchMyBus, deleteBus } = useBusStore();

  useEffect(() => {
    fetchMyBus();
  }, []);

  const handleDeleteBus = async (busId: string) => {
    try {
      await deleteBus(busId);
    } catch (error) {
      Alert.alert('Deletion Failed', 'Unable to delete the bus. Please try again later.');
      console.error('Error deleting bus:', error);
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
              navigation.openDrawer();
            }}
            style={[styles.menuButton, { backgroundColor: theme.card }]}
          >
            <Ionicons name="menu" size={24} color={theme.tint} />
          </TouchableOpacity>

          <Text style={[styles.headerText, { color: theme.text }]}>Your Buses</Text>

          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.navigate('/(protected)/add-bus');
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
            renderItem={({ item }) => <BusCard item={item} onDelete={handleDeleteBus} />}
            keyExtractor={(item) => item._id!}
            estimatedItemSize={150}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            onRefresh={fetchMyBus}
            refreshing={loading}
            ListHeaderComponent={() => (
              <Text
                style={{
                  color: theme.tabIconDefault,
                  fontSize: 14,
                  marginBottom: 12,
                  textAlign: 'center',
                }}
              >
                Swipe left to delete any bus.
              </Text>
            )}
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
    paddingBottom: 1,
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
    fontFamily: 'Inter_700Bold',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
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

// import React, { useEffect, useState } from 'react';
// import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
// import { router, useNavigation } from 'expo-router';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import * as Haptics from 'expo-haptics';
// import { Ionicons } from '@expo/vector-icons';
// import { useColorScheme } from 'react-native';
// import { Colors } from '@/constants/Colors';
// import axiosInstance from '@/api/axios';
// import { useAuthStore } from '@/store/useAuthStore';
// import { FlashList } from '@shopify/flash-list';
// import { SwipeableBusCard as BusCard } from '@/components/ui/BusCard';

// export default function BusList() {
//   const theme = Colors[useColorScheme() ?? 'light'];
//   const [isLoading, setIsLoading] = useState(false);
//   const [busData, setBusData] = useState<any[]>([]);

//   const navigation = useNavigation();
//   const { token } = useAuthStore();

//   const fetchData = async () => {
//     try {
//       setIsLoading(true);
//       const { data } = await axiosInstance.get('bus/my-buses', {
//         headers: {
//           token,
//           'Content-Type': 'Application/json',
//         },
//       });
//       setBusData(data.buses || []);
//     } catch (error) {
//       console.error('Error fetching bus data:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDeleteBus = async (busId: string) => {
//     try {
//       await axiosInstance.delete(`bus/delete/${busId}`, {
//         headers: { token },
//       });
//       setBusData(busData.filter((bus) => bus._id !== busId));
//     } catch (error) {
//       Alert.alert('Deletion Failed', 'Unable to delete the bus. Please try again later.');
//       console.error('Error deleting bus:', error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
//       {/* Header */}
//       <View style={[styles.headerContainer, { backgroundColor: theme.background }]}>
//         <View style={styles.header}>
//           <TouchableOpacity
//             onPress={() => {
//               Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
//               navigation.openDrawer();
//             }}
//             style={[styles.menuButton, { backgroundColor: theme.card }]}
//           >
//             <Ionicons name="menu" size={24} color={theme.tint} />
//           </TouchableOpacity>

//           <Text style={[styles.headerText, { color: theme.text }]}>Your Buses</Text>

//           <TouchableOpacity
//             onPress={() => {
//               Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
//               router.navigate('/(protected)/add-bus');
//             }}
//             style={[styles.menuButton, { backgroundColor: theme.card }]}
//           >
//             <Ionicons name="add" size={24} color={theme.tint} />
//           </TouchableOpacity>
//         </View>
//       </View>

//       <View style={[styles.container, { backgroundColor: theme.background }]}>
//         {isLoading ? (
//           <ActivityIndicator size="large" color={theme.tint} style={{ marginTop: 40 }} />
//         ) : busData.length === 0 ? (
//           <View style={styles.emptyState}>
//             <Ionicons name="bus-outline" size={64} color={theme.tabIconDefault} />
//             <Text style={[styles.emptyStateText, { color: theme.text }]}>
//               No buses found. Add your first bus!
//             </Text>
//             <TouchableOpacity
//               style={[styles.addButton, { backgroundColor: theme.tint }]}
//               onPress={() => router.navigate('/(protected)/add-bus')}
//             >
//               <Text style={styles.addButtonText}>Add Bus</Text>
//             </TouchableOpacity>
//           </View>
//         ) : (
//           <FlashList
//             data={busData}
//             renderItem={({ item }) => <BusCard item={item} onDelete={handleDeleteBus} />}
//             keyExtractor={(item) => item._id}
//             estimatedItemSize={150}
//             contentContainerStyle={styles.listContainer}
//             showsVerticalScrollIndicator={false}
//             onRefresh={() => {
//               setIsLoading(true);
//               fetchData();
//             }}
//             refreshing={isLoading}
//             ListHeaderComponent={() => (
//               <Text
//                 style={{
//                   color: theme.tabIconDefault,
//                   fontSize: 14,
//                   marginBottom: 12,
//                   textAlign: 'center',
//                 }}
//               >
//                 Swipe left for delete any bus.
//               </Text>
//             )}
//             ListEmptyComponent={() => (
//               <View style={styles.emptyState}>
//                 <Ionicons name="bus-outline" size={64} color={theme.tabIconDefault} />
//                 <Text style={[styles.emptyStateText, { color: theme.text }]}>
//                   No buses found. Add your first bus!
//                 </Text>
//                 <TouchableOpacity
//                   style={[styles.addButton, { backgroundColor: theme.tint }]}
//                   onPress={() => router.navigate('/(protected)/add-bus')}
//                 >
//                   <Text style={styles.addButtonText}>Add Bus</Text>
//                 </TouchableOpacity>
//               </View>
//             )}
//           />
//         )}
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 16,
//   },
//   headerContainer: {
//     paddingTop: 16,
//     paddingBottom: 1,
//     paddingHorizontal: 20,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   menuButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 2,
//   },
//   headerText: {
//     fontSize: 24,
//     fontWeight: '700',
//     fontFamily: 'Inter_700Bold',
//   },
//   listContainer: {
//     paddingHorizontal: 20,
//     paddingBottom: 20,
//   },
//   busCard: {
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 2,
//   },
//   busCardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 5,
//   },
//   busName: {
//     fontSize: 25,
//     fontWeight: '600',
//     marginBottom: 20,
//     textTransform: 'capitalize',
//   },
//   busNumber: {
//     fontSize: 18,
//     fontWeight: '400',
//   },
//   busTypeBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   busTypeText: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   busDetailsContainer: {
//     marginBottom: 12,
//   },
//   busDetailRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   busDetailText: {
//     marginLeft: 8,
//     fontSize: 14,
//   },
//   busFeaturesContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginTop: 8,
//   },
//   featureBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 16,
//     marginBottom: 4,
//   },
//   featureText: {
//     marginLeft: 4,
//     fontSize: 14,
//   },
//   emptyState: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 40,
//   },
//   emptyStateText: {
//     fontSize: 18,
//     textAlign: 'center',
//     marginTop: 16,
//     marginBottom: 24,
//   },
//   addButton: {
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 12,
//   },
//   addButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });
