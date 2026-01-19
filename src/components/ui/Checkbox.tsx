import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Colors, Radius } from '@/constants/theme';
import { IconSymbol } from './icon-symbol';

interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
  size?: number;
}

export function Checkbox({ checked, onToggle, size = 20 }: CheckboxProps) {
  return (
    <TouchableOpacity
      style={[styles.checkbox, { width: size, height: size }, checked && styles.checked]}
      onPress={onToggle}
      activeOpacity={0.7}>
      {checked && (
        <IconSymbol name="checkmark" size={size * 0.7} color={Colors.bg0} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  checkbox: {
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.border0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {
    backgroundColor: Colors.accent0,
    borderColor: Colors.accent0,
  },
});
