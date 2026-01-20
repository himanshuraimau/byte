import { CalendarModal } from "@/components/calendar/CalendarModal";
import { NoteModal } from "@/components/modals/NoteModal";
import { TaskModal } from "@/components/modals/TaskModal";
import { AddActionBar } from "@/components/timeline/AddActionBar";
import { DateHeader } from "@/components/timeline/DateHeader";
import { EmptyState } from "@/components/timeline/EmptyState";
import { NoteCard } from "@/components/timeline/NoteCard";
import { SessionCard } from "@/components/timeline/SessionCard";
import { TaskCard } from "@/components/timeline/TaskCard";
import { ActionSheet, ActionSheetOption } from "@/components/ui/ActionSheet";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { ThemedView } from "@/components/ui/themed-view";
import { Toast } from "@/components/ui/Toast";
import { Colors, Spacing } from "@/constants/theme";
import { useDate } from "@/context/DateContext";
import { useTimeline } from "@/context/TimelineContext";
import { useNote } from "@/hooks/useNote";
import { useTask } from "@/hooks/useTask";
import { useToast } from "@/hooks/useToast";
import { Note, Task } from "@/types/entities";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    View,
} from "react-native";

export default function TimelineScreen() {
  const router = useRouter();
  const { selectedDate, temporalMode, setTemporalMode, setSelectedDate } =
    useDate();
  const { entries, loading, entriesCount, refreshTimeline } = useTimeline();
  const { createTask, updateTask, deleteTask, toggleTaskComplete } = useTask();
  const { createNote, updateNote, deleteNote } = useNote();
  const { toast, showToast, hideToast } = useToast();
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [calendarModalVisible, setCalendarModalVisible] = useState(false);
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [actionSheetOptions, setActionSheetOptions] = useState<
    ActionSheetOption[]
  >([]);

  const handleAddTask = () => {
    setEditingTask(null);
    setTaskModalVisible(true);
  };

  const handleAddNote = () => {
    setEditingNote(null);
    setNoteModalVisible(true);
  };

  const handleAddSession = () => {
    router.push("/(tabs)/timer");
  };

  const handleTaskPress = (task: Task) => {
    setEditingTask(task);
    setTaskModalVisible(true);
  };

  const handleTaskLongPress = (task: Task) => {
    const options: ActionSheetOption[] = [
      {
        label: "Edit",
        onPress: () => {
          setEditingTask(task);
          setTaskModalVisible(true);
        },
      },
      {
        label: task.completed ? "Mark Incomplete" : "Mark Complete",
        onPress: () => handleTaskToggle(task),
      },
      {
        label: "Delete",
        destructive: true,
        onPress: async () => {
          try {
            await deleteTask(task.id);
            showToast("Task deleted", "info");
          } catch (error) {
            showToast("Failed to delete task", "error");
          }
        },
      },
    ];
    setActionSheetOptions(options);
    setActionSheetVisible(true);
  };

  const handleTaskToggle = async (task: Task) => {
    try {
      await toggleTaskComplete(task.id, !task.completed);
      showToast(
        task.completed ? "Task marked incomplete" : "Task completed!",
        "success",
      );
    } catch (error) {
      console.error("Failed to toggle task:", error);
      showToast("Failed to update task", "error");
    }
  };

  const handleTaskSave = async (data: { title: string; progress: number }) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, data);
        showToast("Task updated", "success");
      } else {
        await createTask(data.title, data.progress);
        showToast("Task created", "success");
      }
    } catch (error) {
      showToast("Failed to save task", "error");
      throw error;
    }
  };

  const handleTaskDelete = async () => {
    if (editingTask) {
      try {
        await deleteTask(editingTask.id);
        showToast("Task deleted", "info");
      } catch (error) {
        showToast("Failed to delete task", "error");
        throw error;
      }
    }
  };

  const handleNotePress = (note: Note) => {
    setEditingNote(note);
    setNoteModalVisible(true);
  };

  const handleNoteLongPress = (note: Note) => {
    const options: ActionSheetOption[] = [
      {
        label: "Edit",
        onPress: () => {
          setEditingNote(note);
          setNoteModalVisible(true);
        },
      },
      {
        label: "Delete",
        destructive: true,
        onPress: async () => {
          try {
            await deleteNote(note.id);
            showToast("Note deleted", "info");
          } catch (error) {
            showToast("Failed to delete note", "error");
          }
        },
      },
    ];
    setActionSheetOptions(options);
    setActionSheetVisible(true);
  };

  const handleNoteSave = async (content: string) => {
    try {
      if (editingNote) {
        await updateNote(editingNote.id, content);
        showToast("Note updated", "success");
      } else {
        await createNote(content);
        showToast("Note created", "success");
      }
    } catch (error) {
      showToast("Failed to save note", "error");
      throw error;
    }
  };

  const handleNoteDelete = async () => {
    if (editingNote) {
      try {
        await deleteNote(editingNote.id);
        showToast("Note deleted", "info");
      } catch (error) {
        showToast("Failed to delete note", "error");
        throw error;
      }
    }
  };

  const handleSessionPress = (sessionId: number) => {
    // TODO: Show session details in Phase 7
    console.log("View session", sessionId);
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
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerSection}>
          <View style={styles.dateNavigator}>
            <SegmentedControl
              value={temporalMode}
              selectedDate={selectedDate}
              onChange={setTemporalMode}
            />
          </View>
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <DateHeader
          date={selectedDate}
          entriesCount={entriesCount}
          onCalendarPress={() => setCalendarModalVisible(true)}
        />

        <AddActionBar
          onAddTask={handleAddTask}
          onAddNote={handleAddNote}
          onAddSession={handleAddSession}
        />

        {entries.length === 0 ? (
          <EmptyState message="No entries yet. Start by adding a task, note, or session." />
        ) : (
          entries.map((entry) => {
            if (entry.type === "task") {
              return (
                <TaskCard
                  key={`task-${entry.data.id}`}
                  task={entry.data}
                  onPress={() => handleTaskPress(entry.data)}
                  onLongPress={() => handleTaskLongPress(entry.data)}
                  onToggleComplete={() => handleTaskToggle(entry.data)}
                />
              );
            }
            if (entry.type === "note") {
              return (
                <NoteCard
                  key={`note-${entry.data.id}`}
                  note={entry.data}
                  onPress={() => handleNotePress(entry.data)}
                  onLongPress={() => handleNoteLongPress(entry.data)}
                />
              );
            }
            if (entry.type === "session") {
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

      <CalendarModal
        visible={calendarModalVisible}
        selectedDate={selectedDate}
        onClose={() => setCalendarModalVisible(false)}
        onDateSelect={setSelectedDate}
      />

      <ActionSheet
        visible={actionSheetVisible}
        onClose={() => setActionSheetVisible(false)}
        options={actionSheetOptions}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={hideToast}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg1,
  },
  safeArea: {
    backgroundColor: Colors.bg0,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  headerSection: {
    backgroundColor: Colors.bg0,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  dateNavigator: {
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing["3xl"],
  },
  calendarButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
