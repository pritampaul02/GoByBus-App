import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Register } from '@/services/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import RNPickerSelect from 'react-native-picker-select';
import IndianStates from '@/constants/IndianStates';

export default function CompleteProfile() {
  const { email, token } = useLocalSearchParams<{ email: string; token: string }>();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<number>();
  const [aadharNumber, setAadharNumber] = useState<string>('');
  const [drivingLicenseNumber, setDrivingLicenseNumber] = useState<string>('');
  const [role, setRole] = useState<'passenger' | 'driver'>('passenger');
  const [street, setStreet] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [zipcode, setZipcode] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);

  const address = { street, city, state, zipcode };

  const formData = { name, phone, role, address: address };

  const handleSubmit = async () => {
    if (!name || !phone) {
      return Alert.alert('Missing Fields', 'Please fill all required details.');
    }
    try {
      setLoading(true);
      const response = await Register({
        userDetails: {
          name,
          phone,
          role,
          address: { street, city, state, zipcode },
          aadharNumber,
          drivingLicenseNumber,
        },
        token,
      });
      Alert.alert('Success', `Welcome ${name}!`);
      router.navigate('/(protected)/(drawer)/(tabs)/search');
    } catch (error) {
      console.log('🚀 ~ handleRegister ~ error:', error);
      Alert.alert('Error', 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
    console.log('🚀 ~ CompleteProfile ~ formData:', formData);
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.background }}
      edges={['top', 'left', 'right']}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <ScrollView
          contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[styles.heading, { color: theme.tint }]}>Complete Your Profile</Text>
          <Text style={[styles.subheading, { color: theme.text }]}>{email}</Text>

          {/* Full Name */}
          <InputField
            label="Full Name"
            value={name}
            onChangeText={setName}
            placeholder="John Doe"
            theme={theme}
          />

          {/* Email (non-editable) */}
          <InputField label="Email" value={email} editable={false} theme={theme} />

          {/* Phone */}
          <InputField
            label="Phone Number"
            value={phone ? String(phone) : ''}
            onChangeText={(text) => setPhone(Number(text))}
            placeholder="+91 9876543210"
            keyboardType="phone-pad"
            theme={theme}
          />

          {/* Role Selection */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.text }]}>Account Type</Text>
            <View style={styles.roleButtons}>
              {['passenger', 'driver'].map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[
                    styles.roleButton,
                    {
                      backgroundColor: role === r ? theme.tint : theme.card,
                      borderColor: theme.border,
                    },
                  ]}
                  onPress={() => setRole(r as 'passenger' | 'driver')}
                >
                  <Text style={{ color: role === r ? '#fff' : theme.text, fontWeight: '600' }}>
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {role === 'driver' && (
            <>
              <InputField
                label="Aadhaar No."
                value={aadharNumber}
                onChangeText={setAadharNumber}
                placeholder="123412341234"
                keyboardType="numeric"
                theme={theme}
                maxLength={12}
              />
              <InputField
                label="Driving Licence No."
                value={drivingLicenseNumber}
                onChangeText={setDrivingLicenseNumber}
                placeholder="KA-01-2023-1234567"
                keyboardType="default"
                theme={theme}
              />
            </>
          )}

          {/* Street name */}
          <InputField
            label="Street Name"
            value={street}
            onChangeText={setStreet}
            placeholder="123 Main St"
            keyboardType="default"
            theme={theme}
          />

          {/* City */}
          <InputField
            label="City"
            value={city}
            onChangeText={setCity}
            placeholder="New York"
            keyboardType="default"
            theme={theme}
          />

          {/* State */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.text }]}>State</Text>
            <RNPickerSelect
              onValueChange={setState}
              items={IndianStates.sort((a, b) => a.label.localeCompare(b.label))}
              value={state}
              placeholder={{ label: 'Select State', value: null }}
              style={{
                inputIOS: {
                  color: theme.text,
                  backgroundColor: theme.card,
                  borderRadius: 8,
                  paddingHorizontal: 10,
                  borderColor: theme.border,
                  borderWidth: 1,
                  fontSize: 16,
                  height: 50,
                },
                inputAndroid: {
                  color: theme.text,
                  backgroundColor: theme.card,
                  borderRadius: 8,
                  paddingHorizontal: 10,
                  borderColor: theme.border,
                  borderWidth: 1,
                  fontSize: 16,
                  height: 50,
                },
              }}
            />
          </View>

          {/* Zipcode */}
          <InputField
            label="Pincode"
            value={zipcode}
            onChangeText={setZipcode}
            keyboardType="numeric"
            placeholder="100010"
            theme={theme}
          />

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.tint }]}
            onPress={handleSubmit}
          >
            {loading ? (
              <ActivityIndicator size={'small'} color={theme.background} />
            ) : (
              <Text style={styles.buttonText}>Finish Registration</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  editable = true,
  keyboardType = 'default',
  maxLength,
  theme,
}: {
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  editable?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  maxLength?: number;
  theme: any;
}) {
  return (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          { borderColor: theme.border, color: theme.text, backgroundColor: theme.card },
        ]}
        placeholder={placeholder}
        placeholderTextColor={theme.icon}
        value={value}
        editable={editable}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        maxLength={maxLength}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    // paddingTop: Platform.OS === 'android' ? 50 : 70,
    flexGrow: 1,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  subheading: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 24,
    opacity: 0.7,
  },
  inputContainer: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 6,
    alignItems: 'center',
  },
  button: {
    marginTop: 28,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
