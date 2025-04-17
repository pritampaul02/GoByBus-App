import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const navigation = useNavigation();

  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [otp, setOtp] = useState('');

  const handleEmailChange = (text: string) => {
    setEmail(text);
    setIsValidEmail(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text));
  };

  const handleSendOtp = () => {
    if (!isValidEmail) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    setStep('otp');
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 4) {
      Alert.alert('Invalid OTP', 'Please enter the 4-digit OTP sent to your email.');
      return;
    }

    const mockUserExists = email === 'demo@user.com';

    if (mockUserExists) {
      Alert.alert('Login Success', 'Welcome back!');
      navigation.navigate('home'); // or your main dashboard
    } else {
      navigation.navigate('complete-profile', { email });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      <Text style={[styles.title, { color: theme.tint }]}>Welcome!</Text>
      <Text style={[styles.subtitle, { color: theme.text }]}>
        {step === 'email' ? 'Sign In' : 'Enter OTP'}
      </Text>
      <Text style={[styles.description, { color: theme.text }]}>
        {step === 'email' ? 'Enter your email to receive a secure OTP' : `OTP sent to ${email}`}
      </Text>

      {/* EMAIL INPUT */}
      {step === 'email' && (
        <>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.text }]}>Email</Text>
            <View
              style={[styles.inputBox, { borderColor: theme.border, backgroundColor: theme.card }]}
            >
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="you@example.com"
                placeholderTextColor={theme.icon}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={handleEmailChange}
              />
              {isValidEmail && <Ionicons name="checkmark-circle" size={20} color={theme.tint} />}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.tint }]}
            onPress={handleSendOtp}
          >
            <Text style={styles.buttonText}>Send OTP</Text>
          </TouchableOpacity>
        </>
      )}

      {/* OTP INPUT */}
      {step === 'otp' && (
        <>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.text }]}>OTP</Text>
            <View
              style={[styles.inputBox, { borderColor: theme.border, backgroundColor: theme.card }]}
            >
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="1234"
                placeholderTextColor={theme.icon}
                keyboardType="numeric"
                maxLength={4}
                value={otp}
                onChangeText={setOtp}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.tint }]}
            onPress={handleVerifyOtp}
          >
            <Text style={styles.buttonText}>Verify & Continue</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 14,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
