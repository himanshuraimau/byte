import { Colors, Radius, Spacing, Typography } from "@/constants/theme";
import { DateService } from "@/services/DateService";
import { TemporalMode } from "@/types/entities";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface SegmentedControlProps {
  value: TemporalMode;
  selectedDate?: string;
  onChange: (value: TemporalMode) => void;
}

export function SegmentedControl({
  value,
  selectedDate,
  onChange,
}: SegmentedControlProps) {
  const segments: { label: string; value: TemporalMode }[] = [
    { label: "YESTERDAY", value: "yesterday" },
    { label: "TODAY", value: "today" },
    { label: "TOMORROW", value: "tomorrow" },
  ];

  // If we're in custom mode and have a selectedDate, show it
  if (value === "custom" && selectedDate) {
    const customLabel = DateService.formatDisplay(selectedDate);
    return (
      <View style={styles.container}>
        <View
          style={[styles.segment, styles.segmentActive, styles.customSegment]}
        >
          <Text style={[styles.segmentText, styles.segmentTextActive]}>
            {customLabel}
          </Text>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {segments.map((segment) => {
        const isActive = value === segment.value;
        return (
          <TouchableOpacity
            key={segment.value}
            style={[styles.segment, isActive && styles.segmentActive]}
            onPress={() => onChange(segment.value)}
            activeOpacity={0.7}
          >
            <Text
              style={[styles.segmentText, isActive && styles.segmentTextActive]}
            >
              {segment.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: Colors.bg1,
    borderRadius: Radius.md,
    padding: 4,
    gap: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.base,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentActive: {
    backgroundColor: Colors.bg0,
    ...Typography.body,
  },
  segmentText: {
    ...Typography.body,
    fontWeight: "500",
    color: Colors.text2,
    fontSize: 14,
  },
  segmentTextActive: {
    color: Colors.text0,
  },
  customSegment: {
    flex: 1,
  },
});
