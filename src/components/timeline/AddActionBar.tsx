import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Radius, Shadows, Spacing } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface AddActionBarProps {
  onAddTask: () => void;
  onAddNote: () => void;
  onAddSession: () => void;
}

export function AddActionBar({ onAddTask, onAddNote, onAddSession }: AddActionBarProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.action} onPress={onAddTask} activeOpacity={0.8}>
        <IconSymbol name="plus" size={20} color={Colors.text2} />
        <Text style={styles.actionText}>TASK</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.action} onPress={onAddNote} activeOpacity={0.8}>
        <IconSymbol name="doc.text" size={20} color={Colors.text2} />
        <Text style={styles.actionText}>NOTE</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.action} onPress={onAddSession} activeOpacity={0.8}>
        <IconSymbol name="clock" size={20} color={Colors.text2} />
        <Text style={styles.actionText}>SESSION</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.bg0,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.base,
    gap: Spacing.base,
    ...Shadows.z2,
  },
  action: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
  },
  actionText: {
    ...Typography.monoXs,
    color: Colors.text2,
    textTransform: 'uppercase',
  },
});
