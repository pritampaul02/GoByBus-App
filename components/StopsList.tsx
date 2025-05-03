import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import TimePickerInput from './TimePickerInput';

interface Stop {
  id: string;
  standName: string;
  arrivalTime: string;
}

interface StopsListProps {
  stops: Stop[];
  onUpdate: (id: string, field: 'standName' | 'arrivalTime', value: string) => void;
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
              value={stop.standName}
              onChangeText={(value) => onUpdate(stop.id, 'standName', value)}
            />

            <View style={styles.timeInputContainer}>
              <TimePickerInput
                onChange={(value) => onUpdate(stop.id, 'arrivalTime', value)}
                value={stop.arrivalTime}
                theme={theme}
              />
            </View>
          </View>

          {/* Actions: Delete */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              onPress={() => onRemove(stop.id)}
              style={styles.deleteButton}
              activeOpacity={0.7}
            >
              <Ionicons name="trash" size={20} color="#fff" />
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
    width: '80%',
    height: 50,
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
    alignSelf: 'center',
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
