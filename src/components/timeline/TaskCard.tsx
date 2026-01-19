import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing } from '@/constants/theme';
import { Task } from '@/types/entities';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Checkbox } from '@/components/ui/Checkbox';
import { formatTime } from '@/utils/date';

interface TaskCardProps {
  task: Task;
  onPress?: () => void;
  onToggleComplete?: () => void;
}

export function TaskCard({ task, onPress, onToggleComplete }: TaskCardProps) {
  const timestamp = formatTime(task.created_at);
  const statusText = task.completed ? 'COMPLETE' : 'INCOMPLETE';

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <Card style={task.completed && styles.completed}>
        <View style={styles.header}>
          <Text style={styles.typeLabel}>[TASK]</Text>
          <Text style={styles.timestamp}>{timestamp}</Text>
        </View>

        <Text style={[styles.title, task.completed && styles.titleCompleted]}>
          {task.title}
        </Text>

        <View style={styles.progressContainer}>
          <ProgressBar progress={task.progress} />
        </View>

        <View style={styles.footer}>
          <Checkbox checked={task.completed} onToggle={onToggleComplete || (() => {})} />
          <Text style={styles.status}>{statusText}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  completed: {
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  typeLabel: {
    ...Typography.monoXs,
    color: Colors.text2,
  },
  timestamp: {
    ...Typography.monoMd,
    color: Colors.text2,
  },
  title: {
    ...Typography.h2,
    color: Colors.text0,
    marginBottom: Spacing.base,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
  },
  progressContainer: {
    marginBottom: Spacing.base,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  status: {
    ...Typography.monoXs,
    color: Colors.text2,
    textTransform: 'uppercase',
  },
});
