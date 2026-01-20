import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Task } from '@/types/entities';
import { Config } from '@/constants/config';

interface TimerFormProps {
  onStart: (name: string, durationMinutes: number, taskId: number | null) => void;
  tasks: Task[];
  loading?: boolean;
}

export function TimerForm({ onStart, tasks, loading = false }: TimerFormProps) {
  const [name, setName] = useState('');
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [customDuration, setCustomDuration] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleStart = () => {
    if (!name.trim()) return;

    const duration = selectedDuration || parseInt(customDuration, 10);
    if (!duration || duration <= 0) return;

    onStart(name.trim(), duration, selectedTaskId);
  };

  const handleDurationSelect = (minutes: number) => {
    setSelectedDuration(minutes);
    setShowCustomInput(false);
    setCustomDuration('');
  };

  const handleCustomDuration = () => {
    setShowCustomInput(true);
    setSelectedDuration(null);
  };

  const canStart = name.trim() && (selectedDuration || (customDuration && parseInt(customDuration, 10) > 0));

  return (
    <View style={styles.container}>
      <Input
        label="SESSION NAME"
        value={name}
        onChangeText={setName}
        placeholder="Enter session name..."
        autoFocus
      />

      <View style={styles.section}>
        <Text style={styles.label}>DURATION (MINUTES)</Text>
        <View style={styles.durationChips}>
          {Config.defaultDurationPresets.map((minutes) => (
            <TouchableOpacity
              key={minutes}
              style={[
                styles.chip,
                selectedDuration === minutes && styles.chipSelected,
              ]}
              onPress={() => handleDurationSelect(minutes)}
              disabled={loading}>
              <Text
                style={[
                  styles.chipText,
                  selectedDuration === minutes && styles.chipTextSelected,
                ]}>
                {minutes}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[
              styles.chip,
              showCustomInput && styles.chipSelected,
            ]}
            onPress={handleCustomDuration}
            disabled={loading}>
            <Text
              style={[
                styles.chipText,
                showCustomInput && styles.chipTextSelected,
              ]}>
              Custom
            </Text>
          </TouchableOpacity>
        </View>

        {showCustomInput && (
          <Input
            value={customDuration}
            onChangeText={setCustomDuration}
            placeholder="Enter minutes"
            keyboardType="numeric"
            style={styles.customInput}
          />
        )}
      </View>

      {tasks.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.label}>LINK TO TASK (OPTIONAL)</Text>
          <View style={styles.taskList}>
            <TouchableOpacity
              style={[
                styles.taskChip,
                selectedTaskId === null && styles.taskChipSelected,
              ]}
              onPress={() => setSelectedTaskId(null)}
              disabled={loading}>
              <Text
                style={[
                  styles.taskChipText,
                  selectedTaskId === null && styles.taskChipTextSelected,
                ]}>
                None
              </Text>
            </TouchableOpacity>
            {tasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                style={[
                  styles.taskChip,
                  selectedTaskId === task.id && styles.taskChipSelected,
                ]}
                onPress={() => setSelectedTaskId(task.id)}
                disabled={loading}>
                <Text
                  style={[
                    styles.taskChipText,
                    selectedTaskId === task.id && styles.taskChipTextSelected,
                  ]}>
                  {task.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <View style={styles.startButton}>
        <Button
          title="START SESSION"
          onPress={handleStart}
          disabled={!canStart || loading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xl,
  },
  section: {
    gap: Spacing.base,
  },
  label: {
    ...Typography.monoSm,
    color: Colors.text1,
    textTransform: 'uppercase',
  },
  durationChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.base,
    borderRadius: Radius.sm,
    backgroundColor: Colors.bg1,
    borderWidth: 1,
    borderColor: Colors.border0,
  },
  chipSelected: {
    backgroundColor: Colors.accent0,
    borderColor: Colors.accent0,
  },
  chipText: {
    ...Typography.monoSm,
    color: Colors.text1,
  },
  chipTextSelected: {
    color: Colors.bg0,
  },
  customInput: {
    marginTop: Spacing.sm,
  },
  taskList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  taskChip: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.base,
    borderRadius: Radius.sm,
    backgroundColor: Colors.bg1,
    borderWidth: 1,
    borderColor: Colors.border0,
  },
  taskChipSelected: {
    backgroundColor: Colors.accent1,
    borderColor: Colors.accent0,
  },
  taskChipText: {
    ...Typography.small,
    color: Colors.text1,
  },
  taskChipTextSelected: {
    color: Colors.accent0,
    fontWeight: '500',
  },
  startButton: {
    marginTop: Spacing.lg,
  },
});
