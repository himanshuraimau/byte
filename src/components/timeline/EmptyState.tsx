import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message = 'No entries yet' }: EmptyStateProps) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      paddingVertical: Spacing['3xl'],
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      ...Typography.body,
      color: colors.text2,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}
