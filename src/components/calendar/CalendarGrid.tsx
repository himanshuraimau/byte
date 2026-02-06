import { useUser } from "@/context/UserContext";
import { useTheme } from "@/context/ThemeContext";
import { DayRepository } from "@/database/repositories";
import { formatDateISO, getTodayISO, parseDateISO } from "@/utils/date";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CalendarDay } from "./CalendarDay";

interface CalendarGridProps {
  year: number;
  month: number; // 0-11
  selectedDate: string;
  onDateSelect: (date: string) => void;
  onMonthChange?: (year: number, month: number) => void;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAY_NAMES = ["S", "M", "T", "W", "T", "F", "S"];

export function CalendarGrid({
  year,
  month,
  selectedDate,
  onDateSelect,
  onMonthChange,
}: CalendarGridProps) {
  const { colors } = useTheme();
  const { user } = useUser();
  const [daysWithEntries, setDaysWithEntries] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    loadDaysWithEntries(year, month);
  }, [year, month, user]);

  const loadDaysWithEntries = async (y: number, m: number) => {
    if (!user) return;

    try {
      const dayRepo = new DayRepository();

      const days = await dayRepo.findAllWithEntries(user.id);
      const set = new Set<string>();

      if (days && Array.isArray(days)) {
        days.forEach((day) => {
          if (day && day.date) {
            const dayDate = parseDateISO(day.date);
            if (dayDate.getFullYear() === y && dayDate.getMonth() === m) {
              set.add(day.date);
            }
          }
        });
      }

      setDaysWithEntries(set);
    } catch (error) {
      console.error("Failed to load days with entries:", error);
      setDaysWithEntries(new Set());
    }
  };

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstDayOfWeek = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  const todayISO = getTodayISO();

  const days: (Date | null)[] = [];

  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(null);
  }

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
        <TouchableOpacity
          onPress={goToPreviousMonth}
          style={[styles.navButton, styles.navButtonLeft]}
        >
          <Text style={[styles.navText, { color: colors.text0 }]}>‹</Text>
        </TouchableOpacity>
        <Text style={[styles.monthYear, { color: colors.text0 }]}>
          {MONTH_NAMES[month]} {year}
        </Text>
        <TouchableOpacity
          onPress={goToNextMonth}
          style={[styles.navButton, styles.navButtonRight]}
        >
          <Text style={[styles.navText, { color: colors.text0 }]}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dayNames}>
        {DAY_NAMES.map((day, index) => (
          <View key={index} style={styles.dayNameCell}>
            <Text style={[styles.dayName, { color: colors.text2 }]}>
              {day}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.grid}>
        {days.map((date, index) => {
          if (date === null) {
            return <View key={index} style={styles.emptyDay} />;
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
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    position: "relative",
    height: 32,
  },
  navButton: {
    position: "absolute",
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  navButtonLeft: {
    left: 0,
  },
  navButtonRight: {
    right: 0,
  },
  navText: {
    fontSize: 18,
    fontWeight: "400",
  },
  monthYear: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "System",
  },
  dayNames: {
    flexDirection: "row",
    marginBottom: 12,
  },
  dayNameCell: {
    flex: 1,
    alignItems: "center",
  },
  dayName: {
    fontSize: 12,
    fontWeight: "400",
    textTransform: "uppercase",
    fontFamily: "System",
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  emptyDay: {
    width: `${100 / 7 - (8 * 6) / 7 / 100}%`,
    aspectRatio: 1,
  },
});
