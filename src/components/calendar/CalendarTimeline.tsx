import { useUser } from "@/context/UserContext";
import { DayRepository } from "@/database/repositories";
import { formatDateISO, getTodayISO, parseDateISO } from "@/utils/date";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import { TimelineDay } from "./TimelineDay";

interface CalendarTimelineProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

const DAY_WIDTH = 80;
const DAYS_TO_SHOW = 60; // 30 past, today, 29 future
const SCREEN_WIDTH = Dimensions.get("window").width;

export function CalendarTimeline({
  selectedDate,
  onDateSelect,
}: CalendarTimelineProps) {
  const { user } = useUser();
  const scrollViewRef = useRef<ScrollView>(null);
  const [daysWithEntries, setDaysWithEntries] = useState<Set<string>>(
    new Set(),
  );
  const todayISO = getTodayISO();

  // Generate array of dates (30 days before today, today, 29 days after)
  const generateDates = (): Date[] => {
    const dates: Date[] = [];
    const today = parseDateISO(todayISO);

    for (let i = -30; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }

    return dates;
  };

  const dates = generateDates();

  useEffect(() => {
    loadDaysWithEntries();
  }, [user]);

  useEffect(() => {
    // Scroll to today on mount
    const todayIndex = dates.findIndex(
      (date) => formatDateISO(date) === todayISO,
    );
    if (todayIndex !== -1 && scrollViewRef.current) {
      // Center today in the viewport
      const scrollPosition =
        todayIndex * DAY_WIDTH - SCREEN_WIDTH / 2 + DAY_WIDTH / 2;
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ x: scrollPosition, animated: false });
      }, 100);
    }
  }, []);

  const loadDaysWithEntries = async () => {
    if (!user) return;

    try {
      const dayRepo = new DayRepository();
      const days = await dayRepo.findAllWithEntries(user.id);
      const set = new Set<string>();
      days.forEach((day) => set.add(day.date));
      setDaysWithEntries(set);
    } catch (error) {
      console.error("Failed to load days with entries:", error);
    }
  };

  const handleDatePress = (date: Date) => {
    const dateISO = formatDateISO(date);
    onDateSelect(dateISO);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={DAY_WIDTH}
        decelerationRate="fast"
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {dates.map((date, index) => {
          const dateISO = formatDateISO(date);
          const isToday = dateISO === todayISO;
          const isSelected = dateISO === selectedDate;
          const hasEntries = daysWithEntries.has(dateISO);

          // Show month label on first day of month or first item
          const showMonthLabel = index === 0 || date.getDate() === 1;

          return (
            <TimelineDay
              key={dateISO}
              date={date}
              isToday={isToday}
              isSelected={isSelected}
              hasEntries={hasEntries}
              onPress={() => handleDatePress(date)}
              showMonthLabel={showMonthLabel}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 120,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SCREEN_WIDTH / 2 - DAY_WIDTH / 2,
    alignItems: "center",
  },
});
