import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
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

export default function NewNoteScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ date?: string }>();
  const dateParam = params.date || format(new Date(), 'yyyy-MM-dd');
  const [date, setDate] = useState(dateParam);
  const [content, setContent] = useState('');
  const { createNote, loading } = useNote();
  const { showToast } = useToast();

  const handleSave = async () => {
    if (!content.trim()) {
      showToast('Please enter some content', 'warning');
      return;
    }

    try {
      await createNote(content.trim());
      showToast('Note created successfully', 'success');
      router.back();
    } catch (error) {
      showToast('Failed to create note', 'error');
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
  });

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backRow} onPress={() => router.back()} activeOpacity={0.7}>
          <View style={styles.backButton}>
            <IconSymbol size={24} name="chevron.left" color={colors.text0} />
          </View>
          <Text style={[Typography.small, { color: colors.text1 }]}>Back</Text>
        </TouchableOpacity>
        <ThemedText style={styles.title}>New Note</ThemedText>
        <ThemedText style={styles.dateText}>
          {format(new Date(date), 'EEEE, MMMM dd, yyyy')}
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
            title="Cancel"
            variant="secondary"
            onPress={handleCancel}
            disabled={loading}
          />
        </View>
        <View style={styles.actionButton}>
          <Button
            title={loading ? 'Saving...' : 'Save'}
            onPress={handleSave}
            disabled={loading || !content.trim()}
          />
        </View>
      </View>
    </ThemedView>
  );
}
