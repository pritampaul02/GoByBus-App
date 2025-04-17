import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  FlatList,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import TheamedText from '@/components/global/TheamedText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

// Mock ticket data
const mockTickets = [
  {
    id: '1',
    busNumber: 'MB-101',
    from: 'Downtown',
    to: 'Airport',
    date: '15 Jun 2024',
    time: '08:30 AM',
    seats: ['A1', 'A2'],
    price: 900,
    status: 'upcoming',
    qrCode: 'https://example.com/qr/1',
  },
  {
    id: '2',
    busNumber: 'SB-205',
    from: 'Central Station',
    to: 'North Avenue',
    date: '10 Jun 2024',
    time: '02:15 PM',
    seats: ['B3'],
    price: 450,
    status: 'completed',
    qrCode: 'https://example.com/qr/2',
  },
  {
    id: '3',
    busNumber: 'SB-205',
    from: 'Central Station',
    to: 'North Avenue',
    date: '10 Jun 2024',
    time: '02:15 PM',
    seats: ['B3'],
    price: 450,
    status: 'completed',
    qrCode: 'https://example.com/qr/2',
  },
  {
    id: '4',
    busNumber: 'SB-205',
    from: 'Central Station',
    to: 'North Avenue',
    date: '10 Jun 2024',
    time: '02:15 PM',
    seats: ['B3'],
    price: 450,
    status: 'completed',
    qrCode: 'https://example.com/qr/2',
  },
];

const TicketHeader = () => {
  const theme = Colors[useColorScheme() ?? 'light'];
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();

  return (
    <View style={[styles.headerContainer, { paddingTop: top + 16 }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.openDrawer();
          }}
          style={[styles.menuButton, { backgroundColor: theme.card }]}
        >
          <Ionicons name="menu" size={24} color={theme.tint} />
        </TouchableOpacity>
        <TheamedText style={[styles.headerText, { color: theme.text }]}>Your Tickets</TheamedText>
      </View>
      <TheamedText style={[styles.subHeader, { color: theme.icon }]}>
        {mockTickets.length} active tickets
      </TheamedText>
    </View>
  );
};

const TicketCard = ({ ticket }: any) => {
  const theme = Colors[useColorScheme() ?? 'light'];
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={[styles.ticketCard, { backgroundColor: theme.card }]}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        // navigation.navigate('TicketDetails', { ticket });
      }}
    >
      <View style={styles.ticketHeader}>
        <View style={styles.busInfo}>
          <TheamedText style={[styles.busNumber, { color: theme.tint }]}>
            {ticket.busNumber}
          </TheamedText>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  ticket.status === 'upcoming'
                    ? 'rgba(46, 204, 113, 0.1)'
                    : 'rgba(156, 163, 175, 0.1)',
              },
            ]}
          >
            <TheamedText
              style={[
                styles.statusText,
                {
                  color: ticket.status === 'upcoming' ? theme.success : theme.icon,
                },
              ]}
            >
              {ticket.status === 'upcoming' ? 'Upcoming' : 'Completed'}
            </TheamedText>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={theme.icon} />
      </View>

      <View style={styles.routeContainer}>
        <View style={styles.routeInfo}>
          <TheamedText style={[styles.routeText, { color: theme.text }]}>{ticket.from}</TheamedText>
          <TheamedText style={[styles.routeTime, { color: theme.text }]}>{ticket.time}</TheamedText>
        </View>

        <View style={styles.routeMiddle}>
          <View style={[styles.durationLine, { backgroundColor: theme.tint }]} />
          <Ionicons name="bus" size={16} color={theme.tint} />
          <View style={[styles.durationLine, { backgroundColor: theme.tint }]} />
        </View>

        <View style={styles.routeInfo}>
          <TheamedText style={[styles.routeText, { color: theme.text }]}>{ticket.to}</TheamedText>
          <TheamedText style={[styles.routeDate, { color: theme.icon }]}>{ticket.date}</TheamedText>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <View style={styles.ticketFooter}>
        <View style={styles.seatsContainer}>
          <Ionicons name="people" size={16} color={theme.icon} />
          <TheamedText style={[styles.seatsText, { color: theme.text }]}>
            {ticket.seats.join(', ')}
          </TheamedText>
        </View>
        <TheamedText style={[styles.priceText, { color: theme.success }]}>
          ₹{ticket.price}
        </TheamedText>
      </View>
    </TouchableOpacity>
  );
};

const EmptyTickets = () => {
  const theme = Colors[useColorScheme() ?? 'light'];

  return (
    <View style={styles.emptyContainer}>
      <View style={[styles.emptyIllustration, { backgroundColor: theme.border }]}>
        <Ionicons name="ticket-outline" size={60} color={theme.icon} />
      </View>
      <TheamedText style={[styles.emptyTitle, { color: theme.text }]}>
        No Tickets Available
      </TheamedText>
      <TheamedText style={[styles.emptySubtitle, { color: theme.icon }]}>
        Book a bus to see your tickets here
      </TheamedText>
    </View>
  );
};

const Ticket = () => {
  const theme = Colors[useColorScheme() ?? 'light'];
  const hasTickets = mockTickets.length > 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <TicketHeader />

      {hasTickets ? (
        <FlatList
          data={mockTickets}
          renderItem={({ item }) => <TicketCard ticket={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyTickets />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.light.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
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
  subHeader: {
    fontSize: 14,
    marginBottom: 8,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  ticketCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  busInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  busNumber: {
    fontSize: 20,
    fontWeight: '700',
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  routeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  routeInfo: {
    flex: 1,
  },
  routeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  routeTime: {
    fontSize: 14,
    marginTop: 8,
    fontWeight: '500',
  },
  routeDate: {
    fontSize: 14,
    marginTop: 8,
  },
  routeMiddle: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  durationLine: {
    width: 1,
    height: 12,
    marginVertical: 4,
  },
  divider: {
    height: 1,
    marginBottom: 16,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seatsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seatsText: {
    fontSize: 14,
    marginLeft: 8,
  },
  priceText: {
    fontSize: 18,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIllustration: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Ticket;

// import React from 'react';
// import { View, StyleSheet, useColorScheme } from 'react-native';
// import { Colors } from '@/constants/Colors';
// import TheamedText from '@/components/global/TheamedText';
// import TicketHeader from '@/components/ui/headers/TicketHeader';
// import TabsIcon from '@/components/ui/TabsIcon';

// const Ticket = () => {
//   const theme = Colors[useColorScheme() ?? 'light'];
//   return (
//     <>
//       <TicketHeader />
//       <View style={[styles.container, { backgroundColor: theme.background }]}>
//         <TabsIcon name="ticket-outline" size={150} color={theme.tabIconDefault} />
//         <TheamedText style={styles.title}>No Tickets Available</TheamedText>
//         <View style={styles.bottom}>
//           <TheamedText style={styles.comingSoon}>Feature is coming soon</TheamedText>
//         </View>
//       </View>
//     </>
//   );
// };

// export default Ticket;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     position: 'relative',
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: '600',
//     color: '#1F2937',
//     marginTop: 20,
//   },
//   bottom: {
//     position: 'absolute',
//     bottom: 50,
//   },
//   comingSoon: {
//     fontSize: 16,
//     color: '#9CA3AF',
//     fontStyle: 'italic',
//   },
// });
