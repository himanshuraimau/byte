import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

import { CustomTabBar } from "@/components/navigation/CustomTabBar";
import { HapticTab } from "@/components/ui/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useTheme } from "@/context/ThemeContext";
import { useTimer } from "@/context/TimerContext";

export default function TabLayout() {
  const { isRunning } = useTimer();
  const { colors } = useTheme();

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: colors.accent0,
        tabBarInactiveTintColor: colors.text2,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Timeline",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="timer"
        options={{
          title: "Timer",
          tabBarIcon: ({ color }) => (
            <View>
              <IconSymbol size={28} name="clock" color={color} />
              {isRunning && (
                <View
                  style={[styles.badge, { backgroundColor: colors.accent0 }]}
                />
              )}
            </View>
          ),
          tabBarBadge: isRunning ? "" : undefined,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="doc.text" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
