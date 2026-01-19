import { AddActionBar } from '@/components/timeline/AddActionBar';
import { DateHeader } from '@/components/timeline/DateHeader';
import { EmptyState } from '@/components/timeline/EmptyState';
import { NoteCard } from '@/components/timeline/NoteCard';
import { SessionCard } from '@/components/timeline/SessionCard';
import { TaskCard } from '@/components/timeline/TaskCard';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { ThemedView } from '@/components/ui/themed-view';
import { Colors, Spacing } from '@/constants/theme';
import { useDate } from '@/context/DateContext';
import { useTimeline } from '@/context/TimelineContext';
import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

export default function TimelineScreen() {
  const { selectedDate, temporalMode, setTemporalMode } = useDate();
  const { entries, loading, entriesCount, refreshTimeline } = useTimeline();

  const handleAddTask = () => {
    // TODO: Open task modal in Phase 5
    console.log('Add task');
  };

  const handleAddNote = () => {
    // TODO: Open note modal in Phase 6
    console.log('Add note');
  };

  const handleAddSession = () => {
    // TODO: Navigate to timer screen in Phase 7
    console.log('Add session');
  };

  const handleTaskPress = (taskId: number) => {
    // TODO: Open task edit modal in Phase 5
    console.log('Edit task', taskId);
  };

  const handleTaskToggle = (taskId: number) => {
    // TODO: Toggle task completion in Phase 5
    console.log('Toggle task', taskId);
  };

  const handleNotePress = (noteId: number) => {
    // TODO: Open note edit modal in Phase 6
    console.log('Edit note', noteId);
  };

  const handleSessionPress = (sessionId: number) => {
    // TODO: Show session details in Phase 7
    console.log('View session', sessionId);
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.accent0} />
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <SegmentedControl value={temporalMode} onChange={setTemporalMode} />
        </View>

        <DateHeader date={selectedDate} entriesCount={entriesCount} />

        <AddActionBar
          onAddTask={handleAddTask}
          onAddNote={handleAddNote}
          onAddSession={handleAddSession}
        />

        {entries.length === 0 ? (
          <EmptyState message="No entries yet. Start by adding a task, note, or session." />
        ) : (
          entries.map((entry) => {
            if (entry.type === 'task') {
              return (
                <TaskCard
                  key={`task-${entry.data.id}`}
                  task={entry.data}
                  onPress={() => handleTaskPress(entry.data.id)}
                  onToggleComplete={() => handleTaskToggle(entry.data.id)}
                />
              );
            }
            if (entry.type === 'note') {
              return (
                <NoteCard
                  key={`note-${entry.data.id}`}
                  note={entry.data}
                  onPress={() => handleNotePress(entry.data.id)}
                />
              );
            }
            if (entry.type === 'session') {
              return (
                <SessionCard
                  key={`session-${entry.data.id}`}
                  session={entry.data}
                  onPress={() => handleSessionPress(entry.data.id)}
                />
              );
            }
            return null;
          })
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing['3xl'],
  },
  header: {
    marginBottom: Spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
