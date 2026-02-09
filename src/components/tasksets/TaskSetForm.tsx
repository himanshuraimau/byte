import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Typography, Spacing } from '@/constants/theme';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { TaskSet } from '@/services/TaskSetService';

interface TaskSetFormProps {
  taskSet?: TaskSet;
  onSubmit: (data: {
    name: string;
    periodType: 'week' | 'month';
    tasks: string[];
  }) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function TaskSetForm({
  taskSet,
  onSubmit,
  onCancel,
  isLoading = false,
}: TaskSetFormProps) {
  const { colors } = useTheme();
  const [name, setName] = useState(taskSet?.name || '');
  const [periodType, setPeriodType] = useState<'week' | 'month'>(
    taskSet?.periodType || 'week'
  );
  const [tasksText, setTasksText] = useState(
    taskSet?.tasks.join('\n') || ''
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    const tasks = tasksText
      .split('\n')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (tasks.length === 0) {
      setError('At least one task is required');
      return;
    }

    try {
      await onSubmit({
        name: name.trim(),
        periodType,
        tasks,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save TaskSet');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: Spacing.lg,
    },
    errorContainer: {
      padding: Spacing.base,
      backgroundColor: '#fee2e2',
      borderWidth: 1,
      borderColor: colors.destructive,
      marginBottom: Spacing.base,
    },
    errorText: {
      ...Typography.small,
      color: colors.destructive,
    },
    periodTypeContainer: {
      flexDirection: 'row',
      gap: Spacing.sm,
      marginBottom: Spacing.base,
    },
    periodTypeButton: {
      flex: 1,
      padding: Spacing.base,
      borderWidth: 1,
      borderColor: colors.border0,
      backgroundColor: colors.bg0,
      alignItems: 'center',
    },
    periodTypeButtonActive: {
      borderColor: colors.accent0,
      backgroundColor: colors.accent1,
    },
    periodTypeText: {
      ...Typography.body,
      color: colors.text0,
    },
    periodTypeTextActive: {
      color: colors.accent0,
      fontFamily: Typography.fontFamilyMedium,
    },
    actions: {
      flexDirection: 'row',
      gap: Spacing.base,
      marginTop: Spacing.xl,
    },
    actionButton: {
      flex: 1,
    },
  });

  return (
    <ScrollView style={styles.container}>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <Input
        label="Name"
        placeholder="e.g., Daily Habits"
        value={name}
        onChangeText={setName}
        editable={!isLoading}
      />

      <View>
        <Text
          style={{
            ...Typography.small,
            color: colors.text1,
            marginBottom: Spacing.sm,
          }}
        >
          Period Type
        </Text>
        <View style={styles.periodTypeContainer}>
          <TouchableOpacity
            style={[
              styles.periodTypeButton,
              periodType === 'week' && styles.periodTypeButtonActive,
            ]}
            onPress={() => setPeriodType('week')}
            disabled={isLoading}
          >
            <Text
              style={[
                styles.periodTypeText,
                periodType === 'week' && styles.periodTypeTextActive,
              ]}
            >
              Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.periodTypeButton,
              periodType === 'month' && styles.periodTypeButtonActive,
            ]}
            onPress={() => setPeriodType('month')}
            disabled={isLoading}
          >
            <Text
              style={[
                styles.periodTypeText,
                periodType === 'month' && styles.periodTypeTextActive,
              ]}
            >
              Month
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Textarea
        label="Tasks (one per line)"
        placeholder="Task 1&#10;Task 2&#10;Task 3"
        value={tasksText}
        onChangeText={setTasksText}
        editable={!isLoading}
        multiline
      />

      <View style={styles.actions}>
        <View style={styles.actionButton}>
          <Button
            title="Cancel"
            variant="secondary"
            onPress={onCancel}
            disabled={isLoading}
          />
        </View>
        <View style={styles.actionButton}>
          <Button
            title={isLoading ? 'Saving...' : 'Save'}
            onPress={handleSubmit}
            disabled={isLoading || !name.trim()}
          />
        </View>
      </View>
    </ScrollView>
  );
}
