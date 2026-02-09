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
  const preview = note.content.length > 150 ? `${note.content.substring(0, 150)}...` : note.content;

  const styles = StyleSheet.create({
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: Spacing.sm,
    },
    typeLabel: {
      ...Typography.monoXs,
      color: colors.bg0,
      backgroundColor: '#3b82f6',
      paddingHorizontal: Spacing.sm,
      paddingVertical: 2,
    },
    timestamp: {
      ...Typography.monoXs,
      color: colors.text1,
    },
    content: {
      ...Typography.body,
      color: colors.text0,
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
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
            <Text style={styles.typeLabel}>NOTE</Text>
            <Text style={styles.timestamp}>{timestamp}</Text>
          </View>
        </View>
        <Text style={styles.content}>{preview}</Text>
      </Card>
    </TouchableOpacity>
  );
}
