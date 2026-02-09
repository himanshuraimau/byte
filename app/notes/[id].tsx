import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { format } from 'date-fns';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { Typography, Spacing } from '@/constants/theme';
import { ThemedView } from '@/components/ui/themed-view';
import { ThemedText } from '@/components/ui/themed-text';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useNote } from '@/hooks/useNote';
import { useToast } from '@/hooks/useToast';
import { apiClient } from '@/services/ApiClient';

interface Note {
  _id: string;
  content: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export default function EditNoteScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [note, setNote] = useState<Note | null>(null);
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(true);
  const { updateNote, deleteNote, loading: saving } = useNote();
  const { showToast } = useToast();

  useEffect(() => {
    if (id) {
      fetchNote();
    }
  }, [id]);

  const fetchNote = async () => {
    try {
      const response = await apiClient.get(`/entries/${id}`);
      if (response.ok) {
        const data = await response.json();
        if (data.type !== 'NOTE') {
          router.back();
          return;
        }
        setNote(data);
        setContent(data.content);
        setDate(data.date);
      } else {
        showToast('Failed to load note', 'error');
        router.back();
      }
    } catch (error) {
      console.error('Error fetching note:', error);
      showToast('Error loading note', 'error');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!id || !content.trim()) {
      showToast('Please enter some content', 'warning');
      return;
    }

    try {
      await updateNote(id, content.trim());
      showToast('Note updated successfully', 'success');
      router.back();
    } catch (error) {
      showToast('Failed to update note', 'error');
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      await deleteNote(id);
      showToast('Note deleted successfully', 'success');
      router.back();
    } catch (error) {
      showToast('Failed to delete note', 'error');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg0,
    },
    header: {
      paddingHorizontal: Spacing.xl,
      paddingTop: insets.top + Spacing.base,
      paddingBottom: Spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border0,
      backgroundColor: colors.bg0,
    },
    backRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.base,
    },
    backButton: {
      padding: Spacing.xs,
      marginLeft: -Spacing.xs,
    },
    title: {
      ...Typography.h1,
      color: colors.text0,
      marginBottom: Spacing.xs,
    },
    dateText: {
      ...Typography.small,
      color: colors.text1,
    },
    content: {
      flex: 1,
      padding: Spacing.xl,
    },
    actions: {
      flexDirection: 'row',
      gap: Spacing.base,
      padding: Spacing.xl,
      paddingBottom: Spacing.xl + insets.bottom,
      borderTopWidth: 1,
      borderTopColor: colors.border0,
      backgroundColor: colors.bg0,
    },
    actionButton: {
      flex: 1,
      minWidth: 72,
    },
    loading: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.accent0} />
        </View>
      </ThemedView>
    );
  }

  if (!note) {
    return null;
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backRow} onPress={() => router.back()} activeOpacity={0.7}>
          <View style={styles.backButton}>
            <IconSymbol size={24} name="chevron.left" color={colors.text0} />
          </View>
          <Text style={[Typography.small, { color: colors.text1 }]}>Back</Text>
        </TouchableOpacity>
        <ThemedText style={styles.title}>Edit Note</ThemedText>
        <ThemedText style={styles.dateText}>
          {format(new Date(date), 'EEEE, MMMM dd, yyyy')} • Created {format(new Date(note.createdAt), 'MMM dd, yyyy')}
        </ThemedText>
      </View>
      <ScrollView style={styles.content}>
        <Textarea
          placeholder="Write your thoughts, ideas, or daily journal entry..."
          value={content}
          onChangeText={setContent}
          style={{ minHeight: 400 }}
          autoFocus
        />
      </ScrollView>
      <View style={styles.actions}>
        <View style={styles.actionButton}>
          <Button
            title="Delete"
            variant="destructive"
            onPress={handleDelete}
            disabled={saving}
          />
        </View>
        <View style={styles.actionButton}>
          <Button
            title="Cancel"
            variant="secondary"
            onPress={handleCancel}
            disabled={saving}
          />
        </View>
        <View style={styles.actionButton}>
          <Button
            title={saving ? 'Saving...' : 'Save'}
            onPress={handleSave}
            disabled={saving || !content.trim()}
          />
        </View>
      </View>
    </ThemedView>
  );
}
