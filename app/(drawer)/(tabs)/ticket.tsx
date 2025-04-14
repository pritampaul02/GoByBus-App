import React from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import TheamedText from '@/components/global/TheamedText';
import TicketHeader from '@/components/ui/headers/TicketHeader';
import TabsIcon from '@/components/ui/TabsIcon';

const Ticket = () => {
  const theme = Colors[useColorScheme() ?? 'light'];
  return (
    <>
      <TicketHeader />
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <TabsIcon name="ticket-outline" size={150} color={theme.tabIconDefault} />
        <TheamedText style={styles.title}>No Tickets Available</TheamedText>
        <View style={styles.bottom}>
          <TheamedText style={styles.comingSoon}>Feature is coming soon</TheamedText>
        </View>
      </View>
    </>
  );
};

export default Ticket;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    position: 'relative',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 20,
  },
  bottom: {
    position: 'absolute',
    bottom: 50,
  },
  comingSoon: {
    fontSize: 16,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
});
