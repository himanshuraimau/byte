import { useState, useCallback } from 'react';
import * as SQLite from 'expo-sqlite';
import { Note } from '@/types/entities';
import { initDatabase } from '@/database/db';
import { DayRepository, NoteRepository } from '@/database/repositories';
import { useDate } from '@/context/DateContext';
import { useTimeline } from '@/context/TimelineContext';

export function useNote() {
  const [loading, setLoading] = useState(false);
  const { selectedDate } = useDate();
  const { refreshTimeline } = useTimeline();

  const createNote = useCallback(
    async (content: string): Promise<Note> => {
      setLoading(true);
      try {
        const db = await initDatabase();
        const dayRepo = new DayRepository(db);
        const noteRepo = new NoteRepository(db);

        const day = await dayRepo.createOrGet(selectedDate);
        const note = await noteRepo.create(day.id, content);

        await refreshTimeline(selectedDate);
        return note;
      } catch (error) {
        console.error('Failed to create note:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [selectedDate, refreshTimeline]
  );

  const updateNote = useCallback(
    async (noteId: number, content: string): Promise<Note> => {
      setLoading(true);
      try {
        const db = await initDatabase();
        const noteRepo = new NoteRepository(db);

        const note = await noteRepo.update(noteId, content);
        await refreshTimeline(selectedDate);
        return note;
      } catch (error) {
        console.error('Failed to update note:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [selectedDate, refreshTimeline]
  );

  const deleteNote = useCallback(
    async (noteId: number): Promise<void> => {
      setLoading(true);
      try {
        const db = await initDatabase();
        const noteRepo = new NoteRepository(db);

        await noteRepo.delete(noteId);
        await refreshTimeline(selectedDate);
      } catch (error) {
        console.error('Failed to delete note:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [selectedDate, refreshTimeline]
  );

  return {
    createNote,
    updateNote,
    deleteNote,
    loading,
  };
}
