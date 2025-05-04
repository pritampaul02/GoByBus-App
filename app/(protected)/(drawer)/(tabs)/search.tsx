import React, { useState, useEffect } from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Text,
} from 'react-native';
import { useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SearchInput } from '@/components/search/SearchInput';
import { RecentSearches } from '@/components/search/RecentSearches';
import { useSearchStore } from '@/store/useSearchStore';
import { Stand } from '@/types/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SearchScreen() {
  const theme = Colors[useColorScheme() ?? 'light'];
  const { top, bottom } = useSafeAreaInsets();
  const navigation = useNavigation();

  const { stands, recentSearches, loading, fetchStands, searchBuses, addRecentSearch } =
    useSearchStore();

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [fromId, setFromId] = useState('');
  const [toId, setToId] = useState('');
  const [activeField, setActiveField] = useState<'from' | 'to' | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const translateY = useSharedValue(0);

  useEffect(() => {
    fetchStands();
  }, []);

  const filteredStands = (query: string) => {
    return stands.filter((stand) => stand.name.toLowerCase().includes(query.toLowerCase()));
  };

  const swapLocations = () => {
    translateY.value = withTiming(-10, { duration: 150 }, () => {
      translateY.value = withTiming(0, { duration: 150 });
    });

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const temp = from;
    const tempId = fromId;
    setFrom(to);
    setFromId(toId);
    setTo(temp);
    setToId(tempId);
    setActiveField(null);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleSuggestionPress = (stand: Stand, field: 'from' | 'to') => {
    if (field === 'from') {
      setFrom(stand.name);
      setFromId(stand._id);
    } else {
      setTo(stand.name);
      setToId(stand._id);
    }
    setActiveField(null);
  };

  const handleSearch = async () => {
    if (!fromId || !toId) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsSearching(true);

    try {
      const result = await searchBuses(fromId, toId);
      addRecentSearch({
        id: Date.now().toString(),
        from,
        to,
        fromId,
        toId,
      });
      navigation.navigate('search-result', {
        from,
        to,
        schedules: JSON.stringify(result.schedules),
      });
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsSearching(false);
    }
  };

  console.log(fromId, toId);
  

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
          setActiveField(null);
        }}
      >
        {/* Header */}
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
          <Text style={[styles.headerText, { color: theme.text }]}>Find Your Bus</Text>
        </View>

        {/* Search Form */}
        <View style={styles.searchForm}>
          <SearchInput
            value={from}
            onChangeText={(text) => {
              setFrom(text);
              if (!text) setFromId('');
            }}
            onFocus={() => setActiveField('from')}
            placeholder="From"
            iconName="location-outline"
            active={activeField === 'from'}
            suggestions={filteredStands(from)}
            onSuggestionPress={(stand) => handleSuggestionPress(stand, 'from')}
            loading={loading}
          />

          <SearchInput
            value={to}
            onChangeText={(text) => {
              setTo(text);
              if (!text) setToId('');
            }}
            onFocus={() => setActiveField('to')}
            placeholder="To"
            iconName="flag-outline"
            active={activeField === 'to'}
            suggestions={filteredStands(to)}
            onSuggestionPress={(stand) => handleSuggestionPress(stand, 'to')}
            loading={loading}
          />

          {/* Swap Button */}
          <TouchableOpacity
            onPress={swapLocations}
            style={[
              styles.swapButton,
              {
                backgroundColor: theme.tint,
                shadowColor: theme.text,
              },
              animatedStyle,
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
                opacity: !fromId || !toId ? 0.6 : 1,
              },
            ]}
            onPress={handleSearch}
            disabled={!fromId || !toId || isSearching}
          >
            {isSearching ? (
              <ActivityIndicator color={theme.card} />
            ) : (
              <>
                <Ionicons name="search" size={20} color={theme.card} style={styles.searchIcon} />
                <Text style={[styles.searchButtonText, { color: theme.card }]}>
                  {!fromId || !toId ? 'Select Locations' : 'Search Buses'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Recent Searches */}
        <RecentSearches
          searches={recentSearches}
          onSearchPress={(search) => {
            setFrom(search.from);
            setFromId(search.fromId);
            setTo(search.to);
            setToId(search.toId);
          }}
        />
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
});
