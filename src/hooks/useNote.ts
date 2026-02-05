import { useDate } from "@/context/DateContext";
import { useTimeline } from "@/context/TimelineContext";
import { useUser } from "@/context/UserContext";
import { DayRepository, NoteRepository } from "@/database/repositories";
import { useState } from "react";

export function useNote() {
  const { user } = useUser();
  const { selectedDate } = useDate();
  const { refreshTimeline } = useTimeline();
  const [loading, setLoading] = useState(false);

  const createNote = async (content: string) => {
    if (!user) throw new Error("User not authenticated");
    
    try {
      setLoading(true);
      const dayRepo = new DayRepository();
      const noteRepo = new NoteRepository();
      
      // Get or create day
      const day = await dayRepo.getOrCreate(user.id, selectedDate);
      
      // Create note
      await noteRepo.create(day.id, content);
      
      // Refresh timeline
      await refreshTimeline(selectedDate);
    } catch (error) {
      console.error("Failed to create note:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateNote = async (noteId: string, content: string) => {
    try {
      setLoading(true);
      const noteRepo = new NoteRepository();
      
      await noteRepo.update(noteId, content);
      await refreshTimeline(selectedDate);
    } catch (error) {
      console.error("Failed to update note:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      setLoading(true);
      const noteRepo = new NoteRepository();
      
      await noteRepo.delete(noteId);
      await refreshTimeline(selectedDate);
    } catch (error) {
      console.error("Failed to delete note:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createNote,
    updateNote,
    deleteNote,
    loading,
  };
}
