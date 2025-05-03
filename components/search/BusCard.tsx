// // components/BusCard.tsx
// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// export default function BusCard({ item, theme, onPress }: any) {
//   const bus = item.bus;
//   const source = item.schedule[0];
//   const destination = item.schedule[item.schedule.length - 1];

//   return (
//     <TouchableOpacity
//       onPress={onPress}
//       style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
//     >
//       <View style={styles.cardHeader}>
//         <Text style={[styles.busName, { color: theme.text }]}>{bus.name}</Text>
//         <Text style={[styles.price, { color: theme.tint }]}>₹{source.stand.price ?? 0}</Text>
//       </View>

//       <View style={styles.cardBody}>
//         <View>
//           <Text style={[styles.time, { color: theme.text }]}>{item.sourceTime}</Text>
//           <Text style={[styles.label, { color: theme.icon }]}>Departure</Text>
//         </View>
//         <Ionicons name="arrow-forward" size={20} color={theme.icon} />
//         <View>
//           <Text style={[styles.time, { color: theme.text }]}>{item.destinationTime}</Text>
//           <Text style={[styles.label, { color: theme.icon }]}>Arrival</Text>
//         </View>
//       </View>

//       <Text style={[styles.duration, { color: theme.icon }]}>Duration: {item.duration}</Text>
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   card: {
//     borderRadius: 12,
//     borderWidth: 1,
//     padding: 16,
//     marginBottom: 16,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 12,
//   },
//   busName: {
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   price: {
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   cardBody: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   time: {
//     fontSize: 15,
//     fontWeight: '500',
//   },
//   label: {
//     fontSize: 12,
//     opacity: 0.7,
//   },
//   duration: {
//     marginTop: 10,
//     fontSize: 13,
//   },
// });
