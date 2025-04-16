import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import * as Haptics from 'expo-haptics';

const Emergency = () => {
  const { top, bottom } = useSafeAreaInsets();
  const [issue, setIssue] = useState('');
  const theme = Colors[useColorScheme() ?? 'light'];
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!issue.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Keyboard.dismiss();
    console.log('Issue submitted:', issue);
    setIsSubmitted(true);
    setIssue('');
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: top + 10,
        paddingBottom: bottom,
        backgroundColor: theme.background,
      }}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerContainer}>
          <Ionicons
            name="help-circle-outline"
            size={32}
            color={theme.tint}
            style={styles.headerIcon}
          />
          <Text style={[styles.title, { color: theme.text }]}>GoByBus Help</Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <View style={styles.contactContainer}>
            <Ionicons name="call-outline" size={24} color={theme.tint} />
            <Text style={[styles.helpNumber, { color: theme.text }]}>
              Help Number: 1800-XXX-XXXX
            </Text>
          </View>

          <View style={styles.divider} />

          <Text style={[styles.label, { color: theme.text }]}>Report an issue</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
                color: theme.text,
              },
            ]}
            placeholder="Type your issue here..."
            placeholderTextColor={theme.icon}
            value={issue}
            onChangeText={setIssue}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: theme.tint, opacity: issue.trim() ? 1 : 0.45 },
            ]}
            onPress={handleSubmit}
            disabled={issue.trim() ? false : true}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>

          {isSubmitted && (
            <View style={styles.successContainer}>
              <Ionicons name="checkmark-circle" size={20} color={theme.success} />
              <Text style={[styles.successText, { color: theme.success }]}>
                Issue reported successfully!
              </Text>
            </View>
          )}

          <Text style={[styles.note, { color: theme.icon }]}>
            Don't panic! We are reaching you ASAP.
          </Text>
        </View>

        <View style={[styles.tipsCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.tipsTitle, { color: theme.text }]}>Quick Tips</Text>
          <View style={styles.tipItem}>
            <Ionicons name="information-circle" size={18} color={theme.tint} />
            <Text style={[styles.tipText, { color: theme.text }]}>
              Include your bus number if known
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="information-circle" size={18} color={theme.tint} />
            <Text style={[styles.tipText, { color: theme.text }]}>
              Describe your location if possible
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="information-circle" size={18} color={theme.tint} />
            <Text style={[styles.tipText, { color: theme.text }]}>
              For emergencies, call the number above immediately
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  headerIcon: {
    marginRight: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  helpNumber: {
    fontSize: 16,
    marginLeft: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#E1E3E6',
    marginVertical: 15,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    minHeight: 120,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  note: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  successText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  tipsCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
  },
});

export default Emergency;
