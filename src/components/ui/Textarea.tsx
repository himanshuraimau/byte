import { Colors, Spacing, Typography } from "@/constants/theme";
import React from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    View,
} from "react-native";

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
    textTransform: "uppercase",
  },
  textarea: {
    ...Typography.body,
    color: Colors.text0,
    lineHeight: 24,
    minHeight: 150,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border0,
    paddingVertical: Spacing.lg,
    paddingHorizontal: 0,
    fontSize: 16,
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
