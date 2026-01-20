import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { DateProvider, useDate } from "@/context/DateContext";
import { TimelineProvider } from "@/context/TimelineContext";
import { TimerProvider } from "@/context/TimerContext";
import { UserProvider, useUser } from "@/context/UserContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ReactNode } from "react";

export const unstable_settings = {
  anchor: "(tabs)",
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { user, loading } = useUser();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "login" || segments[0] === "register";

    if (!user && !inAuthGroup) {
      // Redirect to login if no user
      router.replace("/login");
    } else if (user && inAuthGroup) {
      // Redirect to tabs if user exists
      router.replace("/(tabs)");
    }
  }, [user, loading, segments]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <DateProvider>
        <TimerProvider>
          <TimelineProviderWrapper>
            <Stack>
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="register" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="modal"
                options={{ presentation: "modal", title: "Modal" }}
              />
            </Stack>
            <StatusBar style="auto" />
          </TimelineProviderWrapper>
        </TimerProvider>
      </DateProvider>
    </ThemeProvider>
  );
}

function TimelineProviderWrapper({ children }: { children: ReactNode }) {
  const { selectedDate } = useDate();
  return (
    <TimelineProvider selectedDate={selectedDate}>{children}</TimelineProvider>
  );
}

export default function RootLayout() {
  return (
    <UserProvider>
      <RootLayoutNav />
    </UserProvider>
  );
}
