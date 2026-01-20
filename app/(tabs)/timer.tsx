import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/ui/themed-view';
import { Colors, Spacing } from '@/constants/theme';
import { useTimer } from '@/context/TimerContext';
import { useSession } from '@/hooks/useSession';
import { useToast } from '@/hooks/useToast';
import { useDate } from '@/context/DateContext';
import { TimerForm, TimerDisplay, TimerActions } from '@/components/timer';
import { Toast } from '@/components/ui/Toast';
import * as Haptics from 'expo-haptics';

export default function TimerScreen() {
  const {
    activeSession,
    isRunning,
    remainingSeconds,
    elapsedSeconds,
    startTimer,
    completeTimer,
    cancelTimer,
  } = useTimer();
  const { createSession, completeSession, getTasksForDay, loading } = useSession();
  const { toast, showToast, hideToast } = useToast();
  const { selectedDate } = useDate();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  useEffect(() => {
    loadTasks();
  }, [selectedDate]);

  const loadTasks = async () => {
    setLoadingTasks(true);
    try {
      const dayTasks = await getTasksForDay(selectedDate);
      setTasks(dayTasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
      showToast('Failed to load tasks', 'error');
    } finally {
      setLoadingTasks(false);
    }
  };

  const handleStart = async (name: string, durationMinutes: number, taskId: number | null) => {
    try {
      const session = await createSession(name, durationMinutes, taskId);
      startTimer(session);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      console.error('Failed to start timer:', error);
    }
  };

  const handleComplete = async () => {
    if (!activeSession) return;

    try {
      await completeSession(activeSession.id);
      await completeTimer();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showToast('Session completed and logged!', 'success');
    } catch (error) {
      console.error('Failed to complete session:', error);
      showToast('Failed to complete session', 'error');
    }
  };

  const handleCancel = () => {
    cancelTimer();
  };

  if (loadingTasks) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.accent0} />
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {isRunning && activeSession ? (
          <View style={styles.activeContainer}>
            <TimerDisplay
              session={activeSession}
              remainingSeconds={remainingSeconds}
              elapsedSeconds={elapsedSeconds}
            />
            <TimerActions
              onComplete={handleComplete}
              onCancel={handleCancel}
              canComplete={remainingSeconds >= 0}
              loading={loading}
            />
          </View>
        ) : (
          <View style={styles.formContainer}>
            <TimerForm
              onStart={handleStart}
              tasks={tasks}
              loading={loading}
            />
          </View>
        )}
      </ScrollView>

      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={hideToast}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.xl,
    paddingBottom: Spacing['3xl'],
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing['2xl'],
    minHeight: 400,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
});
