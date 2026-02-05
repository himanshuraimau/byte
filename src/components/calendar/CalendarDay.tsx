import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
  const { colors, isDark } = useTheme();
  const dayNumber = date.getDate();
  const selectedTextColor = isDark ? colors.text0 : colors.bg0;

  const styles = StyleSheet.create({
    day: {
      width: `${100 / 7 - (8 * 6) / 7 / 100}%`,
      aspectRatio: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "transparent",
      borderRadius: 0,
    },
    dayToday: {
      borderWidth: 1,
      borderColor: colors.border1,
    },
    daySelected: {
      backgroundColor: colors.accent0,
      borderWidth: 0,
    },
    dayDisabled: {
      opacity: 0.3,
    },
    dayText: {
      fontSize: 16,
      fontWeight: "400",
      color: colors.text0,
      fontFamily: "System",
    },
    dayTextSelected: {
      color: selectedTextColor,
      fontWeight: "500",
    },
    dayTextDisabled: {
      color: colors.text3,
    },
    dot: {
      position: "absolute",
      bottom: 6,
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.accent0,
    },
    todayDot: {
      position: "absolute",
      bottom: 6,
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.text2,
    },
  });

  return (
    <TouchableOpacity
      style={[
        styles.day,
        isToday && !isSelected && styles.dayToday,
        isSelected && styles.daySelected,
        disabled && styles.dayDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.dayText,
          isSelected && styles.dayTextSelected,
          disabled && styles.dayTextDisabled,
        ]}
      >
        {dayNumber}
      </Text>
      {hasEntries && !isSelected && <View style={styles.dot} />}
      {isToday && !isSelected && <View style={styles.todayDot} />}
    </TouchableOpacity>
  );
}
