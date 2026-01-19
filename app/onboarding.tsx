import { Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function OnboardingScreen() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { createUser } = useUser();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }

    try {
      setError('');
      await createUser(name.trim());
      // Navigate to main app
      router.replace('/(tabs)');
    } catch (err) {
      setError('Failed to save your name. Please try again.');
      console.error('Error creating user:', err);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Welcome to Byte</Text>
          <Text style={styles.subtitle}>Let's get started</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>What's your name?</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor={Colors.text3}
              value={name}
              onChangeText={(text) => {
                setName(text);
                setError('');
              }}
              onSubmitEditing={handleSubmit}
              autoFocus
              returnKeyType="done"
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, !name.trim() && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={!name.trim()}>
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  card: {
    backgroundColor: Colors.bg0,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    width: '100%',
    maxWidth: 400,
    ...Shadows.z3,
  },
  title: {
    ...Typography.h1,
    color: Colors.text0,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.text1,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  inputContainer: {
    marginBottom: Spacing.xl,
  },
  label: {
    ...Typography.monoSm,
    color: Colors.text1,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
  },
  input: {
    ...Typography.body,
    color: Colors.text0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border0,
    paddingVertical: Spacing.md,
    paddingHorizontal: 0,
  },
  error: {
    ...Typography.small,
    color: Colors.destructive,
    marginTop: Spacing.sm,
  },
  buttonContainer: {
    marginTop: Spacing.lg,
  },
  button: {
    backgroundColor: Colors.accent0,
    borderRadius: Radius.md,
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    ...Typography.body,
    fontWeight: '500',
    color: Colors.bg0,
  },
});
