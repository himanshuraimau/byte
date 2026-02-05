import { Card } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { Task } from "@/types/entities";
import { formatTime } from "@/utils/date";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface TaskCardProps {
  task: Task;
  onPress?: () => void;
  onLongPress?: () => void;
  onToggleComplete?: () => void;
}

export function TaskCard({
  task,
  onPress,
  onLongPress,
  onToggleComplete,
}: TaskCardProps) {
  const { colors } = useTheme();
  const timestamp = formatTime(task.created_at);
  const statusText = task.completed ? "COMPLETE" : "INCOMPLETE";

  const styles = StyleSheet.create({
    completed: {
      opacity: 0.6,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: Spacing.sm,
    },
    typeLabel: {
      ...Typography.monoXs,
      color: colors.text2,
    },
    timestamp: {
      ...Typography.monoMd,
      color: colors.text2,
    },
    title: {
      ...Typography.h2,
      color: colors.text0,
      marginBottom: Spacing.base,
    },
    titleCompleted: {
      textDecorationLine: "line-through",
    },
    progressContainer: {
      marginBottom: Spacing.base,
    },
    footer: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.sm,
    },
    status: {
      ...Typography.monoXs,
      color: colors.text2,
      textTransform: "uppercase",
    },
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.9}
    >
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
          <Checkbox
            checked={task.completed}
            onToggle={onToggleComplete || (() => {})}
          />
          <Text style={styles.status}>{statusText}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}
