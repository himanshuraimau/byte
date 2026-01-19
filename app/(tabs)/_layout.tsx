import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/ui/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.accent0,
        tabBarInactiveTintColor: Colors.text2,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Timeline',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="timer"
        options={{
          title: 'Timer',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="clock" color={color} />,
        }}
      />
    </Tabs>
  );
}
