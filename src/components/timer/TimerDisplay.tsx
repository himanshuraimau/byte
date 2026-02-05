import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { formatDurationSeconds } from '@/utils/date';
import { Session } from '@/types/entities';

interface TimerDisplayProps {
  session: Session;
  remainingSeconds: number;
  elapsedSeconds: number;
}

export function TimerDisplay({ session, remainingSeconds, elapsedSeconds }: TimerDisplayProps) {
  const { colors } = useTheme();
  const totalSeconds = session.duration_minutes * 60;
  const progress = totalSeconds > 0 ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100 : 0;

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
      color: colors.text0,
      textAlign: 'center',
    },
    timerLabel: {
      ...Typography.monoSm,
      color: colors.text2,
      textTransform: 'uppercase',
    },
    sessionName: {
      ...Typography.h2,
      color: colors.text0,
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
      color: colors.text2,
    },
    metadataValue: {
      ...Typography.monoSm,
      color: colors.text1,
    },
  });

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
