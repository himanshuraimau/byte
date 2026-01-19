import { useState, useCallback } from 'react';
import * as SQLite from 'expo-sqlite';
import { Task } from '@/types/entities';
import { initDatabase } from '@/database/db';
import { DayRepository, TaskRepository } from '@/database/repositories';
import { useDate } from '@/context/DateContext';
import { useTimeline } from '@/context/TimelineContext';

export function useTask() {
  const [loading, setLoading] = useState(false);
  const { selectedDate } = useDate();
  const { refreshTimeline } = useTimeline();

  const createTask = useCallback(
    async (title: string, progress: number = 0): Promise<Task> => {
      setLoading(true);
      try {
        const db = await initDatabase();
        const dayRepo = new DayRepository(db);
        const taskRepo = new TaskRepository(db);

        const day = await dayRepo.createOrGet(selectedDate);
        const task = await taskRepo.create(day.id, title, progress);

        await refreshTimeline(selectedDate);
        return task;
      } catch (error) {
        console.error('Failed to create task:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [selectedDate, refreshTimeline]
  );

  const updateTask = useCallback(
    async (
      taskId: number,
      updates: Partial<Pick<Task, 'title' | 'progress' | 'completed'>>
    ): Promise<Task> => {
      setLoading(true);
      try {
        const db = await initDatabase();
        const taskRepo = new TaskRepository(db);

        const task = await taskRepo.update(taskId, updates);
        await refreshTimeline(selectedDate);
        return task;
      } catch (error) {
        console.error('Failed to update task:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [selectedDate, refreshTimeline]
  );

  const deleteTask = useCallback(
    async (taskId: number): Promise<void> => {
      setLoading(true);
      try {
        const db = await initDatabase();
        const taskRepo = new TaskRepository(db);

        await taskRepo.delete(taskId);
        await refreshTimeline(selectedDate);
      } catch (error) {
        console.error('Failed to delete task:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [selectedDate, refreshTimeline]
  );

  const toggleTaskComplete = useCallback(
    async (taskId: number, completed: boolean): Promise<Task> => {
      return updateTask(taskId, { completed });
    },
    [updateTask]
  );

  return {
    createTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    loading,
  };
}
