import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { 
  useFonts,
  GeistMono_400Regular,
  GeistMono_500Medium,
  GeistMono_700Bold 
} from "@expo-google-fonts/geist-mono";
import * as SplashScreen from "expo-splash-screen";

import { DateProvider, useDate } from "@/context/DateContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { TimelineProvider } from "@/context/TimelineContext";
import { TimerProvider } from "@/context/TimerContext";
import { UserProvider, useUser } from "@/context/UserContext";
import { ReactNode } from "react";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "(tabs)",
};

function RootLayoutNav() {
  const { isDark } = useTheme();
  const { user, loading } = useUser();
  const segments = useSegments();
  const router = useRouter();

  const [fontsLoaded, fontError] = useFonts({
    GeistMono_400Regular,
    GeistMono_500Medium,
    GeistMono_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    if (loading || !fontsLoaded) return;

    const inAuthGroup = segments[0] === "login" || segments[0] === "register";

    if (!user && !inAuthGroup) {
      // Redirect to login if no user
      router.replace("/login");
    } else if (user && inAuthGroup) {
      // Redirect to tabs if user exists
      router.replace("/(tabs)");
    }
  }, [user, loading, segments, fontsLoaded]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <NavigationThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <DateProvider>
        <TimerProvider>
          <TimelineProviderWrapper>
            <Stack>
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="register" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="notes" options={{ headerShown: false }} />
              <Stack.Screen
                name="modal"
                options={{ presentation: "modal", title: "Modal" }}
              />
            </Stack>
            <StatusBar style={isDark ? "light" : "dark"} />
          </TimelineProviderWrapper>
        </TimerProvider>
      </DateProvider>
    </NavigationThemeProvider>
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
    <SafeAreaProvider>
      <ThemeProvider>
        <UserProvider>
          <RootLayoutNav />
        </UserProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
