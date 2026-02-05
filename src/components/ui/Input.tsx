import { Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
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
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      marginBottom: Spacing.base,
    },
    label: {
      ...Typography.monoSm,
      color: colors.text1,
      marginBottom: Spacing.sm,
      textTransform: "uppercase",
    },
    input: {
      ...Typography.body,
      color: colors.text0,
      borderBottomWidth: 1,
      borderBottomColor: colors.border0,
      paddingVertical: Spacing.lg,
      paddingHorizontal: 0,
      fontSize: 16,
    },
    inputError: {
      borderBottomColor: colors.destructive,
    },
    error: {
      ...Typography.small,
      color: colors.destructive,
      marginTop: Spacing.sm,
    },
  });

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error && styles.inputError, style]}
        placeholderTextColor={colors.text3}
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}
