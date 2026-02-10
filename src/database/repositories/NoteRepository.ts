import { Note } from "@/types/entities";
import { entriesAPI } from "@/services/api";
import { format } from "date-fns";

export class NoteRepository {
  /**
   * Create a new note
   */
  async create(dayId: string, content: string): Promise<Note> {
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const response = await entriesAPI.create({
        type: 'NOTE',
        date: today,
        content,
      });
      return {
        id: response._id || response.id,
        day_id: dayId,
        content,
        created_at: Math.floor(new Date(response.createdAt).getTime() / 1000),
        updated_at: Math.floor(new Date(response.updatedAt || response.createdAt).getTime() / 1000),
      } as Note;
    } catch (error: any) {
      console.error("Create note error:", error);
      throw error;
    }
  }

  /**
   * Get note by ID
   */
  async getById(id: string): Promise<Note | null> {
    try {
      const response = await entriesAPI.getById(id);
      if (!response) return null;
      return {
        id: response._id || response.id,
        day_id: response.linkedTaskId || '',
        content: response.content,
        created_at: Math.floor(new Date(response.createdAt).getTime() / 1000),
        updated_at: Math.floor(new Date(response.updatedAt).getTime() / 1000),
      } as Note;
    } catch (error: any) {
      console.error("Get note by ID error:", error);
      return null;
    }
  }

  /**
   * Get all notes for a day
   */
  async getByDayId(dayId: string): Promise<Note[]> {
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const response = await entriesAPI.list(today, 'NOTE');
      if (!Array.isArray(response)) return [];
      return response.map(entry => ({
        id: entry._id || entry.id,
        day_id: dayId,
        content: entry.content,
        created_at: Math.floor(new Date(entry.createdAt).getTime() / 1000),
        updated_at: Math.floor(new Date(entry.updatedAt).getTime() / 1000),
      }));
    } catch (error: any) {
      console.error("Get notes by day ID error:", error);
      return [];
    }
  }

  /**
   * Update note
   */
  async update(id: string, content: string): Promise<Note> {
    try {
      const response = await entriesAPI.update(id, { content });
      return {
        id: response._id || response.id,
        day_id: '',
        content: response.content,
        created_at: Math.floor(new Date(response.createdAt).getTime() / 1000),
        updated_at: Math.floor(new Date(response.updatedAt).getTime() / 1000),
      } as Note;
    } catch (error: any) {
      console.error("Update note error:", error);
      throw error;
    }
  }

  /**
   * Delete note
   */
  async delete(id: string): Promise<void> {
    try {
      await entriesAPI.delete(id);
    } catch (error: any) {
      console.error("Delete note error:", error);
      throw error;
    }
  }
}
