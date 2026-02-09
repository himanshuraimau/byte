import { useDate } from "@/context/DateContext";
import { useTimeline } from "@/context/TimelineContext";
import { useUser } from "@/context/UserContext";
import { apiClient } from "@/services/ApiClient";
import { Session } from "@/types/entities";
import { useState } from "react";

export function useSession() {
  const { user } = useUser();
  const { selectedDate } = useDate();
  const { refreshTimeline } = useTimeline();
  const [loading, setLoading] = useState(false);

  const createSession = async (data: {
    name: string;
    duration_minutes: number;
    task_id?: string | null;
    started_at: number; // Unix seconds
    ended_at?: number;  // Unix seconds (optional; default planned end)
  }): Promise<Session> => {
    if (!user) throw new Error("User not authenticated");

    const startedAtSec = data.started_at;
    const endedAtSec = data.ended_at ?? startedAtSec + data.duration_minutes * 60;

    try {
      setLoading(true);

      const response = await apiClient.post('/entries', {
        type: 'SESSION',
        date: selectedDate,
        content: data.name,
        duration: data.duration_minutes,
        linkedTaskId: data.task_id ?? undefined,
        startedAt: new Date(startedAtSec * 1000),
        endedAt: new Date(endedAtSec * 1000),
        status: 'IN_PROGRESS',
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error((errBody as { error?: string }).error ?? 'Failed to create session');
      }

      const entry = await response.json();
      await refreshTimeline(selectedDate);

      const session: Session = {
        id: entry._id,
        day_id: entry.date,
        task_id: entry.linkedTaskId ?? null,
        name: entry.content,
        duration_minutes: entry.duration,
        started_at: startedAtSec,
        ended_at: entry.endedAt ? Math.floor(new Date(entry.endedAt).getTime() / 1000) : null,
        completed: entry.status === 'COMPLETE',
        created_at: entry.createdAt ? Math.floor(new Date(entry.createdAt).getTime() / 1000) : Math.floor(Date.now() / 1000),
      };
      return session;
    } catch (error) {
      console.error("Failed to create session:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const completeSession = async (entryId: string, endedAtMs: number) => {
    if (!user) throw new Error("User not authenticated");
    try {
      setLoading(true);
      const response = await apiClient.patch(`/entries/${entryId}`, {
        endedAt: new Date(endedAtMs),
        status: 'COMPLETE',
      });
      if (!response.ok) {
        throw new Error('Failed to complete session');
      }
      await refreshTimeline(selectedDate);
    } catch (error) {
      console.error("Failed to complete session:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createSession,
    completeSession,
    loading,
  };
}