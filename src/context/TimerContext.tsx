import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import * as Haptics from 'expo-haptics';
import { Session } from '@/types/entities';
import { useDate } from './DateContext';

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
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { selectedDate } = useDate();

  useEffect(() => {
    if (activeSession && remainingSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          const newValue = prev - 1;
          if (newValue <= 0) {
            // Timer completed
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            return 0;
          }
          return newValue;
        });
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [activeSession, remainingSeconds]);

  const startTimer = (session: Session) => {
    setActiveSession(session);
    setRemainingSeconds(session.duration_minutes * 60);
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
        isRunning: activeSession !== null && remainingSeconds > 0,
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
