import { Day } from "@/types/entities";
import { dailyStateAPI, taskSetsAPI } from "@/services/api";
import { format } from "date-fns";

export class DayRepository {
  /**
   * Get or create a day for a user
   */
  async getOrCreate(userId: string, date: string): Promise<Day> {
    try {
      // Days are implicitly created in the backend via entries
      return {
        id: date, // Use date as ID
        user_id: userId,
        date,
        created_at: Math.floor(new Date().getTime() / 1000),
      } as Day;
    } catch (error: any) {
      console.error("Get or create day error:", error);
      throw error;
    }
  }

  /**
   * Get day by ID
   */
  async getById(id: string): Promise<Day | null> {
    try {
      // Days are virtual based on entries
      return {
        id,
        user_id: '',
        date: id,
        created_at: Math.floor(new Date().getTime() / 1000),
      } as Day;
    } catch (error: any) {
      console.error("Get day by ID error:", error);
      return null;
    }
  }

  /**
   * Get all days for a user
   */
  async getByUserId(userId: string): Promise<Day[]> {
    try {
      // This would need to be implemented on the backend to fetch all user days with entries
      const taskSets = await taskSetsAPI.list();
      const days: Day[] = [];
      
      // Return empty for now - would need backend support to list all days with entries
      return days;
    } catch (error: any) {
      console.error("Get days by user ID error:", error);
      return [];
    }
  }

  /**
   * Get all days that have entries (tasks, notes, or sessions) for a user
   */
  async findAllWithEntries(userId: string): Promise<Day[]> {
    try {
      // This would need to be implemented on the backend
      return [];
    } catch (error: any) {
      console.error("Find days with entries error:", error);
      return [];
    }
  }

  /**
   * Get days for a user within a date range
   */
  async getByDateRange(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<Day[]> {
    try {
      // This would need to be implemented on the backend
      return [];
    } catch (error: any) {
      console.error("Get days by date range error:", error);
      return [];
    }
  }

  /**
   * Delete a day and all associated data
   */
  async delete(id: string): Promise<void> {
    try {
      // This would need to be implemented on the backend
      console.warn("Delete day not yet implemented on backend");
    } catch (error: any) {
      console.error("Delete day error:", error);
      throw error;
    }
  }
}
