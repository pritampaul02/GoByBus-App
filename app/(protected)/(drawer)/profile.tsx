import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>My Profile</Text>

        <View style={styles.profileImagePlaceholder} />

        <View style={styles.formGroup}>
          <Text style={styles.label}>Full Name-</Text>
          <TextInput style={styles.input} placeholder="Enter full name" />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Password-</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Enter password"
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Text style={styles.showText}>{showPassword ? 'Hide' : 'Show'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Mobile Number-</Text>
          <TextInput style={styles.input} placeholder="Enter mobile number" keyboardType="phone-pad" />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email Id-</Text>
          <TextInput style={styles.input} placeholder="Enter email" keyboardType="email-address" />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Address-</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter address"
            multiline={true}
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity style={styles.floatingButton}>
          <Ionicons name="create-outline" size={24} color="white" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  scrollContainer: {
    padding: 20,
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#3399FF',
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginBottom: 20,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    marginBottom: 20,
  },
  formGroup: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#EAEAEA',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  showText: {
    marginLeft: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  floatingButton: {
    backgroundColor: '#3399FF',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 20,
  },
});
