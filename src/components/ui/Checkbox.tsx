import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { IconSymbol } from './icon-symbol';

interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
  size?: number;
}

export function Checkbox({ checked, onToggle, size = 20 }: CheckboxProps) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    checkbox: {
      borderRadius: 4,
      borderWidth: 2,
      borderColor: colors.border0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checked: {
      backgroundColor: colors.accent0,
      borderColor: colors.accent0,
    },
  });

  return (
    <TouchableOpacity
      style={[styles.checkbox, { width: size, height: size }, checked && styles.checked]}
      onPress={onToggle}
      activeOpacity={0.7}>
      {checked && (
        <IconSymbol name="checkmark" size={size * 0.7} color={colors.bg0} />
      )}
    </TouchableOpacity>
  );
}
