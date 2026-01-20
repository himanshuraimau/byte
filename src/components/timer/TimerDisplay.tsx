import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { formatDurationSeconds } from '@/utils/date';
import { Session } from '@/types/entities';

interface TimerDisplayProps {
  session: Session;
  remainingSeconds: number;
  elapsedSeconds: number;
}

export function TimerDisplay({ session, remainingSeconds, elapsedSeconds }: TimerDisplayProps) {
  const totalSeconds = session.duration_minutes * 60;
  const progress = totalSeconds > 0 ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formatDurationSeconds(remainingSeconds)}</Text>
        <Text style={styles.timerLabel}>REMAINING</Text>
      </View>

      <Text style={styles.sessionName}>{session.name}</Text>

      <View style={styles.progressContainer}>
        <ProgressBar progress={progress} showPercentage={true} />
      </View>

      <View style={styles.metadata}>
        <View style={styles.metadataRow}>
          <Text style={styles.metadataLabel}>STARTED:</Text>
          <Text style={styles.metadataValue}>
            {new Date(session.started_at * 1000).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            })}
          </Text>
        </View>
        <View style={styles.metadataRow}>
          <Text style={styles.metadataLabel}>TARGET:</Text>
          <Text style={styles.metadataValue}>
            {formatDurationSeconds(totalSeconds)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.xl,
  },
  timerContainer: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  timerText: {
    ...Typography.monoLg,
    color: Colors.text0,
    textAlign: 'center',
  },
  timerLabel: {
    ...Typography.monoSm,
    color: Colors.text2,
    textTransform: 'uppercase',
  },
  sessionName: {
    ...Typography.h2,
    color: Colors.text0,
    textAlign: 'center',
  },
  progressContainer: {
    width: '100%',
    paddingHorizontal: Spacing.xl,
  },
  metadata: {
    gap: Spacing.xs,
    width: '100%',
    paddingHorizontal: Spacing.xl,
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metadataLabel: {
    ...Typography.monoSm,
    color: Colors.text2,
  },
  metadataValue: {
    ...Typography.monoSm,
    color: Colors.text1,
  },
});
