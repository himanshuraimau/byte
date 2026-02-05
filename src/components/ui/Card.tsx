import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Radius, Shadows, Spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
}

export function Card({ children, style }: CardProps) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.bg0,
      borderRadius: Radius.lg,
      padding: Spacing.lg,
      marginBottom: Spacing.base,
      ...Shadows.z1,
    },
  });

  return <View style={[styles.card, style]}>{children}</View>;
}
