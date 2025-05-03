import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import DateTimePicker from '@react-native-community/datetimepicker';

interface TimePickerInputProps {
  value: string;
  onChange: (time: string) => void;
  error?: boolean;
  theme: any;
}

export default function TimePickerInput({
  value,
  onChange,
  error = false,
  theme,
}: TimePickerInputProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [tempTime, setTempTime] = useState(new Date());

  const openPicker = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // If there's already a value, set the picker to that time
    if (value) {
      const [hours, minutes] = value.split(':').map(Number);
      const date = new Date();
      date.setHours(hours);
      date.setMinutes(minutes);
      setTempTime(date);
    } else {
      // Default to current time
      setTempTime(new Date());
    }
    setShowPicker(true);
  };

  const handleTimeChange = (event: any, selectedTime: Date | undefined) => {
    const currentTime = selectedTime || tempTime;
    setTempTime(currentTime);

    if (Platform.OS === 'android') {
      setShowPicker(false);
      if (selectedTime) {
        const hours = String(currentTime.getHours()).padStart(2, '0');
        const minutes = String(currentTime.getMinutes()).padStart(2, '0');
        onChange(`${hours}:${minutes}`);
      }
    }
  };

  const handleConfirm = () => {
    const hours = String(tempTime.getHours()).padStart(2, '0');
    const minutes = String(tempTime.getMinutes()).padStart(2, '0');
    onChange(`${hours}:${minutes}`);
    setShowPicker(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleCancel = () => {
    setShowPicker(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={openPicker}
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.card,
            borderColor: error ? 'red' : theme.border,
          },
        ]}
      >
        <Ionicons name="time-outline" size={20} color={theme.tint} style={styles.inputIcon} />
        <Text style={[styles.timeText, { color: value ? theme.text : theme.icon }]}>
          {value || 'Select time'}
        </Text>
        <Ionicons name="chevron-down" size={16} color={theme.icon} />
      </TouchableOpacity>

      {Platform.OS === 'ios' ? (
        <Modal transparent={true} visible={showPicker} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={handleCancel}>
                  <Text style={[styles.modalButton, { color: theme.tint }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleConfirm}>
                  <Text style={[styles.modalButton, { color: theme.tint, fontWeight: '600' }]}>
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={tempTime}
                mode="time"
                display="spinner"
                onChange={handleTimeChange}
                textColor={theme.text}
              />
            </View>
          </View>
        </Modal>
      ) : (
        showPicker && (
          <DateTimePicker
            value={tempTime}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  timeText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  modalButton: {
    fontSize: 16,
    padding: 4,
  },
});
