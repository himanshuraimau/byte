import { Colors } from "@/constants/theme";
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
  const dayNumber = date.getDate();

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
    borderColor: "#CCCCCC",
  },
  daySelected: {
    backgroundColor: Colors.accent0,
    borderWidth: 0,
  },
  dayDisabled: {
    opacity: 0.3,
  },
  dayText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#000000",
    fontFamily: "System",
  },
  dayTextSelected: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  dayTextDisabled: {
    color: "#999999",
  },
  dot: {
    position: "absolute",
    bottom: 6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.accent0,
  },
  todayDot: {
    position: "absolute",
    bottom: 6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#666666",
  },
});
