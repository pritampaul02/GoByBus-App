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
} from 'react-native';

import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';

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

  const naviagtion = useNavigation();

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [activeField, setActiveField] = useState<'from' | 'to' | null>(null);

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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Pressable
        style={[styles.container, { backgroundColor: theme.card }]}
        onPress={() => {
          Keyboard.dismiss();
          setActiveField(null);
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: 20,
            marginBottom: 25,
          }}
        >
          <TouchableOpacity onPress={() => naviagtion.dispatch(DrawerActions.openDrawer())}>
            <Ionicons name="menu" size={30} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.header, { color: theme.text }]}>Find Your Bus</Text>
        </View>

        <View style={styles.inputWrapper}>
          {/* From Input */}
          <Animated.View
            style={[
              styles.inputField,
              { backgroundColor: theme.card, borderColor: theme.border },
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
              style={[styles.textInput, { color: theme.text }]}
              value={from}
              onChangeText={handleFromChange}
              onFocus={() => setActiveField('from')}
            />
          </Animated.View>

          {activeField === 'from' && filteredFrom.length > 0 && (
            <View
              style={[
                styles.suggestionContainer,
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
              styles.inputField,
              { backgroundColor: theme.card, borderColor: theme.border },
              animatedStyle,
            ]}
          >
            <Ionicons name="flag-outline" size={20} color={theme.tint} style={styles.inputIcon} />
            <TextInput
              placeholder="To"
              placeholderTextColor={theme.icon}
              style={[styles.textInput, { color: theme.text }]}
              value={to}
              onChangeText={handleToChange}
              onFocus={() => setActiveField('to')}
            />
          </Animated.View>

          {activeField === 'to' && filteredTo.length > 0 && (
            <View
              style={[
                styles.suggestionContainer,
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
            style={[styles.swapButton, { backgroundColor: theme.tint, borderColor: theme.card }]}
          >
            <Ionicons name="swap-vertical-outline" size={28} color={theme.card} />
          </TouchableOpacity>

          {/* Search Button */}
          <TouchableOpacity style={[styles.button, { backgroundColor: theme.tint }]}>
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Searches */}
        <Text style={[styles.subHeader, { color: theme.text }]}>Recent Searches</Text>

        <FlatList
          data={recentSearches}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.historyItem,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              <Ionicons name="bus" size={20} color={theme.tint} style={{ marginRight: 10 }} />
              <Text style={[styles.historyText, { color: theme.text }]}>
                {item.from} → {item.to}
              </Text>
            </View>
          )}
          style={styles.historyList}
        />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
  },
  inputWrapper: {
    marginBottom: 30,
    position: 'relative',
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
  },
  swapButton: {
    position: 'absolute',
    right: 10,
    top: 35,
    padding: 15,
    borderRadius: 100,
    zIndex: 10,
    borderWidth: 4,
  },
  button: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  historyList: {
    flexGrow: 0,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
  },
  historyText: {
    fontSize: 16,
  },
  suggestionList: {
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  suggestionContainer: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
    height: 200,
  },

  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },

  suggestionIcon: {
    marginRight: 10,
  },

  suggestionText: {
    fontSize: 16,
    flex: 1,
  },
});
