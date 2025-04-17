import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';

export default function CompleteProfile() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'passenger' | 'driver' | null>(null);
  const [vehicle, setVehicle] = useState('');

  const handleSubmit = () => {
    if (!name || !phone || !role) {
      Alert.alert('Missing Fields', 'Please fill all required details.');
      return;
    }

    if (role === 'driver' && !vehicle) {
      Alert.alert('Missing Vehicle Info', 'Please provide your vehicle details.');
      return;
    }

    Alert.alert('Success', `Welcome ${name}!`);
    navigation.navigate('home'); // or any other screen
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.heading, { color: theme.tint }]}>Complete Your Profile</Text>
      <Text style={[styles.subheading, { color: theme.text }]}>{email}</Text>

      {/* Name */}
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: theme.text }]}>Full Name</Text>
        <TextInput
          style={[
            styles.input,
            { borderColor: theme.border, color: theme.text, backgroundColor: theme.card },
          ]}
          placeholder="John Doe"
          placeholderTextColor={theme.icon}
          value={name}
          onChangeText={setName}
        />
      </View>

      {/* Phone */}
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: theme.text }]}>Phone Number</Text>
        <TextInput
          style={[
            styles.input,
            { borderColor: theme.border, color: theme.text, backgroundColor: theme.card },
          ]}
          placeholder="+91 9876543210"
          placeholderTextColor={theme.icon}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
      </View>

      {/* Role selection */}
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: theme.text }]}>Account Type</Text>
        <View style={styles.roleButtons}>
          {['passenger', 'driver'].map((r) => (
            <TouchableOpacity
              key={r}
              onPress={() => setRole(r as 'passenger' | 'driver')}
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

      {/* Vehicle input for drivers */}
      {role === 'driver' && (
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.text }]}>Vehicle Details</Text>
          <TextInput
            style={[
              styles.input,
              { borderColor: theme.border, color: theme.text, backgroundColor: theme.card },
            ]}
            placeholder="Model, Number etc."
            placeholderTextColor={theme.icon}
            value={vehicle}
            onChangeText={setVehicle}
          />
        </View>
      )}

      {/* Submit */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.tint }]}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>Finish Registration</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 50 : 70,
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
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
