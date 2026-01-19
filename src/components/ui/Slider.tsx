import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutChangeEvent } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';

interface SliderProps {
  value: number; // 0-100
  onValueChange: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  step?: number; // Snap increments (default 5)
  showValue?: boolean;
}

export function Slider({
  value,
  onValueChange,
  minimumValue = 0,
  maximumValue = 100,
  step = 5,
  showValue = true,
}: SliderProps) {
  const [trackWidth, setTrackWidth] = useState(0);

  const snapValue = (val: number): number => {
    const stepped = Math.round(val / step) * step;
    return Math.max(minimumValue, Math.min(maximumValue, stepped));
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width);
  };

  const handlePress = (evt: { nativeEvent: { locationX: number } }) => {
    if (trackWidth === 0) return;

    const { locationX } = evt.nativeEvent;
    const percentage = (locationX / trackWidth) * 100;
    const newValue = snapValue(percentage);
    onValueChange(newValue);
  };

  const percentage = ((value - minimumValue) / (maximumValue - minimumValue)) * 100;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.track}
        onLayout={handleLayout}
        onPress={handlePress}
        activeOpacity={1}>
        <View style={[styles.fill, { width: `${percentage}%` }]} />
      </TouchableOpacity>
      {showValue && (
        <Text style={styles.value}>{Math.round(value)}%</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  track: {
    flex: 1,
    height: 48,
    backgroundColor: Colors.bg2,
    borderRadius: Radius.sm,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  fill: {
    height: '100%',
    backgroundColor: Colors.accent0,
    borderRadius: Radius.sm,
  },
  value: {
    ...Typography.monoSm,
    color: Colors.accent0,
    minWidth: 40,
    textAlign: 'right',
  },
});
