import React, { createContext, useContext, useState, useEffect, useRef, ReactNode, useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { AppState } from 'react-native';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { Session } from '@/types/entities';
import { Config } from '@/constants/config';

interface TimerContextType {
  activeSession: Session | null;
  isRunning: boolean;
  remainingSeconds: number;
  elapsedSeconds: number;
  startTimer: (session: Session) => void;
  stopTimer: () => void;
  completeTimer: () => Promise<void>;
  cancelTimer: () => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({ children }: { children: ReactNode }) {
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [startTimeMs, setStartTimeMs] = useState<number | null>(null);
  const [endTimeMs, setEndTimeMs] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const completionRef = useRef(false);

  const isRunning = activeSession !== null && remainingSeconds > 0;

  const syncFromClock = useCallback(() => {
    if (!activeSession || startTimeMs === null || endTimeMs === null) return;
    const now = Date.now();
    const totalSeconds = activeSession.duration_minutes * 60;
    const remaining = Math.max(0, Math.ceil((endTimeMs - now) / 1000));
    const elapsed = Math.min(
      totalSeconds,
      Math.max(0, Math.floor((now - startTimeMs) / 1000)),
    );

    setRemainingSeconds(remaining);
    setElapsedSeconds(elapsed);

    if (remaining === 0 && !completionRef.current) {
      completionRef.current = true;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [activeSession, startTimeMs, endTimeMs]);

  useEffect(() => {
    if (!isRunning || !activeSession || startTimeMs === null || endTimeMs === null) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    syncFromClock();
    intervalRef.current = setInterval(syncFromClock, Config.timerUpdateInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, activeSession, startTimeMs, endTimeMs, syncFromClock]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        syncFromClock();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [syncFromClock]);

  useEffect(() => {
    if (isRunning) {
      activateKeepAwakeAsync().catch(() => {});
    } else {
      deactivateKeepAwake();
    }

    return () => {
      if (isRunning) {
        deactivateKeepAwake();
      }
    };
  }, [isRunning]);

  const startTimer = (session: Session) => {
    const sessionStartMs = session.started_at ? session.started_at * 1000 : Date.now();
    const totalSeconds = session.duration_minutes * 60;
    const sessionEndMs = sessionStartMs + totalSeconds * 1000;

    completionRef.current = false;
    setActiveSession(session);
    setStartTimeMs(sessionStartMs);
    setEndTimeMs(sessionEndMs);
    setRemainingSeconds(totalSeconds);
    setElapsedSeconds(0);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setActiveSession(null);
    setRemainingSeconds(0);
    setElapsedSeconds(0);
    setStartTimeMs(null);
    setEndTimeMs(null);
    completionRef.current = false;
  };

  const completeTimer = async () => {
    // This will be handled by the timer screen component
    // which will call the session completion logic
    stopTimer();
  };

  const cancelTimer = () => {
    stopTimer();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  return (
    <TimerContext.Provider
      value={{
        activeSession,
        isRunning,
        remainingSeconds,
        elapsedSeconds,
        startTimer,
        stopTimer,
        completeTimer,
        cancelTimer,
      }}>
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
}
