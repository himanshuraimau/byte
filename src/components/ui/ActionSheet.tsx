import { Colors, Radius, Spacing, Typography } from "@/constants/theme";
import React, { useEffect } from "react";
import {
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";

const AnimatedView = Animated.createAnimatedComponent(View);

export interface ActionSheetOption {
  label: string;
  onPress: () => void;
  destructive?: boolean;
  icon?: string;
}

interface ActionSheetProps {
  visible: boolean;
  onClose: () => void;
  options: ActionSheetOption[];
  title?: string;
  message?: string;
}

export function ActionSheet({
  visible,
  onClose,
  options,
  title,
  message,
}: ActionSheetProps) {
  const translateY = useSharedValue(400);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 300,
      });
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      translateY.value = withTiming(400, { duration: 200 });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <AnimatedView style={[styles.backdrop, backdropStyle]}>
          <TouchableWithoutFeedback>
            <AnimatedView style={[styles.sheet, sheetStyle]}>
              {(title || message) && (
                <View style={styles.header}>
                  {title && <Text style={styles.title}>{title}</Text>}
                  {message && <Text style={styles.message}>{message}</Text>}
                </View>
              )}

              <View style={styles.options}>
                {options.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.option,
                      index === 0 && (title || message) && styles.firstOption,
                      index === options.length - 1 && styles.lastOption,
                    ]}
                    onPress={() => {
                      option.onPress();
                      onClose();
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        option.destructive && styles.destructiveText,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </AnimatedView>
          </TouchableWithoutFeedback>
        </AnimatedView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "transparent",
    paddingHorizontal: Spacing.base,
    paddingBottom: Platform.OS === "ios" ? Spacing["2xl"] : Spacing.lg,
  },
  header: {
    backgroundColor: Colors.bg0,
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border0,
  },
  title: {
    ...Typography.body,
    fontWeight: "600",
    color: Colors.text1,
    textAlign: "center",
  },
  message: {
    ...Typography.small,
    color: Colors.text2,
    textAlign: "center",
    marginTop: Spacing.xs,
  },
  options: {
    backgroundColor: Colors.bg0,
    borderRadius: Radius.lg,
    overflow: "hidden",
  },
  option: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border0,
    backgroundColor: Colors.bg0,
  },
  firstOption: {
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
  },
  lastOption: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: Radius.lg,
    borderBottomRightRadius: Radius.lg,
  },
  optionText: {
    ...Typography.body,
    fontSize: 18,
    color: Colors.accent0,
    fontWeight: "400",
  },
  destructiveText: {
    color: Colors.destructive,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: Colors.bg0,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    alignItems: "center",
    marginTop: Spacing.base,
  },
  cancelText: {
    ...Typography.body,
    fontSize: 18,
    color: Colors.accent0,
    fontWeight: "600",
  },
});
