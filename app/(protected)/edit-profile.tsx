import React, { useState, useEffect } from 'react';
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
import { router } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import RNPickerSelect from 'react-native-picker-select';
import IndianStates from '@/constants/IndianStates';
import { useAuthStore } from '@/store/useAuthStore';
import * as Haptics from 'expo-haptics';
import { Register } from '@/services/auth';

export default function EditProfile() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { user } = useAuthStore();

  const [name, setName] = useState<string>(user?.name || '');
  const [phone, setPhone] = useState<number>(user?.mobileNumber || 0);
  const [aadharNumber, setAadharNumber] = useState<string>(user?.aadharNumber || '');
  const [drivingLicenseNumber, setDrivingLicenseNumber] = useState<string>(user?.drivingLicenseNumber || '');
  const [role, setRole] = useState<'passenger' | 'driver'>(user?.role || 'passenger');
  const [street, setStreet] = useState<string>(user?.address?.street || '');
  const [city, setCity] = useState<string>(user?.address?.city || '');
  const [state, setState] = useState<string>(user?.address?.state || '');
  const [zipcode, setZipcode] = useState<string>(user?.address?.zipcode || '');

  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!name || !phone) {
      return Alert.alert('Missing Fields', 'Please fill all required details.');
    }
    
    try {
      setLoading(true);
      // Here you would typically call your API to update the user profile
      const updatedUser = {
        ...user,
        name,
        mobileNumber: phone,
        role,
        address: { street, city, state, zipcode },
        aadharNumber,
        drivingLicenseNumber,
        email: user?.email || '',
      };
      
      await Register({userDetails:updatedUser,token:useAuthStore.getState().token!});
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', 'Profile updated successfully!');
      router.back();
    } catch (error) {
      console.log('🚀 ~ handleUpdate ~ error:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
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
          <Text style={[styles.heading, { color: theme.tint }]}>Edit Profile</Text>
          <Text style={[styles.subheading, { color: theme.text }]}>{user?.email}</Text>

          {/* Full Name */}
          <InputField
            label="Full Name"
            value={name}
            onChangeText={setName}
            placeholder="John Doe"
            theme={theme}
          />

          {/* Email (non-editable) */}
          <InputField 
            label="Email" 
            value={user?.email || ''} 
            editable={false} 
            theme={theme}
            placeholder="Email"
          />

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
                editable={role === 'driver'}
              />
              <InputField
                label="Driving Licence No."
                value={drivingLicenseNumber}
                onChangeText={setDrivingLicenseNumber}
                placeholder="KA-01-2023-1234567"
                keyboardType="default"
                theme={theme}
                editable={role === 'driver'}
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
              <Text style={styles.buttonText}>Update Profile</Text>
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
  placeholder: string;
  editable?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  maxLength?: number;
  theme: any;
}) {
  return (
    <View style={[styles.inputContainer, { opacity: editable ? 1 : 0.5 }]}>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.card,
            color: theme.text,
            borderColor: theme.border,
          },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.icon}
        editable={editable}
        keyboardType={keyboardType}
        maxLength={maxLength}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subheading: {
    fontSize: 16,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  roleButton: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 