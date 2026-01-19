import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TemporalMode } from '@/types/entities';
import { DateService } from '@/services/DateService';
import { getTodayISO } from '@/utils/date';

interface DateContextType {
  selectedDate: string;
  temporalMode: TemporalMode;
  setTemporalMode: (mode: TemporalMode) => void;
  setSelectedDate: (date: string) => void;
  goToToday: () => void;
  goToYesterday: () => void;
  goToTomorrow: () => void;
}

const DateContext = createContext<DateContextType | undefined>(undefined);

export function DateProvider({ children }: { children: ReactNode }) {
  const [selectedDate, setSelectedDateState] = useState<string>(getTodayISO());
  const [temporalMode, setTemporalModeState] = useState<TemporalMode>('today');

  const setTemporalMode = (mode: TemporalMode) => {
    setTemporalModeState(mode);
    const date = DateService.getDateForMode(mode);
    setSelectedDateState(date);
  };

  const setSelectedDate = (date: string) => {
    setSelectedDateState(date);
    const mode = DateService.getModeForDate(date);
    setTemporalModeState(mode);
  };

  const goToToday = () => {
    setTemporalMode('today');
  };

  const goToYesterday = () => {
    setTemporalMode('yesterday');
  };

  const goToTomorrow = () => {
    setTemporalMode('tomorrow');
  };

  return (
    <DateContext.Provider
      value={{
        selectedDate,
        temporalMode,
        setTemporalMode,
        setSelectedDate,
        goToToday,
        goToYesterday,
        goToTomorrow,
      }}>
      {children}
    </DateContext.Provider>
  );
}

export function useDate() {
  const context = useContext(DateContext);
  if (context === undefined) {
    throw new Error('useDate must be used within a DateProvider');
  }
  return context;
}
