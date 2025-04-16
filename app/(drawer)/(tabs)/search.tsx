import React, { useState } from 'react';
import * as Haptics from 'expo-haptics';
import { useNavigation } from 'expo-router';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import {
  FlatList,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';

import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const allLocations = [
  'Downtown',
  'Central Park',
  'Union Station',
  'Airport',
  'Main Library',
  'Tech Hub',
  'City Center',
  'North Avenue',
  'Grand Terminal',
  'East Market',
  'Haldia',
  'Panskura',
  'Digha',
  'Ghatal',
];

const recentSearches = [
  { id: '1', from: 'Downtown', to: 'Central Park' },
  { id: '2', from: 'Union Station', to: 'Airport' },
  { id: '3', from: 'Tech Hub', to: 'Main Library' },
];

export default function Search() {
  const theme = Colors[useColorScheme() ?? 'light'];
  const { top, bottom } = useSafeAreaInsets();
  const navigation = useNavigation();

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [activeField, setActiveField] = useState<'from' | 'to' | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [filteredFrom, setFilteredFrom] = useState<string[]>([]);
  const [filteredTo, setFilteredTo] = useState<string[]>([]);

  const translateY = useSharedValue(0);

  const swapLocations = () => {
    translateY.value = withTiming(-10, { duration: 150 }, () => {
      translateY.value = withTiming(0, { duration: 150 });
    });

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const temp = from;
    setFrom(to);
    setTo(temp);
    setFilteredFrom([]);
    setFilteredTo([]);
    setActiveField(null);
    Keyboard.dismiss();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleFromChange = (text: string) => {
    setFrom(text);
    setFilteredFrom(
      allLocations.filter((item) => item.toLowerCase().includes(text.toLowerCase()) && item !== to),
    );
    setActiveField('from');
  };

  const handleToChange = (text: string) => {
    setTo(text);
    setFilteredTo(
      allLocations.filter(
        (item) => item.toLowerCase().includes(text.toLowerCase()) && item !== from,
      ),
    );
    setActiveField('to');
  };

  const handleSuggestionPress = (item: string) => {
    if (activeField === 'from') {
      setFrom(item);
      setFilteredFrom([]);
    } else if (activeField === 'to') {
      setTo(item);
      setFilteredTo([]);
    }
    setActiveField(null);
    Keyboard.dismiss();
  };

  const handleSearch = () => {
    if (!from || !to) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsSearching(true);

    // Simulate API call
    setTimeout(() => {
      setIsSearching(false);
      navigation.navigate('search-result', { from, to });
    }, 1500);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: top + 16,
        paddingBottom: bottom,
        backgroundColor: theme.background,
      }}
    >
      <Pressable
        style={[styles.container, { backgroundColor: theme.background }]}
        onPress={() => {
          Keyboard.dismiss();
          setActiveField(null);
        }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={[styles.menuButton, { backgroundColor: theme.card }]}
          >
            <Ionicons name="menu" size={24} color={theme.tint} />
          </TouchableOpacity>
          <Text style={[styles.headerText, { color: theme.text }]}>Find Your Bus</Text>
        </View>

        {/* Search Form */}
        <View style={styles.searchForm}>
          {/* From Input */}
          <Animated.View
            style={[
              styles.inputContainer,
              {
                backgroundColor: theme.card,
                borderColor: activeField === 'from' ? theme.tint : theme.border,
                shadowColor: theme.text,
              },
              animatedStyle,
            ]}
          >
            <Ionicons
              name="location-outline"
              size={20}
              color={theme.tint}
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="From"
              placeholderTextColor={theme.icon}
              style={[styles.input, { color: theme.text }]}
              value={from}
              onChangeText={handleFromChange}
              onFocus={() => setActiveField('from')}
            />
          </Animated.View>

          {activeField === 'from' && filteredFrom.length > 0 && (
            <View
              style={[
                styles.suggestionsContainer,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              <FlatList
                data={filteredFrom}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleSuggestionPress(item)}
                    style={styles.suggestionItem}
                  >
                    <Ionicons
                      name="location"
                      size={18}
                      color={theme.tint}
                      style={styles.suggestionIcon}
                    />
                    <Text style={[styles.suggestionText, { color: theme.text }]}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          {/* To Input */}
          <Animated.View
            style={[
              styles.inputContainer,
              {
                backgroundColor: theme.card,
                borderColor: activeField === 'to' ? theme.tint : theme.border,
                shadowColor: theme.text,
              },
              animatedStyle,
            ]}
          >
            <Ionicons name="flag-outline" size={20} color={theme.tint} style={styles.inputIcon} />
            <TextInput
              placeholder="To"
              placeholderTextColor={theme.icon}
              style={[styles.input, { color: theme.text }]}
              value={to}
              onChangeText={handleToChange}
              onFocus={() => setActiveField('to')}
            />
          </Animated.View>

          {activeField === 'to' && filteredTo.length > 0 && (
            <View
              style={[
                styles.suggestionsContainer,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              <FlatList
                data={filteredTo}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleSuggestionPress(item)}
                    style={styles.suggestionItem}
                  >
                    <Ionicons
                      name="flag"
                      size={18}
                      color={theme.tint}
                      style={styles.suggestionIcon}
                    />
                    <Text style={[styles.suggestionText, { color: theme.text }]}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          {/* Swap Button */}
          <TouchableOpacity
            onPress={swapLocations}
            style={[
              styles.swapButton,
              {
                backgroundColor: theme.tint,
                shadowColor: theme.text,
              },
            ]}
          >
            <Ionicons name="swap-vertical" size={22} color={theme.card} />
          </TouchableOpacity>

          {/* Search Button */}
          <TouchableOpacity
            style={[
              styles.searchButton,
              {
                backgroundColor: theme.tint,
                opacity: !from || !to ? 0.6 : 1,
              },
            ]}
            onPress={handleSearch}
            disabled={!from || !to || isSearching}
          >
            {isSearching ? (
              <ActivityIndicator color={theme.card} />
            ) : (
              <>
                <Ionicons name="search" size={20} color={theme.card} style={styles.searchIcon} />
                <Text style={[styles.searchButtonText, { color: theme.card }]}>Search Buses</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Recent Searches Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Searches</Text>

          {recentSearches.length > 0 ? (
            <FlatList
              data={recentSearches}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.recentItem,
                    { backgroundColor: theme.card, borderColor: theme.border },
                  ]}
                  onPress={() => {
                    setFrom(item.from);
                    setTo(item.to);
                  }}
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
              <Ionicons
                name="search-outline"
                size={32}
                color={theme.icon}
                style={styles.emptyIcon}
              />
              <Text style={[styles.emptyText, { color: theme.text }]}>
                No recent searches found
              </Text>
            </View>
          )}
        </View>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
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
  searchForm: {
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  suggestionsContainer: {
    maxHeight: 200,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  suggestionIcon: {
    marginRight: 12,
  },
  suggestionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  swapButton: {
    position: 'absolute',
    right: 20,
    top: 42,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  searchButton: {
    flexDirection: 'row',
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
  searchIcon: {
    marginRight: 8,
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
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
