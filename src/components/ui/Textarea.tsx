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

interface TextareaProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, style, ...props }: TextareaProps) {
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
    textarea: {
      ...Typography.body,
      color: colors.text0,
      lineHeight: 24,
      minHeight: 150,
      borderBottomWidth: 1,
      borderBottomColor: colors.border0,
      paddingVertical: Spacing.lg,
      paddingHorizontal: 0,
      fontSize: 16,
    },
    textareaError: {
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
        style={[styles.textarea, error && styles.textareaError, style]}
        placeholderTextColor={colors.text3}
        multiline
        textAlignVertical="top"
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}
