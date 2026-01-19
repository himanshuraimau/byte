import React from 'react';
import { TextInput, StyleSheet, TextInputProps, View, Text } from 'react-native';
import { Colors, Typography, Spacing } from '@/constants/theme';

interface TextareaProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, style, ...props }: TextareaProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.textarea, error && styles.textareaError, style]}
        placeholderTextColor={Colors.text3}
        multiline
        textAlignVertical="top"
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.base,
  },
  label: {
    ...Typography.monoSm,
    color: Colors.text1,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
  },
  textarea: {
    ...Typography.body,
    color: Colors.text0,
    lineHeight: Typography.body.lineHeight,
    minHeight: 100,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border0,
    paddingVertical: Spacing.md,
    paddingHorizontal: 0,
  },
  textareaError: {
    borderBottomColor: Colors.destructive,
  },
  error: {
    ...Typography.small,
    color: Colors.destructive,
    marginTop: Spacing.sm,
  },
});
