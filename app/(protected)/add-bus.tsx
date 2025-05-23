import React, { useState } from 'react';
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
import { router, useNavigation, useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import axiosInstance from '@/api/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { useBusStore } from '@/store/useBusStore';

export default function CreateBusScreen() {
  const theme = Colors[useColorScheme() ?? 'light'];
  const { bottom } = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);

  const { token } = useAuthStore();

  // Form state
  const [busName, setBusName] = useState('');
  const [busRegistrationNumber, setBusRegistrationNumber] = useState('');
  const [busNumber, setBusNumber] = useState('');
  const [busType, setBusType] = useState<string>('Regular');
  const [capacity, setCapacity] = useState('');
  const [hasAC, setHasAC] = useState<boolean>(false);
  const [isExpress, setIsExpress] = useState<boolean>(false);

  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { addBus } = useBusStore();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!busName.trim()) newErrors.busName = 'Bus name is required';
    if (!busRegistrationNumber.trim()) newErrors.busRegistrationNumber = 'Reg. No. is required';
    if (!busType.trim()) newErrors.busType = 'Bus type is required';
    if (!capacity.trim()) newErrors.capacity = 'Capacity is required';
    else if (isNaN(Number(capacity))) newErrors.capacity = 'Capacity must be a number';
    else if (Number(capacity) <= 10) newErrors.capacity = 'Capacity must be greater than 10';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      setIsLoading(true);

      const response: any = await addBus({
        name: busName.trim(),
        busNumber: busNumber.trim(),
        registrationNumber: busRegistrationNumber.trim(),
        seatCapacity: Number(capacity),
        busType: busType.toLowerCase(),
        isAC: hasAC,
        isExpress,
      });

      if (response?.success) {
        // Reset form
        setBusName('');
        setBusRegistrationNumber('');
        setBusNumber('');
        setBusType('Regular');
        setCapacity('');
        setHasAC(false);
        setIsExpress(false);
        setErrors({});
        Alert.alert('✅ Success', 'Bus registered successfully!');
        router.back();
      } else {
        Alert.alert('❌ Error', 'Failed to register your Bus. Please try again later.');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('❌ Error', 'Failed to register your Bus. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

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
            <Text style={[styles.headerText, { color: theme.text }]}>Register your Bus</Text>
          </View>
        </View>

        <ScrollView
          style={[styles.container, { backgroundColor: theme.background }]}
          contentContainerStyle={{ paddingBottom: bottom + 80 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Form Sections */}
          <View style={styles.formSection}>
            {/* Bus Name Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Bus Name</Text>
              <View
                style={[
                  styles.inputContainer,
                  {
                    backgroundColor: theme.card,
                    borderColor: errors.busName ? 'red' : theme.border,
                  },
                ]}
              >
                <Ionicons
                  name="bus-outline"
                  size={20}
                  color={theme.tint}
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Enter bus name"
                  placeholderTextColor={theme.icon}
                  style={[styles.input, { color: theme.text }]}
                  value={busName}
                  onChangeText={setBusName}
                />
              </View>
              {errors.busName && <Text style={styles.errorText}>{errors.busName}</Text>}
            </View>

            {/* Bus Registration Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Bus Registration Number</Text>
              <View
                style={[
                  styles.inputContainer,
                  {
                    backgroundColor: theme.card,
                    borderColor: errors.busRegistrationNumber ? 'red' : theme.border,
                  },
                ]}
              >
                <Ionicons
                  name="card-outline"
                  size={20}
                  color={theme.tint}
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="IN-1234 (Required)"
                  placeholderTextColor={theme.icon}
                  style={[styles.input, { color: theme.text }]}
                  value={busRegistrationNumber}
                  onChangeText={setBusRegistrationNumber}
                />
              </View>
              {errors.busRegistrationNumber && (
                <Text style={styles.errorText}>{errors.busRegistrationNumber}</Text>
              )}
            </View>

            {/* Bus Number Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>
                Bus Number &#x28;Optional&#x29;
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  {
                    backgroundColor: theme.card,
                    borderColor: errors.busNumber ? 'red' : theme.border,
                  },
                ]}
              >
                <Ionicons
                  name="bus-outline"
                  size={20}
                  color={theme.tint}
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="B-145 (Optional)"
                  placeholderTextColor={theme.icon}
                  style={[styles.input, { color: theme.text }]}
                  value={busNumber}
                  onChangeText={setBusNumber}
                />
              </View>
              {errors.busNumber && <Text style={styles.errorText}>{errors.busNumber}</Text>}
            </View>

            {/* Bus Type Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Bus Type</Text>
              <View style={styles.typeSelectionContainer}>
                {['Regular', 'Sleeper', 'Volvo', 'Mini'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeOption,
                      {
                        backgroundColor: busType === type ? theme.tint : theme.card,
                        borderColor: theme.border,
                      },
                    ]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setBusType(type);
                    }}
                  >
                    <Text
                      style={[
                        styles.typeText,
                        { color: busType === type ? theme.card : theme.text },
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.busType && <Text style={styles.errorText}>{errors.busType}</Text>}
            </View>

            {/* Capacity Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Capacity</Text>
              <View
                style={[
                  styles.inputContainer,
                  {
                    backgroundColor: theme.card,
                    borderColor: errors.capacity ? theme.alert : theme.border,
                  },
                ]}
              >
                <Ionicons
                  name="people-outline"
                  size={20}
                  color={theme.tint}
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Number of seats"
                  placeholderTextColor={theme.icon}
                  style={[styles.input, { color: theme.text }]}
                  value={capacity}
                  onChangeText={setCapacity}
                  keyboardType="numeric"
                />
              </View>
              {errors.capacity && <Text style={styles.errorText}>{errors.capacity}</Text>}
            </View>

            {/* Amenities */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Amenities</Text>

              <View style={styles.switchContainer}>
                <View style={styles.switchItem}>
                  <Text style={[styles.switchLabel, { color: theme.text }]}>AC</Text>
                  <Switch
                    value={hasAC}
                    onValueChange={(value) => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setHasAC(value);
                    }}
                    trackColor={{ false: theme.border, true: theme.tint }}
                    thumbColor={theme.card}
                  />
                </View>

                <View style={styles.switchItem}>
                  <Text style={[styles.switchLabel, { color: theme.text }]}>Express</Text>
                  <Switch
                    value={isExpress}
                    onValueChange={(value) => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setIsExpress(value);
                    }}
                    trackColor={{ false: theme.border, true: theme.tint }}
                    thumbColor={theme.card}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              {
                backgroundColor: theme.tint,
                opacity: isLoading ? 0.7 : 1,
              },
            ]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
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
    // shadowColor: '#000',
    // shadowOpacity: 0.05,
    // shadowRadius: 8,
    // shadowOffset: { width: 0, height: 2 },
    // elevation: 2,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '700',
  },
  formSection: {
    marginBottom: 2,
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
    paddingVertical: 5,
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
