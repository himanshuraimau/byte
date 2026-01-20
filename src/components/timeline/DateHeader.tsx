import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing } from '@/constants/theme';
import { DateService } from '@/services/DateService';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface DateHeaderProps {
  date: string;
  entriesCount?: number;
  onCalendarPress?: () => void;
}

export function DateHeader({ date, entriesCount, onCalendarPress }: DateHeaderProps) {
  const displayText = DateService.formatDisplay(date);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.dateText}>{displayText}</Text>
        {onCalendarPress && (
          <TouchableOpacity onPress={onCalendarPress} style={styles.calendarButton}>
            <IconSymbol name="calendar" size={24} color={Colors.text2} />
          </TouchableOpacity>
        )}
      </View>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  dateText: {
    ...Typography.display,
    color: Colors.text0,
    flex: 1,
  },
  calendarButton: {
    padding: Spacing.sm,
    marginLeft: Spacing.base,
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
