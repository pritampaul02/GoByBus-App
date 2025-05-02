import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const BusInput = ({}) => {
  return (
    <>
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.text }]}>Bus Number &#x28;Optional&#x29;</Text>
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: theme.card,
              borderColor: errors.busNumber ? 'red' : theme.border,
            },
          ]}
        >
          <Ionicons name="bus-outline" size={20} color={theme.tint} style={styles.inputIcon} />
          <TextInput
            placeholder="B-145 (Optional)"
            placeholderTextColor={theme.icon}
            style={[styles.input, { color: theme.text }]}
            value={busNumber}
            onChangeText={setBusNumber}
          />
        </View>
        {errors.busNumber && <Text style={styles.errorText}>{errors.busNumber}</Text>}
      </View>
    </>
  );
};

export default BusInput;

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 4,
  },
});
