import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { TemporalMode } from '@/types/entities';

interface SegmentedControlProps {
  value: TemporalMode;
  onChange: (value: TemporalMode) => void;
}

const segments: { label: string; value: TemporalMode }[] = [
  { label: 'YESTERDAY', value: 'yesterday' },
  { label: 'TODAY', value: 'today' },
  { label: 'TOMORROW', value: 'tomorrow' },
];

export function SegmentedControl({ value, onChange }: SegmentedControlProps) {
  return (
    <View style={styles.container}>
      {segments.map((segment) => {
        const isActive = value === segment.value;
        return (
          <TouchableOpacity
            key={segment.value}
            style={[styles.segment, isActive && styles.segmentActive]}
            onPress={() => onChange(segment.value)}
            activeOpacity={0.7}>
            <Text style={[styles.segmentText, isActive && styles.segmentTextActive]}>
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
    flexDirection: 'row',
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: {
    backgroundColor: Colors.bg0,
    ...Typography.body,
  },
  segmentText: {
    ...Typography.body,
    fontWeight: '500',
    color: Colors.text2,
    fontSize: 14,
  },
  segmentTextActive: {
    color: Colors.text0,
  },
});
