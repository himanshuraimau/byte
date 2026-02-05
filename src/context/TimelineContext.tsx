import {
    DayRepository,
    NoteRepository,
    SessionRepository,
    TaskRepository,
} from "@/database/repositories";
import { TimelineService } from "@/services/TimelineService";
import { TimelineEntry } from "@/types/entities";
import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { useUser } from "./UserContext";

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
  const { user } = useUser();
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [entriesCount, setEntriesCount] = useState(0);

  // Initialize services
  const dayRepo = new DayRepository();
  const taskRepo = new TaskRepository();
  const noteRepo = new NoteRepository();
  const sessionRepo = new SessionRepository();
  const timelineService = new TimelineService(
    dayRepo,
    taskRepo,
    noteRepo,
    sessionRepo,
  );

  // Refresh timeline when date changes
  useEffect(() => {
    if (user) {
      refreshTimeline(selectedDate).catch((err) => {
        console.error("Failed to refresh timeline in useEffect:", err);
      });
    } else {
      setLoading(false);
    }
  }, [selectedDate, user]);

  const refreshTimeline = async (date: string) => {
    if (!user) {
      console.log("User not ready yet");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [timelineEntries, count] = await Promise.all([
        timelineService.getTimelineEntries(date, user.id),
        timelineService.getEntriesCount(date, user.id),
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
