import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { DateService } from '@/services/DateService';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DateHeaderProps {
  date: string;
  entriesCount?: number;
  onCalendarPress?: () => void;
}

export function DateHeader({ date, entriesCount, onCalendarPress }: DateHeaderProps) {
  const displayText = DateService.formatDisplay(date);
  const fullDate = DateService.formatFullDate(date);
  const dayOfWeek = DateService.getDayOfWeek(date);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Text style={styles.dateText}>{displayText}</Text>
          <Text style={styles.fullDateText}>{dayOfWeek}, {fullDate}</Text>
        </View>
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
  titleContainer: {
    flex: 1,
  },
  dateText: {
    ...Typography.display,
    color: Colors.text0,
  },
  fullDateText: {
    ...Typography.small,
    color: Colors.text2,
    marginTop: Spacing.xs,
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
