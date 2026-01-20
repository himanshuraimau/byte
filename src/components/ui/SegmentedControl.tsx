import { Colors, Spacing } from "@/constants/theme";
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
    { label: "Yesterday", value: "yesterday" },
    { label: "Today", value: "today" },
    { label: "Tomorrow", value: "tomorrow" },
  ];

  // If we're in custom mode and have a selectedDate, show it
  if (value === "custom" && selectedDate) {
    const customLabel = DateService.formatDisplay(selectedDate);
    return (
      <View style={styles.wrapper}>
        <View style={styles.container}>
          <View style={[styles.segment, styles.segmentActive]}>
            <Text style={[styles.segmentText, styles.segmentTextActive]}>
              {customLabel}
            </Text>
          </View>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {segments.map((segment, index) => {
          const isActive = value === segment.value;
          return (
            <React.Fragment key={segment.value}>
              <TouchableOpacity
                style={[styles.segment, isActive && styles.segmentActive]}
                onPress={() => onChange(segment.value)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.segmentText,
                    isActive && styles.segmentTextActive,
                  ]}
                >
                  {segment.label}
                </Text>
              </TouchableOpacity>
              {index < segments.length - 1 && <View style={styles.separator} />}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: "center",
    maxWidth: 400,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.base,
  },
  segment: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 100,
  },
  segmentActive: {
    backgroundColor: Colors.bg1,
    borderRadius: 999,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  segmentText: {
    fontSize: 15,
    fontWeight: "400",
    color: Colors.text2,
    letterSpacing: 0,
  },
  segmentTextActive: {
    color: Colors.text0,
    fontWeight: "500",
  },
  separator: {
    width: 1,
    height: 16,
    backgroundColor: Colors.border0,
  },
});
