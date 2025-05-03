import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [profile, setProfile] = useState({
    fullName: '',
    password: '',
    mobile: '',
    email: '',
    address: '',
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>My Profile</Text>
      </View>

      <View style={styles.avatar} />

      <View style={styles.form}>
        <Text style={styles.label}>Full Name-</Text>
        <TextInput
          style={styles.input}
          value={profile.fullName}
          onChangeText={(text) => setProfile({ ...profile, fullName: text })}
        />

        <Text style={styles.label}>Password-</Text>
        <View style={styles.passwordRow}>
          <TextInput
            style={styles.input}
            secureTextEntry={!passwordVisible}
            value={profile.password}
            onChangeText={(text) => setProfile({ ...profile, password: text })}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <Text style={styles.showText}>Show</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Mobile Number-</Text>
        <TextInput
          style={styles.input}
          keyboardType="phone-pad"
          value={profile.mobile}
          onChangeText={(text) => setProfile({ ...profile, mobile: text })}
        />

        <Text style={styles.label}>Email Id-</Text>
        <TextInput
          style={styles.input}
          keyboardType="email-address"
          value={profile.email}
          onChangeText={(text) => setProfile({ ...profile, email: text })}
        />

        <Text style={styles.label}>Address-</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={4}
          value={profile.address}
          onChangeText={(text) => setProfile({ ...profile, address: text })}
        />
      </View>

      <TouchableOpacity style={styles.editButton}>
        <Ionicons name="create" size={24} color="white" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f3f4f6',
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    backgroundColor: '#3b82f6',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  avatar: {
    height: 80,
    width: 80,
    borderRadius: 10,
    backgroundColor: '#e5e7eb',
    alignSelf: 'center',
    marginBottom: 20,
  },
  form: {
    gap: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  showText: {
    marginLeft: 10,
    color: 'gray',
  },
  textArea: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    height: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  editButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#3b82f6',
    padding: 15,
    borderRadius: 30,
    elevation: 3,
  },
});
