import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Typography, Spacing } from '@/constants/theme';
import { TaskSet, DailyState } from '@/services/TaskSetService';
import { TaskCheckbox } from './TaskCheckbox';
import { getDaysInPeriod, getISODate, isToday, isPast, isFuture } from '@/utils/tasksets';

interface TaskGridProps {
  taskSet: TaskSet;
  dailyStates: DailyState[];
  onTaskToggle?: () => void;
}

export function TaskGrid({ taskSet, dailyStates, onTaskToggle }: TaskGridProps) {
  const { colors } = useTheme();
  
  const startDate = new Date(taskSet.startDate);
  const days = getDaysInPeriod(startDate, taskSet.periodType);
  const today = getISODate();

  const statesByDate = new Map<string, DailyState>();
  dailyStates.forEach((state) => {
    statesByDate.set(state.date, state);
  });

  const styles = StyleSheet.create({
    container: {
      borderWidth: 1,
      borderColor: colors.border0,
      backgroundColor: colors.bg0,
    },
    headerRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: colors.border0,
    },
    headerCell: {
      padding: Spacing.base,
      borderRightWidth: 1,
      borderRightColor: colors.border0,
      backgroundColor: colors.bg0,
      minWidth: 100,
    },
    headerText: {
      ...Typography.small,
      fontFamily: Typography.fontFamilyMedium,
      color: colors.text0,
      textAlign: 'center',
    },
    taskRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: colors.border0,
    },
    taskCell: {
      padding: Spacing.base,
      borderRightWidth: 1,
      borderRightColor: colors.border0,
      backgroundColor: colors.bg0,
      minWidth: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
    taskName: {
      ...Typography.small,
      color: colors.text0,
    },
    dateCell: {
      padding: Spacing.sm,
      borderRightWidth: 1,
      borderRightColor: colors.border0,
      minWidth: 60,
      justifyContent: 'center',
      alignItems: 'center',
    },
    dateText: {
      ...Typography.monoXs,
      color: colors.text0,
      textAlign: 'center',
    },
    todayCell: {
      backgroundColor: colors.accent1,
    },
    checkedCell: {
      backgroundColor: colors.accent1,
    },
  });

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.container}>
        {/* Header Row */}
        <View style={styles.headerRow}>
          <View style={[styles.headerCell, { minWidth: 120 }]}>
            <Text style={styles.headerText}>Tasks</Text>
          </View>
          {days.map((day) => {
            const dateStr = getISODate(day);
            const isTodayDate = isToday(dateStr);
            
            return (
              <View
                key={dateStr}
                style={[
                  styles.dateCell,
                  isTodayDate && styles.todayCell,
                ]}
              >
                <Text style={styles.dateText}>
                  {day.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Task Rows */}
        {taskSet.tasks.map((task) => (
          <View key={task} style={styles.taskRow}>
            <View style={[styles.taskCell, { minWidth: 120 }]}>
              <Text style={styles.taskName}>{task}</Text>
            </View>
            {days.map((day) => {
              const dateStr = getISODate(day);
              const state = statesByDate.get(dateStr);
              const checked = state?.completions[task] === true;
              const disabled = (isPast(dateStr) && !isToday(dateStr)) || isFuture(dateStr);

              return (
                <View
                  key={`${task}-${dateStr}`}
                  style={[
                    styles.dateCell,
                    checked && styles.checkedCell,
                  ]}
                >
                  <TaskCheckbox
                    taskName={task}
                    date={dateStr}
                    checked={checked}
                    disabled={disabled}
                    taskSetId={taskSet._id}
                    onToggle={onTaskToggle}
                  />
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
