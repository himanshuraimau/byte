import { Radius, Spacing, Typography } from "@/constants/theme";
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
      ...Typography.small,
      color: colors.text1,
      marginBottom: Spacing.sm,
      textTransform: "capitalize",
    },
    inputWrapper: {
      backgroundColor: colors.bg1,
      borderWidth: 1,
      borderColor: colors.border1,
      borderRadius: Radius.md,
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.sm,
    },
    input: {
      ...Typography.body,
      color: colors.text0,
      fontSize: 16,
      minHeight: 48,
    },
    inputError: {
      borderColor: colors.destructive,
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
      <View style={[styles.inputWrapper, error && styles.inputError]}>
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.text3}
          {...props}
        />
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}
