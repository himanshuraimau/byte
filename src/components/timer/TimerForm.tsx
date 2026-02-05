import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Config } from '@/constants/config';
import { Radius, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { Task } from '@/types/entities';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TimerFormProps {
  onStart: (name: string, durationMinutes: number, taskId: number | null) => void;
  tasks: Task[];
  loading?: boolean;
}

export function TimerForm({ onStart, tasks, loading = false }: TimerFormProps) {
  const { colors } = useTheme();
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

  const styles = StyleSheet.create({
    container: {
      gap: Spacing.xl,
    },
    section: {
      gap: Spacing.base,
    },
    label: {
      ...Typography.monoSm,
      color: colors.text1,
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
      backgroundColor: colors.bg1,
      borderWidth: 1,
      borderColor: colors.border0,
    },
    chipSelected: {
      backgroundColor: colors.accent0,
      borderColor: colors.accent0,
    },
    chipText: {
      ...Typography.monoSm,
      color: colors.text1,
    },
    chipTextSelected: {
      color: colors.bg0,
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
      backgroundColor: colors.bg1,
      borderWidth: 1,
      borderColor: colors.border0,
    },
    taskChipSelected: {
      backgroundColor: colors.accent1,
      borderColor: colors.accent0,
    },
    taskChipText: {
      ...Typography.small,
      color: colors.text1,
    },
    taskChipTextSelected: {
      color: colors.accent0,
      fontWeight: '500',
    },
    startButton: {
      marginTop: Spacing.lg,
    },
  });

  return (
    <View style={styles.container}>
      <Input
        label="SESSION NAME"
        value={name}
        onChangeText={setName}
        placeholder="Enter session name..."
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
