import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { SendEmail, VerifyOtp } from '@/services/auth';
import { useAuthStore } from '@/store/useAuthStore';

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const navigation = useNavigation();

  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState<string>('');
  const [isValidEmail, setIsValidEmail] = useState<boolean>(false);
  const [otp, setOtp] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const handleEmailChange = (text: string) => {
    setEmail(text);
    setIsValidEmail(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text));
  };

  const handleSendOtp = async () => {
    if (!isValidEmail) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    try {
      setLoading(true);
      const response = await SendEmail({ email });

      console.log('🚀 ~ handleSendOtp ~ response:', response);
      if (response?.success === true) {
        setStep('otp');
        Alert.alert('Success', 'OTP sent to your email.');
      }
    } catch (error) {
      console.log('🚀 ~ handleSendOtp ~ error:', error);

      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp === undefined || String(otp)?.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter the 6-digit OTP sent to your email.');
      return;
    }

    try {
      setLoading(true);
      const { status, user } = await VerifyOtp({ otp });
      if (status === 'existing') {
        Alert.alert('Login Success', `Welcome back ${user.name || ''}!`);
        router.dismissAll();
        router.navigate('/(drawer)/(tabs)/search');
      } else {
        navigation.navigate('complete-profile', { email });
      }
    } catch (error) {
      console.log('🚀 ~ handleVerifyOtp ~ error:', error);
      Alert.alert('Error', 'Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
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
            style={[styles.button, { backgroundColor: theme.tint, opacity: loading ? 0.7 : 1 }]}
            onPress={handleSendOtp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Send OTP</Text>
            )}
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
                placeholder="123456"
                placeholderTextColor={theme.icon}
                keyboardType="numeric"
                maxLength={6}
                value={otp ? String(otp) : ''}
                onChangeText={(text) => setOtp(Number(text))}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.tint, opacity: loading ? 0.7 : 1 }]}
            onPress={handleVerifyOtp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Verify & Continue</Text>
            )}
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

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   StatusBar,
//   Alert,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { router, useNavigation } from 'expo-router';
// import { useColorScheme } from 'react-native';
// import { Colors } from '@/constants/Colors';
// import { SendEmail, VerifyOtp } from '@/services/auth';
// import { useAuthStore } from '@/store/useAuthStore';

// export default function LoginScreen() {
//   const colorScheme = useColorScheme();
//   const theme = Colors[colorScheme ?? 'light'];
//   const navigation = useNavigation();

//   const [step, setStep] = useState<'email' | 'otp'>('email');
//   const [email, setEmail] = useState<string>('');
//   const [isValidEmail, setIsValidEmail] = useState<boolean>(false);
//   const [otp, setOtp] = useState<number | undefined>(undefined);

//   const handleEmailChange = (text: string) => {
//     setEmail(text);
//     setIsValidEmail(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text));
//   };

//   const handleSendOtp = async () => {
//     if (!isValidEmail) {
//       Alert.alert('Invalid Email', 'Please enter a valid email address.');
//       return;
//     }
//     try {
//       const response = await SendEmail({ email });
//       console.log(response);

//       if (response?.success === true) {
//         setStep('otp');
//         Alert.alert('Success', 'OTP sent to your email.');
//       }
//     } catch (error) {
//       console.error('Failed to send OTP');
//     }
//   };

//   const handleVerifyOtp = async () => {
//     if (otp === undefined || String(otp)?.length !== 6) {
//       Alert.alert('Invalid OTP', 'Please enter the 4-digit OTP sent to your email.');
//       return;
//     }

//     try {
//       const { status, user } = await VerifyOtp({ otp });
//       if (status === 'existing') {
//         Alert.alert('Login Success', `Welcome back ${user.name || ''}!`);
//         router.dismissAll();
//         router.navigate('/(drawer)/(tabs)/search');
//       } else {
//         navigation.navigate('complete-profile', { email });
//       }
//     } catch (error) {
//       console.error('Failed to verify OTP');
//     }
//   };

//   return (
//     <View style={[styles.container, { backgroundColor: theme.background }]}>
//       <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
//       <Text style={[styles.title, { color: theme.tint }]}>Welcome!</Text>
//       <Text style={[styles.subtitle, { color: theme.text }]}>
//         {step === 'email' ? 'Sign In' : 'Enter OTP'}
//       </Text>
//       <Text style={[styles.description, { color: theme.text }]}>
//         {step === 'email' ? 'Enter your email to receive a secure OTP' : `OTP sent to ${email}`}
//       </Text>

//       {/* EMAIL INPUT */}
//       {step === 'email' && (
//         <>
//           <View style={styles.inputContainer}>
//             <Text style={[styles.label, { color: theme.text }]}>Email</Text>
//             <View
//               style={[styles.inputBox, { borderColor: theme.border, backgroundColor: theme.card }]}
//             >
//               <TextInput
//                 style={[styles.input, { color: theme.text }]}
//                 placeholder="you@example.com"
//                 placeholderTextColor={theme.icon}
//                 keyboardType="email-address"
//                 autoCapitalize="none"
//                 value={email}
//                 onChangeText={handleEmailChange}
//               />
//               {isValidEmail && <Ionicons name="checkmark-circle" size={20} color={theme.tint} />}
//             </View>
//           </View>

//           <TouchableOpacity
//             style={[styles.button, { backgroundColor: theme.tint }]}
//             onPress={handleSendOtp}
//           >
//             <Text style={styles.buttonText}>Send OTP</Text>
//           </TouchableOpacity>
//         </>
//       )}

//       {/* OTP INPUT */}
//       {step === 'otp' && (
//         <>
//           <View style={styles.inputContainer}>
//             <Text style={[styles.label, { color: theme.text }]}>OTP</Text>
//             <View
//               style={[styles.inputBox, { borderColor: theme.border, backgroundColor: theme.card }]}
//             >
//               <TextInput
//                 style={[styles.input, { color: theme.text }]}
//                 placeholder="123456"
//                 placeholderTextColor={theme.icon}
//                 keyboardType="numeric"
//                 maxLength={6}
//                 value={otp ? String(otp) : ''}
//                 onChangeText={(text) => setOtp(Number(text))}
//               />
//             </View>
//           </View>

//           <TouchableOpacity
//             style={[styles.button, { backgroundColor: theme.tint }]}
//             onPress={handleVerifyOtp}
//           >
//             <Text style={styles.buttonText}>Verify & Continue</Text>
//           </TouchableOpacity>
//         </>
//       )}
//     </View>
//   );
// }
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingHorizontal: 24,
//     justifyContent: 'center',
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 4,
//   },
//   subtitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     textAlign: 'center',
//   },
//   description: {
//     fontSize: 14,
//     textAlign: 'center',
//     marginVertical: 14,
//   },
//   inputContainer: {
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 14,
//     marginBottom: 6,
//   },
//   inputBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 12,
//     paddingVertical: 12,
//     borderWidth: 1,
//     borderRadius: 8,
//   },
//   input: {
//     flex: 1,
//     fontSize: 16,
//   },
//   button: {
//     paddingVertical: 14,
//     borderRadius: 8,
//     marginTop: 10,
//   },
//   buttonText: {
//     textAlign: 'center',
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });
