import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface Stop {
  id: string;
  name: string;
  time: string;
}

interface StopsListProps {
  stops: Stop[];
  onUpdate: (id: string, field: 'name' | 'time', value: string) => void;
  onRemove: (id: string) => void;
  theme: any;
}

export default function StopsList({ stops, onUpdate, onRemove, theme }: StopsListProps) {
  return (
    <View style={styles.container}>
      {stops.map((stop, index) => (
        <View
          key={stop.id}
          style={[styles.stopItem, { backgroundColor: theme.card, borderColor: theme.border }]}
        >
          {/* Stop number and connector */}
          <View style={styles.stopNumberContainer}>
            <View style={[styles.stopNumber, { backgroundColor: theme.tint }]}>
              <Text style={[styles.stopNumberText, { color: theme.card }]}>{index + 1}</Text>
            </View>
            {index < stops.length - 1 && (
              <View style={[styles.connector, { backgroundColor: theme.tint }]} />
            )}
          </View>

          {/* Stop details (name + time) */}
          <View style={styles.stopDetails}>
            <TextInput
              placeholder={
                index === 0 ? 'Origin' : index === stops.length - 1 ? 'Destination' : 'Stop name'
              }
              placeholderTextColor={theme.icon}
              style={[styles.input, styles.stopNameInput, { color: theme.text }]}
              value={stop.name}
              onChangeText={(value) => onUpdate(stop.id, 'name', value)}
            />

            <View style={styles.timeInputContainer}>
              <Ionicons name="time-outline" size={16} color={theme.tint} style={styles.timeIcon} />
              <TextInput
                placeholder="HH:MM"
                placeholderTextColor={theme.icon}
                style={[styles.input, styles.timeInput, { color: theme.text }]}
                value={stop.time}
                onChangeText={(value) => onUpdate(stop.id, 'time', value)}
                keyboardType="numbers-and-punctuation"
              />
            </View>
          </View>

          {/* Actions: Delete + Drag Handle */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              onPress={() => onRemove(stop.id)}
              style={styles.deleteButton}
              activeOpacity={0.7}
            >
              <Ionicons name="trash" size={20} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              style={styles.dragHandle}
              activeOpacity={0.7}
            >
              <Ionicons name="reorder-three" size={24} color={theme.icon} />
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <Text style={[styles.swipeHint, { color: theme.icon }]}>
        Tap the trash icon to delete a stop
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
  },
  stopItem: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 12,
    marginBottom: 16,
    paddingHorizontal: 12,
    alignItems: 'flex-start',
  },
  stopNumberContainer: {
    width: 40,
    alignItems: 'center',
  },
  stopNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  stopNumberText: {
    fontSize: 12,
    fontWeight: '600',
  },
  connector: {
    width: 2,
    flex: 1,
  },
  stopDetails: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 8,
  },
  input: {
    paddingVertical: 4,
    paddingHorizontal: 0,
  },
  stopNameInput: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeIcon: {
    marginRight: 6,
  },
  timeInput: {
    fontSize: 14,
    flex: 1,
  },
  actionButtons: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 8,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  dragHandle: {
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  swipeHint: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: -4,
    fontStyle: 'italic',
  },
});
