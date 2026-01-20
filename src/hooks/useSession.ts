import { useState, useCallback } from 'react';
import * as SQLite from 'expo-sqlite';
import { Session, Task } from '@/types/entities';
import { initDatabase } from '@/database/db';
import { DayRepository, SessionRepository, TaskRepository } from '@/database/repositories';
import { useDate } from '@/context/DateContext';
import { useTimeline } from '@/context/TimelineContext';

export function useSession() {
  const [loading, setLoading] = useState(false);
  const { selectedDate } = useDate();
  const { refreshTimeline } = useTimeline();

  const createSession = useCallback(
    async (
      name: string,
      durationMinutes: number,
      taskId: number | null = null
    ): Promise<Session> => {
      setLoading(true);
      try {
        const db = await initDatabase();
        const dayRepo = new DayRepository(db);
        const sessionRepo = new SessionRepository(db);

        const day = await dayRepo.createOrGet(selectedDate);
        const startedAt = Math.floor(Date.now() / 1000); // Unix timestamp

        const session = await sessionRepo.create(
          day.id,
          name,
          durationMinutes,
          startedAt,
          taskId
        );

        return session;
      } catch (error) {
        console.error('Failed to create session:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [selectedDate]
  );

  const completeSession = useCallback(
    async (sessionId: number): Promise<Session> => {
      setLoading(true);
      try {
        const db = await initDatabase();
        const sessionRepo = new SessionRepository(db);

        const endedAt = Math.floor(Date.now() / 1000);
        const session = await sessionRepo.complete(sessionId, endedAt);

        await refreshTimeline(selectedDate);
        return session;
      } catch (error) {
        console.error('Failed to complete session:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [selectedDate, refreshTimeline]
  );

  const getTasksForDay = useCallback(async (date?: string): Promise<Task[]> => {
    try {
      const db = await initDatabase();
      const dayRepo = new DayRepository(db);
      const taskRepo = new TaskRepository(db);

      const targetDate = date || selectedDate;
      const day = await dayRepo.findByDate(targetDate);
      if (!day) {
        return [];
      }

      return await taskRepo.findByDayId(day.id);
    } catch (error) {
      console.error('Failed to get tasks:', error);
      return [];
    }
  }, [selectedDate]);

  return {
    createSession,
    completeSession,
    getTasksForDay,
    loading,
  };
}
