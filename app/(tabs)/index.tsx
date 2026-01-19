import { NoteModal } from '@/components/modals/NoteModal';
import { TaskModal } from '@/components/modals/TaskModal';
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
import { useNote } from '@/hooks/useNote';
import { useTask } from '@/hooks/useTask';
import { Note, Task } from '@/types/entities';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

export default function TimelineScreen() {
  const { selectedDate, temporalMode, setTemporalMode } = useDate();
  const { entries, loading, entriesCount, refreshTimeline } = useTimeline();
  const { createTask, updateTask, deleteTask, toggleTaskComplete } = useTask();
  const { createNote, updateNote, deleteNote } = useNote();
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const handleAddTask = () => {
    setEditingTask(null);
    setTaskModalVisible(true);
  };

  const handleAddNote = () => {
    setEditingNote(null);
    setNoteModalVisible(true);
  };

  const handleAddSession = () => {
    // TODO: Navigate to timer screen in Phase 7
    console.log('Add session');
  };

  const handleTaskPress = (task: Task) => {
    setEditingTask(task);
    setTaskModalVisible(true);
  };

  const handleTaskToggle = async (task: Task) => {
    try {
      await toggleTaskComplete(task.id, !task.completed);
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  const handleTaskSave = async (data: { title: string; progress: number }) => {
    if (editingTask) {
      await updateTask(editingTask.id, data);
    } else {
      await createTask(data.title, data.progress);
    }
  };

  const handleTaskDelete = async () => {
    if (editingTask) {
      await deleteTask(editingTask.id);
    }
  };

  const handleNotePress = (note: Note) => {
    setEditingNote(note);
    setNoteModalVisible(true);
  };

  const handleNoteSave = async (content: string) => {
    if (editingNote) {
      await updateNote(editingNote.id, content);
    } else {
      await createNote(content);
    }
  };

  const handleNoteDelete = async () => {
    if (editingNote) {
      await deleteNote(editingNote.id);
    }
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
                  onPress={() => handleTaskPress(entry.data)}
                  onToggleComplete={() => handleTaskToggle(entry.data)}
                />
              );
            }
            if (entry.type === 'note') {
              return (
                <NoteCard
                  key={`note-${entry.data.id}`}
                  note={entry.data}
                  onPress={() => handleNotePress(entry.data)}
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

      <TaskModal
        visible={taskModalVisible}
        task={editingTask}
        onClose={() => {
          setTaskModalVisible(false);
          setEditingTask(null);
        }}
        onSave={handleTaskSave}
        onDelete={editingTask ? handleTaskDelete : undefined}
      />

      <NoteModal
        visible={noteModalVisible}
        note={editingNote}
        onClose={() => {
          setNoteModalVisible(false);
          setEditingNote(null);
        }}
        onSave={handleNoteSave}
        onDelete={editingNote ? handleNoteDelete : undefined}
      />
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
