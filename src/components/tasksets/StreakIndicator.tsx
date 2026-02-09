import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Typography, Spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

interface StreakIndicatorProps {
  streak: number;
}

export function StreakIndicator({ streak }: StreakIndicatorProps) {
  const { colors } = useTheme();

  if (streak === 0) return null;

  const styles = StyleSheet.create({
    container: {
      borderWidth: 1,
      borderColor: colors.accent0,
      backgroundColor: colors.bg0,
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.sm,
      alignSelf: 'flex-start',
    },
    text: {
      ...Typography.small,
      fontFamily: Typography.fontFamilyMedium,
      color: colors.accent0,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {streak} day{streak !== 1 ? 's' : ''} streak
      </Text>
    </View>
  );
}
