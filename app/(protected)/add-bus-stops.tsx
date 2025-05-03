import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import TimePickerInput from '@/components/TimePickerInput';
import StopsList from '@/components/StopsList';
import RNPickerSelect from 'react-native-picker-select';
import { useBusStore } from '@/store/useBusStore';
import axiosInstance from '@/api/axios';
import { useAuthStore } from '@/store/useAuthStore';

export default function CreateBusScreen() {
  const theme = Colors[useColorScheme() ?? 'light'];
  const { bottom } = useSafeAreaInsets();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { myBus, fetchMyBus, loading: busLoading } = useBusStore();
  const { token } = useAuthStore();

  // Form state
  const [fare, setFare] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [bus, setBus] = useState('');
  const [stops, setStops] = useState<Array<{ id: string; standName: string; arrivalTime: string }>>(
    [
      { id: '1', standName: '', arrivalTime: '' },
      { id: '2', standName: '', arrivalTime: '' },
    ],
  );

  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!fare.trim()) newErrors.fare = 'Fare is required';
    else if (isNaN(Number(fare))) newErrors.fare = 'Fare must be a number';

    if (!departureTime) newErrors.departureTime = 'Departure time is required';
    if (!arrivalTime) newErrors.arrivalTime = 'Arrival time is required';

    // Validate stops
    const invalidStops = stops.filter((stop) => !stop.standName.trim() || !stop.arrivalTime);
    if (invalidStops.length > 0) {
      newErrors.stops = 'All stops must have a name and time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddStop = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStops([...stops, { id: Date.now().toString(), standName: '', arrivalTime: '' }]);
  };

  const handleRemoveStop = (id: string) => {
    if (stops.length <= 2) {
      Alert.alert('Cannot remove stop', 'A route must have at least two stops.');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setStops(stops.filter((stop) => stop.id !== id));
  };

  const updateStop = (id: string, field: 'standName' | 'arrivalTime', value: string) => {
    setStops(stops.map((stop) => (stop.id === id ? { ...stop, [field]: value } : stop)));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsSubmitting(true);

    try {
      console.log({
        busId: bus,
        scheduleStops: stops,
      });

      setIsSubmitting(true);
      const { data } = await axiosInstance.post(
        'schedule/create',
        {
          busId: bus,
          scheduleStops: stops,
        },
        {
          headers: { token },
        },
      );

      if (data?.success) {
        router.back();
        setBus('');
        setStops([
          { id: '1', standName: '', arrivalTime: '' },
          { id: '2', standName: '', arrivalTime: '' },
        ]);
        setFare('');
        setDepartureTime('');
        setArrivalTime('');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('error', JSON.stringify(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    async function fetch() {
      await fetchMyBus();
    }
    fetch();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        {/* Header */}
        <View style={{ paddingTop: 16, paddingBottom: 12, paddingHorizontal: 20 }}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.back();
              }}
              style={[styles.menuButton]}
            >
              <Ionicons name="arrow-back" size={24} color={theme.tint} />
            </TouchableOpacity>
            <Text style={[styles.headerText, { color: theme.text }]}>Register your Stops</Text>
          </View>
        </View>

        {busLoading ? (
          <ActivityIndicator color={theme.tint} size={'large'} style={{ marginTop: 70 }} />
        ) : (
          <ScrollView
            style={[styles.container, { backgroundColor: theme.background }]}
            contentContainerStyle={{ paddingBottom: bottom + 20 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Form Sections */}
            <View style={styles.formSection}>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.text }]}>Select your Bus</Text>
                <RNPickerSelect
                  onValueChange={setBus}
                  items={
                    (myBus ?? [])?.map((bus) => ({
                      label: `${bus.name} - ${bus.registrationNumber}`,
                      value: bus._id,
                    }))!
                  }
                  value={bus}
                  style={{
                    inputIOS: {
                      color: theme.text,
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                      borderWidth: 1,
                      borderColor: theme.border,
                      borderRadius: 12,
                      backgroundColor: theme.card,
                      shadowColor: '#000',
                      shadowOpacity: 0.05,
                      shadowRadius: 8,
                      shadowOffset: { width: 0, height: 2 },
                      elevation: 2,
                    },
                    inputAndroid: {
                      color: theme.text,
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                      borderWidth: 1,
                      borderColor: theme.border,
                      borderRadius: 12,
                      backgroundColor: theme.card,
                      shadowColor: '#000',
                      shadowOpacity: 0.05,
                      shadowRadius: 8,
                      shadowOffset: { width: 0, height: 2 },
                      elevation: 2,
                    },
                  }}
                  placeholder={{ label: 'Select your bus', value: null }}
                />
              </View>

              {/* Fare Input */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.text }]}>Fare (₹)</Text>
                <View
                  style={[
                    styles.inputContainer,
                    {
                      backgroundColor: theme.card,
                      borderColor: errors.fare ? 'red' : theme.border,
                    },
                  ]}
                >
                  <Ionicons
                    name="cash-outline"
                    size={20}
                    color={theme.tint}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    placeholder="Enter fare amount"
                    placeholderTextColor={theme.icon}
                    style={[styles.input, { color: theme.text }]}
                    value={fare}
                    onChangeText={setFare}
                    keyboardType="numeric"
                  />
                </View>
                {errors.fare && <Text style={styles.errorText}>{errors.fare}</Text>}
              </View>

              {/* Time Inputs */}
              <View style={styles.timeContainer}>
                <View style={[styles.timeInput, { marginRight: 8 }]}>
                  <Text style={[styles.label, { color: theme.text }]}>Departure</Text>
                  <TimePickerInput
                    value={departureTime}
                    onChange={setDepartureTime}
                    error={!!errors.departureTime}
                    theme={theme}
                  />
                  {errors.departureTime && (
                    <Text style={styles.errorText}>{errors.departureTime}</Text>
                  )}
                </View>

                <View style={[styles.timeInput, { marginLeft: 8 }]}>
                  <Text style={[styles.label, { color: theme.text }]}>Arrival</Text>
                  <TimePickerInput
                    value={arrivalTime}
                    onChange={setArrivalTime}
                    error={!!errors.arrivalTime}
                    theme={theme}
                  />
                  {errors.arrivalTime && <Text style={styles.errorText}>{errors.arrivalTime}</Text>}
                </View>
              </View>
            </View>

            {/* Stops Section */}
            <View style={styles.formSection}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Route Stops</Text>
                <TouchableOpacity
                  style={[styles.addButton, { backgroundColor: theme.tint }]}
                  onPress={handleAddStop}
                >
                  <Ionicons name="add" size={20} color={theme.card} />
                  <Text style={[styles.addButtonText, { color: theme.card }]}>Add Stop</Text>
                </TouchableOpacity>
              </View>

              <StopsList
                stops={stops}
                onUpdate={updateStop}
                onRemove={handleRemoveStop}
                theme={theme}
              />

              {errors.stops && <Text style={styles.errorText}>{errors.stops}</Text>}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                {
                  backgroundColor: theme.tint,
                  opacity: isSubmitting ? 0.7 : 1,
                },
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color={theme.card} />
              ) : (
                <>
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={theme.card}
                    style={styles.submitIcon}
                  />
                  <Text style={[styles.submitButtonText, { color: theme.card }]}>
                    Create Bus Route
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '700',
  },
  formSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
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
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 4,
  },
  typeSelectionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  typeOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  switchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  switchLabel: {
    fontSize: 16,
    marginRight: 12,
  },
  timeContainer: {
    flexDirection: 'row',
  },
  timeInput: {
    flex: 1,
  },
  addButton: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  submitButton: {
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
    marginTop: 16,
  },
  submitIcon: {
    marginRight: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
