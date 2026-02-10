import { Session } from "@/types/entities";
import { entriesAPI } from "@/services/api";
import { format } from "date-fns";

export class SessionRepository {
  /**
   * Create a new session
   */
  async create(
    dayId: string,
    name: string,
    durationMinutes: number,
    taskId?: string
  ): Promise<Session> {
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const response = await entriesAPI.create({
        type: 'SESSION',
        date: today,
        content: name,
        duration: durationMinutes,
        linkedTaskId: taskId,
      });
      return {
        id: response._id || response.id,
        day_id: dayId,
        name,
        duration_minutes: durationMinutes,
        started_at: Math.floor(Date.now() / 1000),
        completed: false,
        created_at: Math.floor(new Date(response.createdAt).getTime() / 1000),
        task_id: taskId,
      } as Session;
    } catch (error: any) {
      console.error("Create session error:", error);
      throw error;
    }
  }

  /**
   * Get session by ID
   */
  async getById(id: string): Promise<Session | null> {
    try {
      const response = await entriesAPI.getById(id);
      if (!response) return null;
      return {
        id: response._id || response.id,
        day_id: '',
        name: response.content,
        duration_minutes: response.duration || 0,
        started_at: response.startedAt ? Math.floor(new Date(response.startedAt).getTime() / 1000) : 0,
        ended_at: response.endedAt ? Math.floor(new Date(response.endedAt).getTime() / 1000) : undefined,
        completed: response.status === 'completed',
        created_at: Math.floor(new Date(response.createdAt).getTime() / 1000),
        task_id: response.linkedTaskId,
      } as Session;
    } catch (error: any) {
      console.error("Get session by ID error:", error);
      return null;
    }
  }

  /**
   * Get all sessions for a day
   */
  async getByDayId(dayId: string): Promise<Session[]> {
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const response = await entriesAPI.list(today, 'SESSION');
      if (!Array.isArray(response)) return [];
      return response.map(entry => ({
        id: entry._id || entry.id,
        day_id: dayId,
        name: entry.content,
        duration_minutes: entry.duration || 0,
        started_at: entry.startedAt ? Math.floor(new Date(entry.startedAt).getTime() / 1000) : 0,
        ended_at: entry.endedAt ? Math.floor(new Date(entry.endedAt).getTime() / 1000) : undefined,
        completed: entry.status === 'completed',
        created_at: Math.floor(new Date(entry.createdAt).getTime() / 1000),
        task_id: entry.linkedTaskId,
      }));
    } catch (error: any) {
      console.error("Get sessions by day ID error:", error);
      return [];
    }
  }

  /**
   * Get all sessions for a task
   */
  async getByTaskId(taskId: string): Promise<Session[]> {
    try {
      // This would need backend support to query by linkedTaskId
      return [];
    } catch (error: any) {
      console.error("Get sessions by task ID error:", error);
      return [];
    }
  }

  /**
   * Update session
   */
  async update(id: string, data: Partial<Session>): Promise<Session> {
    try {
      const updateData: any = {};
      if (data.name !== undefined) updateData.content = data.name;
      if (data.duration_minutes !== undefined) updateData.duration = data.duration_minutes;
      if (data.completed !== undefined) updateData.status = data.completed ? 'completed' : 'pending';
      if (data.ended_at !== undefined) updateData.endedAt = data.ended_at ? new Date(data.ended_at * 1000).toISOString() : null;

      const response = await entriesAPI.update(id, updateData);
      return {
        id: response._id || response.id,
        day_id: '',
        name: response.content,
        duration_minutes: response.duration || 0,
        started_at: response.startedAt ? Math.floor(new Date(response.startedAt).getTime() / 1000) : 0,
        ended_at: response.endedAt ? Math.floor(new Date(response.endedAt).getTime() / 1000) : undefined,
        completed: response.status === 'completed',
        created_at: Math.floor(new Date(response.createdAt).getTime() / 1000),
        task_id: response.linkedTaskId,
      } as Session;
    } catch (error: any) {
      console.error("Update session error:", error);
      throw error;
    }
  }

  /**
   * Complete a session
   */
  async complete(id: string): Promise<Session> {
    try {
      const response = await entriesAPI.update(id, {
        status: 'completed',
        endedAt: new Date().toISOString(),
      });
      return {
        id: response._id || response.id,
        day_id: '',
        name: response.content,
        duration_minutes: response.duration || 0,
        started_at: response.startedAt ? Math.floor(new Date(response.startedAt).getTime() / 1000) : 0,
        ended_at: response.endedAt ? Math.floor(new Date(response.endedAt).getTime() / 1000) : undefined,
        completed: true,
        created_at: Math.floor(new Date(response.createdAt).getTime() / 1000),
        task_id: response.linkedTaskId,
      } as Session;
    } catch (error: any) {
      console.error("Complete session error:", error);
      throw error;
    }
  }

  /**
   * Delete session
   */
  async delete(id: string): Promise<void> {
    try {
      await entriesAPI.delete(id);
    } catch (error: any) {
      console.error("Delete session error:", error);
      throw error;
    }
  }

  /**
   * Get active (incomplete) sessions for a day
   */
  async getActiveSessions(dayId: string): Promise<Session[]> {
    try {
      const sessions = await this.getByDayId(dayId);
      return sessions.filter(s => !s.completed);
    } catch (error: any) {
      console.error("Get active sessions error:", error);
      return [];
    }
  }
}
