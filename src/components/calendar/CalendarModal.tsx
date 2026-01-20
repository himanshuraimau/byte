import { Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { parseDateISO } from '@/utils/date';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { CalendarGrid } from './CalendarGrid';

const AnimatedView = Animated.createAnimatedComponent(View);

interface CalendarModalProps {
  visible: boolean;
  selectedDate: string;
  onClose: () => void;
  onDateSelect: (date: string) => void;
}

export function CalendarModal({ visible, selectedDate, onDateSelect, onClose }: CalendarModalProps) {
  const selectedDateObj = parseDateISO(selectedDate);
  const [currentYear, setCurrentYear] = useState(selectedDateObj.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(selectedDateObj.getMonth());
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      const dateObj = parseDateISO(selectedDate);
      setCurrentYear(dateObj.getFullYear());
      setCurrentMonth(dateObj.getMonth());
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      scale.value = withTiming(0.9, { duration: 200 });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible, selectedDate]);

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handleDateSelect = (date: string) => {
    onDateSelect(date);
    onClose();
  };

  const handleMonthChange = (year: number, month: number) => {
    setCurrentYear(year);
    setCurrentMonth(month);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <AnimatedView style={[styles.modal, modalStyle]}>
              <View style={styles.header}>
                <Text style={styles.title}>Select Date</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.content}>
                <CalendarGrid
                  year={currentYear}
                  month={currentMonth}
                  selectedDate={selectedDate}
                  onDateSelect={handleDateSelect}
                  onMonthChange={handleMonthChange}
                />
              </View>
            </AnimatedView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  modal: {
    backgroundColor: Colors.bg0,
    borderRadius: Radius.lg,
    width: '100%',
    maxWidth: 400,
    ...Shadows.z4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border0,
  },
  title: {
    ...Typography.h2,
    color: Colors.text0,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    ...Typography.h2,
    color: Colors.text2,
  },
  content: {
    padding: Spacing.xl,
  },
});
