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
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';

export default function CompleteProfile() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'passenger' | 'driver'>('passenger');
  const [vehicleNo, setVehicleNo] = useState('');
  const [aadhaar, setAadhaar] = useState('');

  const formData = { name, phone, role, vehicleNo, aadhaar };

  const handleSubmit = () => {
    if (!name || !phone) {
      return Alert.alert('Missing Fields', 'Please fill all required details.');
    }
    if (role === 'driver' && (!vehicleNo || !aadhaar)) {
      return Alert.alert('Missing Details', 'Please provide your vehicle No and Aadhaar.');
    }
    console.log('🚀 ~ CompleteProfile ~ formData:', formData);

    Alert.alert('Success', `Welcome ${name}!`);
    router.navigate('/(drawer)/(tabs)/search');
  };

  return (
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
          value={phone}
          onChangeText={setPhone}
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

        {/* Driver-only Fields */}
        {role === 'driver' && (
          <>
            <InputField
              label="Vehicle No"
              value={vehicleNo}
              onChangeText={setVehicleNo}
              placeholder="WB03X0021"
              theme={theme}
            />
            <InputField
              label="Aadhaar No"
              value={aadhaar}
              onChangeText={setAadhaar}
              placeholder="1200-XXXX-1258"
              keyboardType="numeric"
              maxLength={12}
              theme={theme}
            />
          </>
        )}

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.tint }]}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>Finish Registration</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
    paddingTop: Platform.OS === 'android' ? 50 : 70,
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
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
// import { router, useLocalSearchParams, useNavigation } from 'expo-router';
// import { useColorScheme } from 'react-native';
// import { Colors } from '@/constants/Colors';

// export default function CompleteProfile() {
//   const { email } = useLocalSearchParams<{ email: string }>();
//   const colorScheme = useColorScheme();
//   const theme = Colors[colorScheme ?? 'light'];
//   const navigation = useNavigation();

//   // sates for form controll
//   const [name, setName] = useState('');
//   const [phone, setPhone] = useState('');
//   const [role, setRole] = useState<'passenger' | 'driver'>('passenger');
//   const [vehicleNo, setVehicleNo] = useState('');
//   const [aadhaar, setAadhaar] = useState<number | undefined>(undefined);

//   const handleSubmit = () => {
//     if (!name || !phone || !role) {
//       Alert.alert('Missing Fields', 'Please fill all required details.');
//       return;
//     }

//     if (role === 'driver' && !vehicleNo && !aadhaar) {
//       Alert.alert('Missing Details', 'Please provide your vehicle No and Aadhaar Details.');
//       return;
//     }

//     Alert.alert('Success', `Welcome ${name}!`);
//     router.navigate('/(drawer)/(tabs)/search');
//   };

//   return (
//     <View style={[styles.container, { backgroundColor: theme.background }]}>
//       <Text style={[styles.heading, { color: theme.tint }]}>Complete Your Profile</Text>

//       <Text style={[styles.subheading, { color: theme.text }]}>{email}</Text>

//       {/* Name */}
//       <View style={styles.inputContainer}>
//         <Text style={[styles.label, { color: theme.text }]}>Full Name</Text>
//         <TextInput
//           style={[
//             styles.input,
//             { borderColor: theme.border, color: theme.text, backgroundColor: theme.card },
//           ]}
//           placeholder="John Doe"
//           placeholderTextColor={theme.icon}
//           value={name}
//           onChangeText={setName}
//         />
//       </View>
//       {/* Email */}
//       <View style={styles.inputContainer}>
//         <Text style={[styles.label, { color: theme.text }]}>Email</Text>
//         <TextInput
//           style={[
//             styles.input,
//             { borderColor: theme.border, color: theme.text, backgroundColor: theme.card },
//           ]}
//           value={email}
//           editable={false}
//         />
//       </View>

//       {/* Phone */}
//       <View style={styles.inputContainer}>
//         <Text style={[styles.label, { color: theme.text }]}>Phone Number</Text>
//         <TextInput
//           style={[
//             styles.input,
//             { borderColor: theme.border, color: theme.text, backgroundColor: theme.card },
//           ]}
//           placeholder="+91 9876543210"
//           placeholderTextColor={theme.icon}
//           keyboardType="phone-pad"
//           value={phone}
//           onChangeText={setPhone}
//         />
//       </View>

//       {/* Role selection */}
//       <View style={styles.inputContainer}>
//         <Text style={[styles.label, { color: theme.text }]}>Account Type</Text>
//         <View style={styles.roleButtons}>
//           {['passenger', 'driver'].map((r) => (
//             <TouchableOpacity
//               key={r}
//               onPress={() => setRole(r as 'passenger' | 'driver')}
//               style={[
//                 styles.roleButton,
//                 {
//                   backgroundColor: role === r ? theme.tint : theme.card,
//                   borderColor: theme.border,
//                 },
//               ]}
//             >
//               <Text style={{ color: role === r ? '#fff' : theme.text, fontWeight: '600' }}>
//                 {r.charAt(0).toUpperCase() + r.slice(1)}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>

//       {/* Vehicle input for drivers */}
//       {role === 'driver' && (
//         <>
//           <View style={styles.inputContainer}>
//             <Text style={[styles.label, { color: theme.text }]}>Vehicle No</Text>
//             <TextInput
//               style={[
//                 styles.input,
//                 { borderColor: theme.border, color: theme.text, backgroundColor: theme.card },
//               ]}
//               placeholder="WB03X0021"
//               placeholderTextColor={theme.icon}
//               value={vehicleNo}
//               onChangeText={setVehicleNo}
//             />
//           </View>
//           <View style={styles.inputContainer}>
//             <Text style={[styles.label, { color: theme.text }]}>Aadhaar No</Text>
//             <TextInput
//               style={[
//                 styles.input,
//                 { borderColor: theme.border, color: theme.text, backgroundColor: theme.card },
//               ]}
//               keyboardType="numeric"
//               maxLength={12}
//               placeholder="1200-XXXX-1258"
//               placeholderTextColor={theme.icon}
//               value={aadhaar ? String(aadhaar) : ''}
//               onChangeText={(text) => setAadhaar(Number(text))}
//             />
//           </View>
//         </>
//       )}

//       {/* Submit */}
//       <TouchableOpacity
//         style={[styles.button, { backgroundColor: theme.tint }]}
//         onPress={handleSubmit}
//       >
//         <Text style={styles.buttonText}>Finish Registration</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingHorizontal: 24,
//     paddingTop: Platform.OS === 'android' ? 50 : 70,
//   },
//   heading: {
//     fontSize: 28,
//     fontWeight: '700',
//     textAlign: 'center',
//   },
//   subheading: {
//     fontSize: 14,
//     textAlign: 'center',
//     marginTop: 6,
//     marginBottom: 24,
//     opacity: 0.7,
//   },
//   inputContainer: {
//     marginBottom: 18,
//   },
//   label: {
//     fontSize: 14,
//     marginBottom: 6,
//     fontWeight: '500',
//   },
//   input: {
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     fontSize: 16,
//   },
//   roleButtons: {
//     flexDirection: 'row',
//     gap: 10,
//     marginTop: 6,
//   },
//   roleButton: {
//     flex: 1,
//     paddingVertical: 12,
//     borderWidth: 1,
//     borderRadius: 6,
//     alignItems: 'center',
//   },
//   button: {
//     marginTop: 28,
//     paddingVertical: 14,
//     borderRadius: 8,
//   },
//   buttonText: {
//     textAlign: 'center',
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });
