import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Colors, Typography, Radius, Shadows, Spacing } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface AddActionBarProps {
  onAddTask: () => void;
  onAddNote: () => void;
  onAddSession: () => void;
}

export function AddActionBar({ onAddTask, onAddNote, onAddSession }: AddActionBarProps) {
  const taskScale = useSharedValue(1);
  const noteScale = useSharedValue(1);
  const sessionScale = useSharedValue(1);

  const taskStyle = useAnimatedStyle(() => ({
    transform: [{ scale: taskScale.value }],
  }));

  const noteStyle = useAnimatedStyle(() => ({
    transform: [{ scale: noteScale.value }],
  }));

  const sessionStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sessionScale.value }],
  }));

  const handlePressIn = (scale: Animated.SharedValue<number>) => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = (scale: Animated.SharedValue<number>) => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <View style={styles.container}>
      <AnimatedTouchable
        style={[styles.action, taskStyle]}
        onPress={onAddTask}
        onPressIn={() => handlePressIn(taskScale)}
        onPressOut={() => handlePressOut(taskScale)}
        activeOpacity={0.8}>
        <IconSymbol name="plus" size={20} color={Colors.text2} />
        <Text style={styles.actionText}>TASK</Text>
      </AnimatedTouchable>

      <AnimatedTouchable
        style={[styles.action, noteStyle]}
        onPress={onAddNote}
        onPressIn={() => handlePressIn(noteScale)}
        onPressOut={() => handlePressOut(noteScale)}
        activeOpacity={0.8}>
        <IconSymbol name="doc.text" size={20} color={Colors.text2} />
        <Text style={styles.actionText}>NOTE</Text>
      </AnimatedTouchable>

      <AnimatedTouchable
        style={[styles.action, sessionStyle]}
        onPress={onAddSession}
        onPressIn={() => handlePressIn(sessionScale)}
        onPressOut={() => handlePressOut(sessionScale)}
        activeOpacity={0.8}>
        <IconSymbol name="clock" size={20} color={Colors.text2} />
        <Text style={styles.actionText}>SESSION</Text>
      </AnimatedTouchable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.bg0,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.base,
    gap: Spacing.base,
    ...Shadows.z2,
  },
  action: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
  },
  actionText: {
    ...Typography.monoXs,
    color: Colors.text2,
    textTransform: 'uppercase',
  },
});
