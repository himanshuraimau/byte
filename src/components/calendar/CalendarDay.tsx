import { Colors, Radius, Typography } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CalendarDayProps {
  date: Date;
  isToday: boolean;
  isSelected: boolean;
  hasEntries: boolean;
  onPress: () => void;
  disabled?: boolean;
}

export function CalendarDay({
  date,
  isToday,
  isSelected,
  hasEntries,
  onPress,
  disabled = false,
}: CalendarDayProps) {
  const dayNumber = date.getDate();

  return (
    <TouchableOpacity
      style={[
        styles.day,
        isSelected && styles.daySelected,
        disabled && styles.dayDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}>
      <Text
        style={[
          styles.dayText,
          isSelected && styles.dayTextSelected,
          disabled && styles.dayTextDisabled,
        ]}>
        {dayNumber}
      </Text>
      {hasEntries && <View style={styles.dot} />}
      {isToday && !isSelected && <View style={styles.todayBorder} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  day: {
    width: '100%',
    maxWidth: '100%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.sm,
    position: 'relative',
  },
  daySelected: {
    backgroundColor: Colors.accent0,
  },
  dayDisabled: {
    opacity: 0.3,
  },
  dayText: {
    ...Typography.monoSm,
    color: Colors.text0,
  },
  dayTextSelected: {
    color: Colors.bg0,
  },
  dayTextDisabled: {
    color: Colors.text3,
  },
  dot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.accent0,
  },
  todayBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.accent0,
  },
});
