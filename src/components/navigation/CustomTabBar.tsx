import { Spacing } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import React from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ICON_SIZE = 28;

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { isDark, colors } = useTheme();

  return (
    <BlurView
      intensity={80}
      tint={isDark ? "dark" : "light"}
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom,
          height: 60 + insets.bottom,
          backgroundColor: isDark
            ? Platform.OS === "ios"
              ? "rgba(26, 26, 26, 0.7)"
              : "rgba(26, 26, 26, 0.95)"
            : Platform.OS === "ios"
              ? "rgba(255, 255, 255, 0.7)"
              : "rgba(255, 255, 255, 0.95)",
          borderTopColor: isDark
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.1)",
        },
      ]}
    >
      <View style={styles.tabsContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          // Get icon from options
          const IconComponent = options.tabBarIcon;

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tab}
            >
              {IconComponent && (
                <View style={styles.iconContainer}>
                  {IconComponent({
                    focused: isFocused,
                    color: isFocused ? colors.accent0 : colors.text2,
                    size: ICON_SIZE,
                  })}
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    overflow: "hidden",
  },
  tabsContainer: {
    flexDirection: "row",
    height: 60,
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: Spacing.lg,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});
