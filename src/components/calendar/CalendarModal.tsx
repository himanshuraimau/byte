import { parseDateISO } from "@/utils/date";
import React, { useEffect, useState } from "react";
import {
    Modal,
    StyleSheet,
    TouchableWithoutFeedback,
    View
} from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import { CalendarGrid } from "./CalendarGrid";

const AnimatedView = Animated.createAnimatedComponent(View);

interface CalendarModalProps {
  visible: boolean;
  selectedDate: string;
  onClose: () => void;
  onDateSelect: (date: string) => void;
}

export function CalendarModal({
  visible,
  selectedDate,
  onDateSelect,
  onClose,
}: CalendarModalProps) {
  const selectedDateObj = parseDateISO(selectedDate);
  const [currentYear, setCurrentYear] = useState(selectedDateObj.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(selectedDateObj.getMonth());
  const scale = useSharedValue(0.95);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      const dateObj = parseDateISO(selectedDate);
      setCurrentYear(dateObj.getFullYear());
      setCurrentMonth(dateObj.getMonth());
      scale.value = withSpring(1, { damping: 20, stiffness: 300 });
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      scale.value = withTiming(0.95, { duration: 150 });
      opacity.value = withTiming(0, { duration: 150 });
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
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <AnimatedView style={[styles.modal, modalStyle]}>
              <CalendarGrid
                year={currentYear}
                month={currentMonth}
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                onMonthChange={handleMonthChange}
              />
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    width: "100%",
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
});
