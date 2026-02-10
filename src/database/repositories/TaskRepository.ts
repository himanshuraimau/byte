import { Task } from "@/types/entities";
import { entriesAPI } from "@/services/api";
import { format } from "date-fns";

export class TaskRepository {
  /**
   * Create a new task
   */
  async create(dayId: string, title: string): Promise<Task> {
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const response = await entriesAPI.create({
        type: 'TASK',
        date: today,
        content: title,
        progress: 0,
        status: 'pending',
      });
      return {
        id: response._id || response.id,
        day_id: dayId,
        title,
        progress: 0,
        completed: false,
        created_at: Math.floor(new Date(response.createdAt).getTime() / 1000),
        updated_at: Math.floor(new Date(response.updatedAt || response.createdAt).getTime() / 1000),
      } as Task;
    } catch (error: any) {
      console.error("Create task error:", error);
      throw error;
    }
  }

  /**
   * Get task by ID
   */
  async getById(id: string): Promise<Task | null> {
    try {
      const response = await entriesAPI.getById(id);
      if (!response) return null;
      return {
        id: response._id || response.id,
        day_id: '',
        title: response.content,
        progress: response.progress || 0,
        completed: response.status === 'completed',
        created_at: Math.floor(new Date(response.createdAt).getTime() / 1000),
        updated_at: Math.floor(new Date(response.updatedAt).getTime() / 1000),
      } as Task;
    } catch (error: any) {
      console.error("Get task by ID error:", error);
      return null;
    }
  }

  /**
   * Get all tasks for a day
   */
  async getByDayId(dayId: string): Promise<Task[]> {
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const response = await entriesAPI.list(today, 'TASK');
      if (!Array.isArray(response)) return [];
      return response.map(entry => ({
        id: entry._id || entry.id,
        day_id: dayId,
        title: entry.content,
        progress: entry.progress || 0,
        completed: entry.status === 'completed',
        created_at: Math.floor(new Date(entry.createdAt).getTime() / 1000),
        updated_at: Math.floor(new Date(entry.updatedAt).getTime() / 1000),
      }));
    } catch (error: any) {
      console.error("Get tasks by day ID error:", error);
      return [];
    }
  }

  /**
   * Update task
   */
  async update(id: string, data: Partial<Task>): Promise<Task> {
    try {
      const updateData: any = {};
      if (data.title !== undefined) updateData.content = data.title;
      if (data.progress !== undefined) updateData.progress = data.progress;
      if (data.completed !== undefined) updateData.status = data.completed ? 'completed' : 'pending';

      const response = await entriesAPI.update(id, updateData);
      return {
        id: response._id || response.id,
        day_id: '',
        title: response.content,
        progress: response.progress || 0,
        completed: response.status === 'completed',
        created_at: Math.floor(new Date(response.createdAt).getTime() / 1000),
        updated_at: Math.floor(new Date(response.updatedAt).getTime() / 1000),
      } as Task;
    } catch (error: any) {
      console.error("Update task error:", error);
      throw error;
    }
  }

  /**
   * Delete task
   */
  async delete(id: string): Promise<void> {
    try {
      await entriesAPI.delete(id);
    } catch (error: any) {
      console.error("Delete task error:", error);
      throw error;
    }
  }

  /**
   * Toggle task completion
   */
  async toggleComplete(id: string): Promise<Task> {
    try {
      const current = await this.getById(id);
      if (!current) throw new Error("Task not found");
      
      const response = await entriesAPI.update(id, {
        status: current.completed ? 'pending' : 'completed',
        progress: current.completed ? current.progress : 100,
      });
      return {
        id: response._id || response.id,
        day_id: '',
        title: response.content,
        progress: response.progress || 0,
        completed: response.status === 'completed',
        created_at: Math.floor(new Date(response.createdAt).getTime() / 1000),
        updated_at: Math.floor(new Date(response.updatedAt).getTime() / 1000),
      } as Task;
    } catch (error: any) {
      console.error("Toggle task complete error:", error);
      throw error;
    }
  }

  /**
   * Update task progress
   */
  async updateProgress(id: string, progress: number): Promise<Task> {
    try {
      const clampedProgress = Math.max(0, Math.min(100, progress));
      const response = await entriesAPI.update(id, {
        progress: clampedProgress,
        status: clampedProgress === 100 ? 'completed' : 'pending',
      });
      return {
        id: response._id || response.id,
        day_id: '',
        title: response.content,
        progress: response.progress || 0,
        completed: response.status === 'completed',
        created_at: Math.floor(new Date(response.createdAt).getTime() / 1000),
        updated_at: Math.floor(new Date(response.updatedAt).getTime() / 1000),
      } as Task;
    } catch (error: any) {
      console.error("Update task progress error:", error);
      throw error;
    }
  }
}
