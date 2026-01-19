import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '@/constants/theme';
import { DateService } from '@/services/DateService';

interface DateHeaderProps {
  date: string;
  entriesCount?: number;
}

export function DateHeader({ date, entriesCount }: DateHeaderProps) {
  const displayText = DateService.formatDisplay(date);

  return (
    <View style={styles.container}>
      <Text style={styles.dateText}>{displayText}</Text>
      {entriesCount !== undefined && (
        <View style={styles.metadata}>
          <Text style={styles.metadataText}>[TIMELINE_ACTIVE]</Text>
          <Text style={styles.metadataText}>[ENTRIES: {entriesCount}]</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing['2xl'],
    marginBottom: Spacing.xl,
  },
  dateText: {
    ...Typography.display,
    color: Colors.text0,
    marginBottom: Spacing.sm,
  },
  metadata: {
    flexDirection: 'row',
    gap: Spacing.base,
  },
  metadataText: {
    ...Typography.monoXs,
    color: Colors.text2,
  },
});
