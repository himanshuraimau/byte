import { useDate } from "@/context/DateContext";
import { useTimeline } from "@/context/TimelineContext";
import { useUser } from "@/context/UserContext";
import { DayRepository, TaskRepository } from "@/database/repositories";
import { Task } from "@/types/entities";
import { useState } from "react";

export function useTask() {
  const { user } = useUser();
  const { selectedDate } = useDate();
  const { refreshTimeline } = useTimeline();
  const [loading, setLoading] = useState(false);

  const createTask = async (title: string, progress: number = 0) => {
    if (!user) throw new Error("User not authenticated");
    
    try {
      setLoading(true);
      const dayRepo = new DayRepository();
      const taskRepo = new TaskRepository();
      
      // Get or create day
      const day = await dayRepo.getOrCreate(user.id, selectedDate);
      
      // Create task
      const task = await taskRepo.create(day.id, title);
      if (progress > 0) {
        await taskRepo.updateProgress(task.id, progress);
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
      const taskRepo = new TaskRepository();
      
      await taskRepo.update(taskId, updates);
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
      const taskRepo = new TaskRepository();
      
      await taskRepo.delete(taskId);
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
      const taskRepo = new TaskRepository();
      
      await taskRepo.update(taskId, { completed });
      await refreshTimeline(selectedDate);
    } catch (error) {
      console.error("Failed to toggle task:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getTasksForDay = async (date: string): Promise<Task[]> => {
    if (!user) return [];
    
    try {
      const dayRepo = new DayRepository();
      const taskRepo = new TaskRepository();
      
      // Try to get existing day
      const day = await dayRepo.getOrCreate(user.id, date);
      
      // Get tasks for the day
      const tasks = await taskRepo.getByDayId(day.id);
      return tasks;
    } catch (error) {
      console.error("Failed to get tasks for day:", error);
      return [];
    }
  };

  return {
    createTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    getTasksForDay,
    loading,
  };
}
