import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

const ReportProblemScreen = () => {
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    // You can add your submit logic here
    alert('Message submitted!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.reportButton}>
        <Text style={styles.reportButtonText}>Report</Text>
      </TouchableOpacity>

      <Text style={styles.infoText}>Kindly, describe your problem with us</Text>
      <Text style={[styles.infoText, { fontWeight: 'bold' }]}>We Are Here To Listen You</Text>

      <TextInput
        style={styles.textArea}
        placeholder="Type your message..."
        multiline
        value={message}
        onChangeText={setMessage}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ReportProblemScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    padding: 20,
  },
  reportButton: {
    backgroundColor: '#B00000',
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginTop: 20,
    marginBottom: 20,
  },
  reportButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoText: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 4,
  },
  textArea: {
    width: '100%',
    height: 120,
    backgroundColor: '#EAEAEA',
    borderRadius: 10,
    padding: 10,
    textAlignVertical: 'top',
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: '#3399FF',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
