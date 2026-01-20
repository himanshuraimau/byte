import { DayRepository } from "@/database/repositories/DayRepository";
import { NoteRepository } from "@/database/repositories/NoteRepository";
import { SessionRepository } from "@/database/repositories/SessionRepository";
import { TaskRepository } from "@/database/repositories/TaskRepository";
import { TimelineEntry } from "@/types/entities";

export class TimelineService {
  constructor(
    private dayRepo: DayRepository,
    private taskRepo: TaskRepository,
    private noteRepo: NoteRepository,
    private sessionRepo: SessionRepository,
  ) {}

  /**
   * Get all timeline entries for a specific date, sorted chronologically
   */
  async getTimelineEntries(
    date: string,
    userId: number,
  ): Promise<TimelineEntry[]> {
    // Get or create day
    const day = await this.dayRepo.createOrGet(date, userId);

    // Fetch all entries
    const [tasks, notes, sessions] = await Promise.all([
      this.taskRepo.findByDayId(day.id),
      this.noteRepo.findByDayId(day.id),
      this.sessionRepo.findByDayId(day.id),
    ]);

    // Combine and sort by creation time
    const entries: TimelineEntry[] = [
      ...tasks.map((task) => ({ type: "task" as const, data: task })),
      ...notes.map((note) => ({ type: "note" as const, data: note })),
      ...sessions.map((session) => ({
        type: "session" as const,
        data: session,
      })),
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
  async getEntriesCount(date: string, userId: number): Promise<number> {
    const day = await this.dayRepo.findByDate(date, userId);
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
  async hasEntries(date: string, userId: number): Promise<boolean> {
    const count = await this.getEntriesCount(date, userId);
    return count > 0;
  }
}
