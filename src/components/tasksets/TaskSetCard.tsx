import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { Typography, Spacing } from '@/constants/theme';
import { TaskSet, DailyState } from '@/services/TaskSetService';
import { StreakIndicator } from './StreakIndicator';
import { TaskGrid } from './TaskGrid';
import { Button } from '@/components/ui/Button';

interface TaskSetCardProps {
  taskSet: TaskSet;
  dailyStates: DailyState[];
  streak: number;
  onRefresh?: () => void;
}

export function TaskSetCard({
  taskSet,
  dailyStates,
  streak,
  onRefresh,
}: TaskSetCardProps) {
  const { colors } = useTheme();
  const router = useRouter();

  const styles = StyleSheet.create({
    card: {
      borderWidth: 1,
      borderColor: colors.border0,
      backgroundColor: colors.bg0,
      padding: Spacing.lg,
      marginBottom: Spacing.xl,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.base,
    },
    title: {
      ...Typography.h2,
      color: colors.text0,
      flex: 1,
    },
    actions: {
      flexDirection: 'row',
      gap: Spacing.sm,
      alignItems: 'center',
    },
    gridContainer: {
      marginTop: Spacing.base,
    },
  });

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{taskSet.name}</Text>
        <View style={styles.actions}>
          <StreakIndicator streak={streak} />
          <TouchableOpacity
            onPress={() => router.push(`/tasksets/${taskSet._id}/edit`)}
            style={{
              paddingHorizontal: Spacing.base,
              paddingVertical: Spacing.sm,
              borderWidth: 1,
              borderColor: colors.border0,
              backgroundColor: colors.bg0,
            }}
          >
            <Text style={{ ...Typography.small, color: colors.text0 }}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.gridContainer}>
        <TaskGrid
          taskSet={taskSet}
          dailyStates={dailyStates}
          onTaskToggle={onRefresh}
        />
      </View>
    </View>
  );
}
