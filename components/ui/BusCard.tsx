import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { GestureDetector, Gesture, Directions } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

export const SwipeableBusCard = ({
  item,
  onDelete,
}: {
  item: any;
  onDelete: (id: string) => void;
}) => {
  const theme = Colors[useColorScheme() ?? 'light'];
  const translateX = useSharedValue(0);
  const deleteWidth = -100; // Width of delete area

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

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((e) => {
      // Only allow swiping to the left
      if (e.translationX < 0) {
        translateX.value = e.translationX;
      }
    })
    .onEnd((e) => {
      if (e.translationX < deleteWidth / 2) {
        translateX.value = withSpring(deleteWidth);
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const deleteButtonStyle = useAnimatedStyle(() => ({
    opacity: translateX.value < -20 ? 1 : 0,
    transform: [{ translateX: translateX.value + 100 }],
  }));

  const handleDelete = () => {
    onDelete(item._id);
    translateX.value = withSpring(0);
  };

  return (
    <View style={styles.swipeableContainer}>
      {/* Delete button (hidden behind the card) */}
      <Animated.View
        style={[styles.deleteButton, { backgroundColor: theme.alert }, deleteButtonStyle]}
      >
        <Pressable onPress={() => runOnJS(handleDelete)()}>
          <Ionicons name="trash" size={24} color="white" />
        </Pressable>
      </Animated.View>

      {/* Main card */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.busCard, { backgroundColor: theme.card }, animatedStyles]}>
          <View style={styles.busCardHeader}>
            <Text style={[styles.busNumber, { color: theme.text }]}>{item.busNumber}</Text>
            <View style={[styles.busTypeBadge, { backgroundColor: getBusTypeColor() }]}>
              <Text style={styles.busTypeText}>{item.busType.toUpperCase()}</Text>
            </View>
          </View>

          <Text style={[styles.busName, { color: theme.text }]}>{item.name.trim()}</Text>

          <View style={styles.busDetailsContainer}>
            <View style={styles.busDetailRow}>
              <Ionicons name="bus" size={16} color={theme.tabIconDefault} />
              <Text style={[styles.busDetailText, { color: theme.text }]}>
                {item.registrationNumber}
              </Text>
            </View>
          </View>

          <View style={styles.busFeaturesContainer}>
            <View style={styles.featureBadge}>
              <Ionicons
                name={item.isAC ? 'snow' : 'snow-outline'}
                size={16}
                color={item.isAC ? '#03A9F4' : theme.tabIconDefault}
              />
              <Text style={[styles.featureText, { color: item.isAC ? '#03A9F4' : theme.text }]}>
                AC
              </Text>
            </View>

            <View style={styles.featureBadge}>
              <Ionicons
                name={item.isExpress ? 'rocket' : 'rocket-outline'}
                size={16}
                color={item.isExpress ? '#FF5722' : theme.tabIconDefault}
              />
              <Text
                style={[styles.featureText, { color: item.isExpress ? '#FF5722' : theme.text }]}
              >
                Express
              </Text>
            </View>

            <View style={styles.featureBadge}>
              <Ionicons name="people" size={16} color={theme.tabIconDefault} />
              <Text style={[styles.featureText, { color: theme.text }]}>
                {item.seatCapacity} seats
              </Text>
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  swipeableContainer: {
    position: 'relative',
    overflow: 'visible',
    marginBottom: 16,
  },
  busCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  deleteButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  busCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  busName: {
    fontSize: 25,
    fontWeight: '600',
    marginBottom: 20,
    textTransform: 'capitalize',
  },
  busNumber: {
    fontSize: 18,
    fontWeight: '400',
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
});

// import { Colors } from '@/constants/Colors';
// import { Ionicons } from '@expo/vector-icons';
// import { useColorScheme } from 'react-native';
// import { StyleSheet, Text } from 'react-native';
// import { View } from 'react-native';

// export const BusCard = ({ item }: { item: any }) => {
//   const theme = Colors[useColorScheme() ?? 'light'];

//   const getBusTypeColor = () => {
//     switch (item.busType) {
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

//   return (
//     <View style={[styles.busCard, { backgroundColor: theme.card }]}>
//       <View style={styles.busCardHeader}>
//         <Text style={[styles.busNumber, { color: theme.text }]}>{item.busNumber}</Text>
//         <View style={[styles.busTypeBadge, { backgroundColor: getBusTypeColor() }]}>
//           <Text style={styles.busTypeText}>{item.busType.toUpperCase()}</Text>
//         </View>
//       </View>

//       <Text style={[styles.busName, { color: theme.text }]}>{item.name.trim()}</Text>

//       <View style={styles.busDetailsContainer}>
//         <View style={styles.busDetailRow}>
//           <Ionicons name="bus" size={16} color={theme.tabIconDefault} />
//           <Text style={[styles.busDetailText, { color: theme.text }]}>
//             {item.registrationNumber}
//           </Text>
//         </View>
//       </View>

//       <View style={styles.busFeaturesContainer}>
//         <View style={styles.featureBadge}>
//           <Ionicons
//             name={item.isAC ? 'snow' : 'snow-outline'}
//             size={16}
//             color={item.isAC ? '#03A9F4' : theme.tabIconDefault}
//           />
//           <Text style={[styles.featureText, { color: item.isAC ? '#03A9F4' : theme.text }]}>
//             AC
//           </Text>
//         </View>

//         <View style={styles.featureBadge}>
//           <Ionicons
//             name={item.isExpress ? 'rocket' : 'rocket-outline'}
//             size={16}
//             color={item.isExpress ? '#FF5722' : theme.tabIconDefault}
//           />
//           <Text style={[styles.featureText, { color: item.isExpress ? '#FF5722' : theme.text }]}>
//             Express
//           </Text>
//         </View>

//         <View style={styles.featureBadge}>
//           <Ionicons name="people" size={16} color={theme.tabIconDefault} />
//           <Text style={[styles.featureText, { color: theme.text }]}>{item.seatCapacity} seats</Text>
//         </View>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 16,
//   },
//   headerContainer: {
//     paddingTop: 16,
//     paddingBottom: 12,
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
