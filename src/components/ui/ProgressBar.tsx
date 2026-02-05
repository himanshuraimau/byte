import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

interface ProgressBarProps {
  progress: number; // 0-100
  showPercentage?: boolean;
  height?: number;
}

export function ProgressBar({ progress, showPercentage = true, height = 4 }: ProgressBarProps) {
  const { colors } = useTheme();
  const clampedProgress = Math.max(0, Math.min(100, progress));

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    track: {
      flex: 1,
      backgroundColor: colors.bg2,
      borderRadius: 2,
      overflow: 'hidden',
    },
    fill: {
      backgroundColor: colors.accent0,
      borderRadius: 2,
    },
    percentage: {
      ...Typography.monoSm,
      color: colors.accent0,
      minWidth: 40,
      textAlign: 'right',
    },
  });

  return (
    <View style={styles.container}>
      <View style={[styles.track, { height }]}>
        <View style={[styles.fill, { width: `${clampedProgress}%`, height }]} />
      </View>
      {showPercentage && (
        <Text style={styles.percentage}>{Math.round(clampedProgress)}%</Text>
      )}
    </View>
  );
}
