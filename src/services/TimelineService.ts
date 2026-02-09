import { apiClient } from "./ApiClient";
import { TimelineEntry, Task, Note, Session } from "@/types/entities";

export class TimelineService {
  /**
   * Get all timeline entries for a specific date, sorted chronologically
   */
  async getTimelineEntries(
    date: string,
    userId: string,
  ): Promise<TimelineEntry[]> {
    const response = await apiClient.get(`/entries?date=${date}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch entries');
    }

    const data = await response.json();
    
    // Map backend Entry to mobile TimelineEntry format
    return data.map((entry: any): TimelineEntry => {
      const base = {
        id: entry._id,
        created_at: new Date(entry.createdAt).getTime() / 1000,
        updated_at: new Date(entry.updatedAt).getTime() / 1000,
      };

      if (entry.type === 'TASK') {
        return {
          type: 'task',
          data: {
            ...base,
            day_id: entry.date,
            title: entry.content,
            progress: entry.progress || 0,
            completed: entry.status === 'COMPLETE',
          } as Task
        };
      } else if (entry.type === 'NOTE') {
        return {
          type: 'note',
          data: {
            ...base,
            day_id: entry.date,
            content: entry.content,
          } as Note
        };
      } else {
        return {
          type: 'session',
          data: {
            ...base,
            day_id: entry.date,
            task_id: entry.linkedTaskId,
            name: entry.content,
            duration_minutes: entry.duration || 0,
            started_at: entry.startedAt ? new Date(entry.startedAt).getTime() / 1000 : 0,
            ended_at: entry.endedAt ? new Date(entry.endedAt).getTime() / 1000 : null,
            completed: entry.status === 'COMPLETE',
          } as Session
        };
      }
    });
  }

  /**
   * Get entries count for a date
   */
  async getEntriesCount(date: string, userId: string): Promise<number> {
    const entries = await this.getTimelineEntries(date, userId);
    return entries.length;
  }

  /**
   * Check if a date has any entries
   */
  async hasEntries(date: string, userId: string): Promise<boolean> {
    const count = await this.getEntriesCount(date, userId);
    return count > 0;
  }
}