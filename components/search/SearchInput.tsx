// src/features/search/components/SearchInput.tsx
import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import { Stand } from '@/types/types';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onFocus: () => void;
  placeholder: string;
  iconName: any;
  active: boolean;
  suggestions: Stand[];
  onSuggestionPress: (stand: Stand) => void;
  loading: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  onFocus,
  placeholder,
  iconName,
  active,
  suggestions,
  onSuggestionPress,
  loading,
}) => {
  const theme = Colors[useColorScheme() ?? 'light'];

  return (
    <View>
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.card,
            borderColor: active ? theme.tint : theme.border,
          },
        ]}
      >
        <Ionicons name={iconName} size={20} color={theme.tint} style={styles.inputIcon} />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={theme.icon}
          style={[styles.input, { color: theme.text }]}
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
        />
      </View>

      {active && value && (
        <View
          style={[
            styles.suggestionsContainer,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          {loading ? (
            <ActivityIndicator color={theme.tint} style={styles.loadingIndicator} />
          ) : (
            <FlatList
              data={suggestions}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => onSuggestionPress(item)}
                  style={styles.suggestionItem}
                >
                  <Ionicons
                    name={iconName.replace('-outline', '')}
                    size={18}
                    color={theme.tint}
                    style={styles.suggestionIcon}
                  />
                  <Text style={[styles.suggestionText, { color: theme.text }]}>{item.name}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={[styles.emptyText, { color: theme.text }]}>No stands found</Text>
              }
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
  loadingIndicator: {
    padding: 16,
  },
  emptyText: {
    padding: 16,
    fontSize: 14,
    textAlign: 'center',
  },
});
