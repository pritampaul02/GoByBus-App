import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const App: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(false);

  const handleEmailChange = (text: string) => {
    setEmail(text);
    setIsValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text));
  };

  const handleVerify = () => {
    if (isValid) {
      alert(`Verified: ${email}`);
    } else {
      alert('Please enter a valid email');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.subtitle}>Sign in</Text>
      <Text style={styles.description}>Please log in into your account</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.input}
            placeholder="myemail@gmail.com"
            value={email}
            onChangeText={handleEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {isValid && <Ionicons name="checkmark" size={20} color="green" />}
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;






const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f4f4f4',
      paddingHorizontal: 24,
      justifyContent: 'center',
    },
    title: {
      fontSize: 30,
      color: '#24C31E',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 24,
      color: '#24C31E',
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: 4,
    },
    description: {
      fontSize: 14,
      color: '#333',
      textAlign: 'center',
      marginBottom: 30,
      marginTop: 6,
    },
    label: {
      fontSize: 14,
      color: '#333',
      marginBottom: 6,
    },
    inputContainer: {
      marginBottom: 20,
    },
    inputBox: {
      backgroundColor: '#fff',
      borderRadius: 6,
      paddingHorizontal: 12,
      paddingVertical: 10,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#ddd',
    },
    input: {
      flex: 1,
      fontSize: 16,
    },
    button: {
      backgroundColor: '#24C31E',
      paddingVertical: 14,
      borderRadius: 6,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      textAlign: 'center',
      fontWeight: '600',
    },
  });
  
