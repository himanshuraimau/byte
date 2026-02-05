import { Card } from "@/components/ui/Card";
import { Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { Session } from "@/types/entities";
import { formatDurationSeconds, formatTime } from "@/utils/date";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface SessionCardProps {
  session: Session;
  onPress?: () => void;
  onLongPress?: () => void;
}

export function SessionCard({
  session,
  onPress,
  onLongPress,
}: SessionCardProps) {
  const { colors } = useTheme();
  const timestamp = formatTime(session.created_at);
  const startedTime = formatTime(session.started_at);
  const endedTime = session.ended_at ? formatTime(session.ended_at) : null;

  // Calculate actual duration if completed
  const actualDurationSeconds =
    session.ended_at && session.started_at
      ? session.ended_at - session.started_at
      : null;
  const durationDisplay = actualDurationSeconds
    ? formatDurationSeconds(Math.floor(actualDurationSeconds))
    : formatDurationSeconds(session.duration_minutes * 60);

  const statusText = session.completed ? "SESSION_COMPLETE" : "SESSION_ACTIVE";

  const styles = StyleSheet.create({
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
    name: {
      ...Typography.h2,
      color: colors.text0,
      marginBottom: Spacing.base,
    },
    metadata: {
      gap: Spacing.xs,
    },
    metadataRow: {
      flexDirection: "row",
      gap: Spacing.sm,
    },
    metadataLabel: {
      ...Typography.monoSm,
      color: colors.text2,
    },
    metadataValue: {
      ...Typography.monoSm,
      color: colors.accent0,
      fontWeight: "500",
    },
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.9}
    >
      <Card>
        <View style={styles.header}>
          <Text style={styles.typeLabel}>[{statusText}]</Text>
          <Text style={styles.timestamp}>{timestamp}</Text>
        </View>

        <Text style={styles.name}>{session.name}</Text>

        <View style={styles.metadata}>
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>DURATION:</Text>
            <Text style={styles.metadataValue}>{durationDisplay}</Text>
          </View>
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>STARTED:</Text>
            <Text style={styles.metadataValue}>{startedTime}</Text>
          </View>
          {endedTime && (
            <View style={styles.metadataRow}>
              <Text style={styles.metadataLabel}>ENDED:</Text>
              <Text style={styles.metadataValue}>{endedTime}</Text>
            </View>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
}
