import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { ThemedView } from '@/components/ui/themed-view';
import { ThemedText } from '@/components/ui/themed-text';
import { TaskSetForm } from '@/components/tasksets/TaskSetForm';
import { taskSetService } from '@/services/TaskSetService';
import { useToast } from '@/hooks/useToast';

export default function NewTaskSetScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: {
    name: string;
    periodType: 'week' | 'month';
    tasks: string[];
  }) => {
    setIsLoading(true);
    try {
      await taskSetService.createTaskSet(data);
      showToast('Task set created successfully', 'success');
      router.back();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to create task set', 'error');
      setIsLoading(false);
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
  });

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>New Task Set</ThemedText>
      </View>
      <TaskSetForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </ThemedView>
  );
}
