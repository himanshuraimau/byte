import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing } from '@/constants/theme';
import { CalendarDay } from './CalendarDay';
import { formatDateISO, getTodayISO, parseDateISO } from '@/utils/date';
import * as SQLite from 'expo-sqlite';
import { initDatabase } from '@/database/db';
import { DayRepository } from '@/database/repositories';

interface CalendarGridProps {
  year: number;
  month: number; // 0-11
  selectedDate: string;
  onDateSelect: (date: string) => void;
  onMonthChange?: (year: number, month: number) => void;
}

const MONTH_NAMES = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
];

const DAY_NAMES = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function CalendarGrid({ year, month, selectedDate, onDateSelect, onMonthChange }: CalendarGridProps) {
  const [daysWithEntries, setDaysWithEntries] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadDaysWithEntries(year, month);
  }, [year, month]);

  const loadDaysWithEntries = async (y: number, m: number) => {
    try {
      const db = await initDatabase();
      const dayRepo = new DayRepository(db);
      
      // Get all days with entries for this month
      const days = await dayRepo.findAllWithEntries();
      const set = new Set<string>();
      
      days.forEach((day) => {
        const dayDate = parseDateISO(day.date);
        if (dayDate.getFullYear() === y && dayDate.getMonth() === m) {
          set.add(day.date);
        }
      });
      
      setDaysWithEntries(set);
    } catch (error) {
      console.error('Failed to load days with entries:', error);
    }
  };

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstDayOfWeek = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  const todayISO = getTodayISO();

  const days: (Date | null)[] = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(null);
  }
  
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day));
  }

  const handleDatePress = (date: Date) => {
    const dateISO = formatDateISO(date);
    onDateSelect(dateISO);
  };

  const goToPreviousMonth = () => {
    if (onMonthChange) {
      const newDate = new Date(year, month - 1, 1);
      onMonthChange(newDate.getFullYear(), newDate.getMonth());
    }
  };

  const goToNextMonth = () => {
    if (onMonthChange) {
      const newDate = new Date(year, month + 1, 1);
      onMonthChange(newDate.getFullYear(), newDate.getMonth());
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goToPreviousMonth} style={styles.navButton}>
          <Text style={styles.navText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.monthYear}>
          {MONTH_NAMES[month]} {year}
        </Text>
        <TouchableOpacity onPress={goToNextMonth} style={styles.navButton}>
          <Text style={styles.navText}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dayNames}>
        {DAY_NAMES.map((day, index) => (
          <Text key={index} style={styles.dayName}>
            {day}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {days.map((date, index) => {
          if (date === null) {
            return <View key={index} style={styles.day} />;
          }

          const dateISO = formatDateISO(date);
          const isToday = dateISO === todayISO;
          const isSelected = dateISO === selectedDate;
          const hasEntries = daysWithEntries.has(dateISO);

          return (
            <CalendarDay
              key={index}
              date={date}
              isToday={isToday}
              isSelected={isSelected}
              hasEntries={hasEntries}
              onPress={() => handleDatePress(date)}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.base,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.base,
  },
  navButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    ...Typography.h2,
    color: Colors.text0,
  },
  monthYear: {
    ...Typography.h2,
    color: Colors.text0,
  },
  dayNames: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.sm,
  },
  dayName: {
    ...Typography.monoXs,
    color: Colors.text2,
    width: 40,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  day: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
