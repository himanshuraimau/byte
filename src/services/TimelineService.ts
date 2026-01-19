import { TimelineEntry, Task, Note, Session } from '@/types/entities';
import { DayRepository } from '@/database/repositories/DayRepository';
import { TaskRepository } from '@/database/repositories/TaskRepository';
import { NoteRepository } from '@/database/repositories/NoteRepository';
import { SessionRepository } from '@/database/repositories/SessionRepository';

export class TimelineService {
  constructor(
    private dayRepo: DayRepository,
    private taskRepo: TaskRepository,
    private noteRepo: NoteRepository,
    private sessionRepo: SessionRepository
  ) {}

  /**
   * Get all timeline entries for a specific date, sorted chronologically
   */
  async getTimelineEntries(date: string): Promise<TimelineEntry[]> {
    // Get or create day
    const day = await this.dayRepo.createOrGet(date);

    // Fetch all entries
    const [tasks, notes, sessions] = await Promise.all([
      this.taskRepo.findByDayId(day.id),
      this.noteRepo.findByDayId(day.id),
      this.sessionRepo.findByDayId(day.id),
    ]);

    // Combine and sort by creation time
    const entries: TimelineEntry[] = [
      ...tasks.map((task) => ({ type: 'task' as const, data: task })),
      ...notes.map((note) => ({ type: 'note' as const, data: note })),
      ...sessions.map((session) => ({ type: 'session' as const, data: session })),
    ];

    // Sort by created_at timestamp
    entries.sort((a, b) => {
      const timeA = a.data.created_at;
      const timeB = b.data.created_at;
      return timeA - timeB;
    });

    return entries;
  }

  /**
   * Get entries count for a date
   */
  async getEntriesCount(date: string): Promise<number> {
    const day = await this.dayRepo.findByDate(date);
    if (!day) {
      return 0;
    }

    const [tasks, notes, sessions] = await Promise.all([
      this.taskRepo.findByDayId(day.id),
      this.noteRepo.findByDayId(day.id),
      this.sessionRepo.findByDayId(day.id),
    ]);

    return tasks.length + notes.length + sessions.length;
  }

  /**
   * Check if a date has any entries
   */
  async hasEntries(date: string): Promise<boolean> {
    const count = await this.getEntriesCount(date);
    return count > 0;
  }
}
