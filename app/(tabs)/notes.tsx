import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, ScrollView, View, RefreshControl, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { Typography, Spacing } from '@/constants/theme';
import { ThemedView } from '@/components/ui/themed-view';
import { apiClient } from '@/services/ApiClient';
import { Button } from '@/components/ui/Button';

interface Note {
  _id: string;
  content: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export default function NotesScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotes = useCallback(async () => {
    try {
      const response = await apiClient.get(`/entries?date=${date}&type=NOTE`);
      if (response.ok) {
        const data = await response.json();
        setNotes(data);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [date]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotes();
  };

  const handleDelete = async (noteId: string) => {
    try {
      const response = await apiClient.delete(`/entries/${noteId}`);
      if (response.ok) {
        fetchNotes();
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const preview = (content: string) => {
    return content.length > 150 ? `${content.substring(0, 150)}...` : content;
  };

  const contentPadding = Spacing.xl;
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg0,
    },
    scrollContent: {
      paddingHorizontal: contentPadding,
      paddingTop: insets.top + Spacing.xl,
      paddingBottom: insets.bottom + Spacing['3xl'],
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.lg,
    },
    title: {
      ...Typography.h1,
      color: colors.text0,
    },
    dateText: {
      ...Typography.body,
      color: colors.text1,
      marginBottom: Spacing['2xl'],
    },
    noteCard: {
      marginBottom: Spacing.lg,
      padding: Spacing.lg,
      borderWidth: 1,
      borderColor: colors.border0,
      backgroundColor: colors.bg1,
      borderRadius: 12,
    },
    noteHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: Spacing.sm,
    },
    noteDate: {
      ...Typography.monoXs,
      color: colors.text1,
    },
    noteActions: {
      flexDirection: 'row',
      gap: Spacing.sm,
    },
    noteContent: {
      ...Typography.body,
      color: colors.text0,
      lineHeight: 24,
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: Spacing['4xl'],
      paddingHorizontal: Spacing.xl,
    },
    emptyText: {
      ...Typography.body,
      color: colors.text1,
      textAlign: 'center',
      marginBottom: Spacing.lg,
    },
    actionButton: {
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      borderWidth: 1,
      borderColor: colors.border0,
      backgroundColor: colors.bg0,
      borderRadius: 8,
    },
    actionButtonText: {
      ...Typography.monoXs,
      color: colors.text0,
    },
    deleteButton: {
      borderColor: colors.destructive,
    },
    deleteButtonText: {
      color: colors.destructive,
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
          <Text style={styles.title}>Notes</Text>
          <Button
            title="+ New"
            onPress={() => router.push(`/notes/new?date=${date}`)}
            variant="primary"
          />
        </View>
        <Text style={styles.dateText}>
          {format(new Date(date), 'EEEE, MMMM dd, yyyy')}
        </Text>

        {notes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No notes for this day.</Text>
            <View style={{ marginTop: Spacing.xl }}>
              <Button
                title="Create Note"
                onPress={() => router.push(`/notes/new?date=${date}`)}
              />
            </View>
          </View>
        ) : (
          notes.map((note) => (
            <TouchableOpacity
              key={note._id}
              onPress={() => router.push(`/notes/${note._id}`)}
              activeOpacity={0.9}
            >
              <View style={styles.noteCard}>
                <View style={styles.noteHeader}>
                  <Text style={styles.noteDate}>
                    {format(new Date(note.createdAt), 'MMM dd, yyyy • HH:mm')}
                  </Text>
                  <View style={styles.noteActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        router.push(`/notes/${note._id}`);
                      }}
                    >
                      <Text style={styles.actionButtonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleDelete(note._id);
                      }}
                    >
                      <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.noteContent}>{preview(note.content)}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </ThemedView>
  );
}
