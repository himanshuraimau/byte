import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { ThemedView } from '@/components/ui/themed-view';
import { ThemedText } from '@/components/ui/themed-text';
import { Colors, Spacing } from '@/constants/theme';

export default function TimerScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title">Timer</ThemedText>
        <ThemedText style={styles.subtitle}>
          Timer interface will be implemented in Phase 7
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  content: {
    alignItems: 'center',
    gap: Spacing.base,
  },
  subtitle: {
    marginTop: Spacing.base,
    textAlign: 'center',
  },
});
