import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Spacing } from '@/constants/theme';
import { Button } from '@/components/ui/Button';

interface TimerActionsProps {
  onComplete: () => void;
  onCancel: () => void;
  canComplete: boolean;
  loading?: boolean;
}

export function TimerActions({ onComplete, onCancel, canComplete, loading = false }: TimerActionsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          title="✓ COMPLETE"
          onPress={onComplete}
          disabled={!canComplete || loading}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="✕ CANCEL"
          variant="destructive"
          onPress={onCancel}
          disabled={loading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.base,
    width: '100%',
    paddingHorizontal: Spacing.xl,
  },
  buttonContainer: {
    width: '100%',
  },
});
