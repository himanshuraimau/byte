import { Card } from "@/components/ui/Card";
import { Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { Note } from "@/types/entities";
import { formatTime } from "@/utils/date";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface NoteCardProps {
  note: Note;
  onPress?: () => void;
  onLongPress?: () => void;
}

export function NoteCard({ note, onPress, onLongPress }: NoteCardProps) {
  const { colors } = useTheme();
  const timestamp = formatTime(note.created_at);
  const lines = note.content.split("\n");
  const firstLine = lines[0];
  const restLines = lines.slice(1).join("\n");

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
    firstLine: {
      ...Typography.h2,
      color: colors.text0,
      marginBottom: Spacing.xs,
    },
    content: {
      ...Typography.body,
      color: colors.text1,
      lineHeight: Typography.body.lineHeight,
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
          <Text style={styles.typeLabel}>[NOTE]</Text>
          <Text style={styles.timestamp}>{timestamp}</Text>
        </View>

        <Text style={styles.firstLine}>{firstLine}</Text>
        {restLines && <Text style={styles.content}>{restLines}</Text>}
      </Card>
    </TouchableOpacity>
  );
}
