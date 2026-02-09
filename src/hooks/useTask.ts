import { useDate } from "@/context/DateContext";
import { useTimeline } from "@/context/TimelineContext";
import { useUser } from "@/context/UserContext";
import { apiClient } from "@/services/ApiClient";
import { Task } from "@/types/entities";
import { useState } from "react";

export function useTask() {
  const { user } = useUser();
  const { selectedDate } = useDate();
  const { refreshTimeline } = useTimeline();
  const [loading, setLoading] = useState(false);

  const getTasksForDay = async (date: string): Promise<Task[]> => {
    if (!user) throw new Error("User not authenticated");

    try {
      setLoading(true);

      // Backend is the Next.js API in byte-web:
      // GET /api/entries?date=YYYY-MM-DD&type=TASK
      const response = await apiClient.get(
        `/entries?date=${encodeURIComponent(date)}&type=TASK`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = (await response.json()) as any[];
      // Map API entry shape into Task shape used by the app where possible.
      return data.map((entry) => ({
        id: entry._id ?? entry.id,
        title: entry.content,
        progress: entry.progress ?? 0,
        status: entry.status,
        date: entry.date,
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt,
      })) as Task[];
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (title: string, progress: number = 0) => {
    if (!user) throw new Error("User not authenticated");
    
    try {
      setLoading(true);
      
      const response = await apiClient.post('/entries', {
        type: 'TASK',
        date: selectedDate,
        content: title,
        progress: progress,
        status: progress === 100 ? 'COMPLETE' : 'INCOMPLETE'
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }
      
      // Refresh timeline
      await refreshTimeline(selectedDate);
    } catch (error) {
      console.error("Failed to create task:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (
    taskId: string,
    updates: { title?: string; progress?: number; completed?: boolean }
  ) => {
    try {
      setLoading(true);
      
      const response = await apiClient.patch(`/entries/${taskId}`, {
        content: updates.title,
        progress: updates.progress,
        status: updates.completed === true ? 'COMPLETE' : (updates.completed === false ? 'INCOMPLETE' : undefined)
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      await refreshTimeline(selectedDate);
    } catch (error) {
      console.error("Failed to update task:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      setLoading(true);
      const response = await apiClient.delete(`/entries/${taskId}`);

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      await refreshTimeline(selectedDate);
    } catch (error) {
      console.error("Failed to delete task:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskComplete = async (taskId: string, completed: boolean) => {
    try {
      setLoading(true);
      const response = await apiClient.patch(`/entries/${taskId}`, {
        status: completed ? 'COMPLETE' : 'INCOMPLETE'
      });

      if (!response.ok) {
        throw new Error('Failed to toggle task');
      }

      await refreshTimeline(selectedDate);
    } catch (error) {
      console.error("Failed to toggle task:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    getTasksForDay,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    loading,
  };
}