import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { ThemedView } from '@/components/ui/themed-view';
import { ThemedText } from '@/components/ui/themed-text';
import { TaskSetForm } from '@/components/tasksets/TaskSetForm';
import { taskSetService, TaskSet } from '@/services/TaskSetService';
import { useToast } from '@/hooks/useToast';

export default function EditTaskSetScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { showToast } = useToast();
  const [taskSet, setTaskSet] = useState<TaskSet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTaskSet();
    }
  }, [id]);

  const fetchTaskSet = async () => {
    try {
      const data = await taskSetService.getTaskSet(id);
      setTaskSet(data);
    } catch (error) {
      showToast('Failed to load task set', 'error');
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: {
    name: string;
    periodType: 'week' | 'month';
    tasks: string[];
  }) => {
    if (!id) return;
    
    setIsSaving(true);
    try {
      await taskSetService.updateTaskSet(id, data);
      showToast('Task set updated successfully', 'success');
      router.back();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to update task set', 'error');
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg0,
    },
    header: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border0,
      backgroundColor: colors.bg0,
    },
    title: {
      fontSize: 20,
      fontFamily: 'GeistMono_500Medium',
      color: colors.text0,
    },
    loading: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.accent0} />
        </View>
      </ThemedView>
    );
  }

  if (!taskSet) {
    return null;
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Edit Task Set</ThemedText>
      </View>
      <TaskSetForm
        taskSet={taskSet}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isSaving}
      />
    </ThemedView>
  );
}
