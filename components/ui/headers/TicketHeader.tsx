import { StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';
import React from 'react';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import TheamedText from '@/components/global/TheamedText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TicketHeader() {
  const theme = Colors[useColorScheme() ?? 'light'];
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.card, borderBottomColor: theme.border, paddingTop: top + 15 },
      ]}
    >
      <TouchableOpacity style={[styles.menuButton]} onPress={() => navigation.openDrawer()}>
        <Ionicons name="menu" size={26} color={theme.text} />
      </TouchableOpacity>

      <View style={styles.titleContainer}>
        <TheamedText style={[styles.title, { color: theme.text }]}>Your Ticket</TheamedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  menuButton: {
    padding: 10,
    borderRadius: 50,
  },
  titleContainer: {
    marginLeft: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
});
