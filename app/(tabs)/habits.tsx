import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, ScrollView, View, RefreshControl, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { Typography, Spacing } from '@/constants/theme';
import { ThemedView } from '@/components/ui/themed-view';
import { ThemedText } from '@/components/ui/themed-text';
import { taskSetService, TaskSet, DailyState } from '@/services/TaskSetService';
import { TaskSetCard } from '@/components/tasksets';
import { Button } from '@/components/ui/Button';
import { format } from 'date-fns';

export default function HabitsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [taskSets, setTaskSets] = useState<TaskSet[]>([]);
  const [dailyStates, setDailyStates] = useState<Record<string, DailyState[]>>({});
  const [streaks, setStreaks] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const today = format(new Date(), 'yyyy-MM-dd');

  const fetchData = useCallback(async () => {
    try {
      const taskSetsData = await taskSetService.getTaskSets();
      setTaskSets(taskSetsData);

      // Fetch daily states and streaks for each TaskSet
      const states: Record<string, DailyState[]> = {};
      const streakData: Record<string, number> = {};

      await Promise.all(
        taskSetsData.map(async (ts) => {
          // Fetch daily states for the period
          const startDate = new Date(ts.startDate);
          const endDate = new Date(ts.endDate);
          const statesList: DailyState[] = [];
          
          // Get states for all days in period (simplified - fetch for today and recent days)
          const todayState = await taskSetService.getDailyState(ts._id, today);
          if (todayState) {
            statesList.push(todayState);
          }

          states[ts._id] = statesList;

          // Fetch streak
          try {
            const streak = await taskSetService.getStreak(ts._id);
            streakData[ts._id] = streak;
          } catch (error) {
            streakData[ts._id] = 0;
          }
        })
      );

      setDailyStates(states);
      setStreaks(streakData);
    } catch (error) {
      console.error('Error fetching habits:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [today]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg0,
    },
    scrollContent: {
      padding: Spacing.lg,
      paddingTop: 64,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.base,
    },
    title: {
      ...Typography.h1,
      color: colors.text0,
    },
    date: {
      ...Typography.body,
      color: colors.text1,
      marginBottom: Spacing.xl,
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: Spacing['4xl'],
    },
    emptyText: {
      ...Typography.body,
      color: colors.text1,
      textAlign: 'center',
      marginBottom: Spacing.base,
    },
    emptySubtext: {
      ...Typography.small,
      color: colors.text2,
      textAlign: 'center',
    },
  });

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.accent0} />
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent0} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Task Sets</Text>
          <Button
            title="+ New"
            onPress={() => router.push('/tasksets/new')}
            variant="primary"
          />
        </View>
        <Text style={styles.date}>{format(new Date(), 'EEEE, MMMM do')}</Text>

        {taskSets.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No task sets yet.</Text>
            <Text style={styles.emptySubtext}>Create your first task set to start tracking habits.</Text>
            <View style={{ marginTop: Spacing.xl }}>
              <Button
                title="Create Task Set"
                onPress={() => router.push('/tasksets/new')}
              />
            </View>
          </View>
        ) : (
          taskSets.map((taskSet) => (
            <TaskSetCard
              key={taskSet._id}
              taskSet={taskSet}
              dailyStates={dailyStates[taskSet._id] || []}
              streak={streaks[taskSet._id] || 0}
              onRefresh={fetchData}
            />
          ))
        )}
      </ScrollView>
    </ThemedView>
  );
}
