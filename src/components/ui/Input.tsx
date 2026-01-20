import { Colors, Spacing, Typography } from "@/constants/theme";
import React from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    View,
} from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, style, ...props }: InputProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error && styles.inputError, style]}
        placeholderTextColor={Colors.text3}
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
  input: {
    ...Typography.body,
    color: Colors.text0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border0,
    paddingVertical: Spacing.lg,
    paddingHorizontal: 0,
    fontSize: 16,
  },
  inputError: {
    borderBottomColor: Colors.destructive,
  },
  error: {
    ...Typography.small,
    color: Colors.destructive,
    marginTop: Spacing.sm,
  },
});
