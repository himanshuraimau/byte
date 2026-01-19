import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing } from '@/constants/theme';
import { Note } from '@/types/entities';
import { Card } from '@/components/ui/Card';
import { formatTime } from '@/utils/date';

interface NoteCardProps {
  note: Note;
  onPress?: () => void;
}

export function NoteCard({ note, onPress }: NoteCardProps) {
  const timestamp = formatTime(note.created_at);
  const lines = note.content.split('\n');
  const firstLine = lines[0];
  const restLines = lines.slice(1).join('\n');

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <Card>
        <View style={styles.header}>
          <Text style={styles.typeLabel}>[NOTE]</Text>
          <Text style={styles.timestamp}>{timestamp}</Text>
        </View>

        <Text style={styles.firstLine}>{firstLine}</Text>
        {restLines && <Text style={styles.content}>{restLines}</Text>}
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  typeLabel: {
    ...Typography.monoXs,
    color: Colors.text2,
  },
  timestamp: {
    ...Typography.monoMd,
    color: Colors.text2,
  },
  firstLine: {
    ...Typography.h2,
    color: Colors.text0,
    marginBottom: Spacing.xs,
  },
  content: {
    ...Typography.body,
    color: Colors.text1,
    lineHeight: Typography.body.lineHeight,
  },
});
