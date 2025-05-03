import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import { RecentSearch } from '@/types/types';

interface RecentSearchesProps {
  searches: RecentSearch[];
  onSearchPress: (search: RecentSearch) => void;
}

export const RecentSearches: React.FC<RecentSearchesProps> = ({ searches, onSearchPress }) => {
  const theme = Colors[useColorScheme() ?? 'light'];

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Searches</Text>

      {searches.length > 0 ? (
        <FlatList
          data={searches}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.recentItem,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
              onPress={() => onSearchPress(item)}
            >
              <Ionicons name="time" size={18} color={theme.tint} style={styles.recentIcon} />
              <Text style={[styles.recentText, { color: theme.text }]}>
                {item.from} → {item.to}
              </Text>
              <Ionicons name="chevron-forward" size={18} color={theme.icon} />
            </TouchableOpacity>
          )}
          scrollEnabled={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={32} color={theme.icon} style={styles.emptyIcon} />
          <Text style={[styles.emptyText, { color: theme.text }]}>No recent searches found</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  recentIcon: {
    marginRight: 12,
  },
  recentText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: 'transparent',
  },
  emptyIcon: {
    opacity: 0.5,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    opacity: 0.5,
  },
});
