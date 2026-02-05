import { useDate } from "@/context/DateContext";
import { useTimeline } from "@/context/TimelineContext";
import { useUser } from "@/context/UserContext";
import { DayRepository, SessionRepository } from "@/database/repositories";
import { Session } from "@/types/entities";
import { useState } from "react";

export function useSession() {
  const { user } = useUser();
  const { selectedDate } = useDate();
  const { refreshTimeline } = useTimeline();
  const [loading, setLoading] = useState(false);

  const createSession = async (
    name: string,
    durationMinutes: number,
    startedAt: number,
    taskId?: string | null
  ): Promise<Session> => {
    if (!user) throw new Error("User not authenticated");
    
    try {
      setLoading(true);
      const dayRepo = new DayRepository();
      const sessionRepo = new SessionRepository();
      
      // Get or create day
      const day = await dayRepo.getOrCreate(user.id, selectedDate);
      
      // Create session
      const session = await sessionRepo.create(day.id, name, durationMinutes, taskId || undefined);
      
      // Refresh timeline
      await refreshTimeline(selectedDate);
      
      return session;
    } catch (error) {
      console.error("Failed to create session:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const completeSession = async (sessionId: string, endedAt: number) => {
    try {
      setLoading(true);
      const sessionRepo = new SessionRepository();
      
      await sessionRepo.complete(sessionId);
      await refreshTimeline(selectedDate);
    } catch (error) {
      console.error("Failed to complete session:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      setLoading(true);
      const sessionRepo = new SessionRepository();
      
      await sessionRepo.delete(sessionId);
      await refreshTimeline(selectedDate);
    } catch (error) {
      console.error("Failed to delete session:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createSession,
    completeSession,
    deleteSession,
    loading,
  };
}
