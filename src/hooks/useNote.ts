import { useDate } from "@/context/DateContext";
import { useTimeline } from "@/context/TimelineContext";
import { useUser } from "@/context/UserContext";
import { apiClient } from "@/services/ApiClient";
import { Note } from "@/types/entities";
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
      
      const response = await apiClient.post('/entries', {
        type: 'NOTE',
        date: selectedDate,
        content: content
      });

      if (!response.ok) {
        throw new Error('Failed to create note');
      }
      
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
      const response = await apiClient.patch(`/entries/${noteId}`, {
        content: content
      });

      if (!response.ok) {
        throw new Error('Failed to update note');
      }

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
      const response = await apiClient.delete(`/entries/${noteId}`);

      if (!response.ok) {
        throw new Error('Failed to delete note');
      }

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