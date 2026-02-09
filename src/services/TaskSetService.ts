import { apiClient } from './ApiClient';

export interface TaskSet {
  _id: string;
  userId: string;
  name: string;
  periodType: 'week' | 'month';
  tasks: string[];
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface DailyState {
  _id: string;
  taskSetId: string;
  userId: string;
  date: string;
  completions: Record<string, boolean>;
  createdAt: string;
}

export class TaskSetService {
  /**
   * Get all TaskSets for the current user
   */
  async getTaskSets(): Promise<TaskSet[]> {
    const response = await apiClient.get('/tasksets');
    
    if (!response.ok) {
      throw new Error('Failed to fetch TaskSets');
    }

    return await response.json();
  }

  /**
   * Get a single TaskSet by ID
   */
  async getTaskSet(id: string): Promise<TaskSet> {
    const response = await apiClient.get(`/tasksets/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch TaskSet');
    }

    return await response.json();
  }

  /**
   * Create a new TaskSet
   */
  async createTaskSet(data: {
    name: string;
    periodType: 'week' | 'month';
    tasks: string[];
  }): Promise<TaskSet> {
    const response = await apiClient.post('/tasksets', data);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create TaskSet');
    }

    return await response.json();
  }

  /**
   * Update an existing TaskSet
   */
  async updateTaskSet(
    id: string,
    data: {
      name?: string;
      periodType?: 'week' | 'month';
      tasks?: string[];
    }
  ): Promise<TaskSet> {
    const response = await apiClient.patch(`/tasksets/${id}`, data);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update TaskSet');
    }

    return await response.json();
  }

  /**
   * Delete a TaskSet
   */
  async deleteTaskSet(id: string): Promise<void> {
    const response = await apiClient.post(`/tasksets/${id}/delete`, {});
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete TaskSet');
    }
  }

  /**
   * Get daily state for a TaskSet and date
   */
  async getDailyState(taskSetId: string, date: string): Promise<DailyState | null> {
    const response = await apiClient.get(`/daily-state/${taskSetId}/${date}`);
    
    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error('Failed to fetch daily state');
    }

    return await response.json();
  }

  /**
   * Update daily state (toggle task completion)
   */
  async updateDailyState(
    taskSetId: string,
    date: string,
    task: string,
    completed: boolean
  ): Promise<DailyState> {
    const response = await apiClient.post(`/daily-state/${taskSetId}/${date}`, {
      task,
      completed,
    });
    
    if (!response.ok) {
      throw new Error('Failed to update daily state');
    }

    return await response.json();
  }

  /**
   * Get streak for a TaskSet
   */
  async getStreak(taskSetId: string): Promise<number> {
    const response = await apiClient.get(`/daily-state/streak/${taskSetId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch streak');
    }

    const data = await response.json();
    return data.streak || 0;
  }
}

export const taskSetService = new TaskSetService();
