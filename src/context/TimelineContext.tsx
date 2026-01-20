import { initDatabase } from "@/database/db";
import {
    DayRepository,
    NoteRepository,
    SessionRepository,
    TaskRepository,
} from "@/database/repositories";
import { TimelineService } from "@/services/TimelineService";
import { TimelineEntry } from "@/types/entities";
import * as SQLite from "expo-sqlite";
import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

interface TimelineContextType {
  entries: TimelineEntry[];
  loading: boolean;
  error: Error | null;
  entriesCount: number;
  refreshTimeline: (date: string) => Promise<void>;
}

const TimelineContext = createContext<TimelineContextType | undefined>(
  undefined,
);

interface TimelineProviderProps {
  children: ReactNode;
  selectedDate: string;
}

export function TimelineProvider({
  children,
  selectedDate,
}: TimelineProviderProps) {
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [entriesCount, setEntriesCount] = useState(0);
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
  const [timelineService, setTimelineService] =
    useState<TimelineService | null>(null);

  // Initialize database and services
  useEffect(() => {
    async function init() {
      try {
        const database = await initDatabase();
        setDb(database);

        const dayRepo = new DayRepository(database);
        const taskRepo = new TaskRepository(database);
        const noteRepo = new NoteRepository(database);
        const sessionRepo = new SessionRepository(database);

        const service = new TimelineService(
          dayRepo,
          taskRepo,
          noteRepo,
          sessionRepo,
        );
        setTimelineService(service);
      } catch (err) {
        setError(err as Error);
        console.error("Failed to initialize timeline:", err);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  // Refresh timeline when date changes or timelineService becomes available
  useEffect(() => {
    if (timelineService) {
      refreshTimeline(selectedDate).catch((err) => {
        console.error("Failed to refresh timeline in useEffect:", err);
      });
    }
  }, [selectedDate, timelineService]);

  const refreshTimeline = async (date: string) => {
    if (!timelineService || !db) {
      console.log("Timeline service or database not ready yet");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [timelineEntries, count] = await Promise.all([
        timelineService.getTimelineEntries(date),
        timelineService.getEntriesCount(date),
      ]);

      setEntries(timelineEntries);
      setEntriesCount(count);
    } catch (err) {
      setError(err as Error);
      console.error("Failed to refresh timeline:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TimelineContext.Provider
      value={{
        entries,
        loading,
        error,
        entriesCount,
        refreshTimeline,
      }}
    >
      {children}
    </TimelineContext.Provider>
  );
}

export function useTimeline() {
  const context = useContext(TimelineContext);
  if (context === undefined) {
    throw new Error("useTimeline must be used within a TimelineProvider");
  }
  return context;
}
