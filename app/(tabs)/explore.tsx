import { IconSymbol } from "@/components/ui/icon-symbol";
import { ThemedView } from "@/components/ui/themed-view";
import { Radius, Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { useRouter } from "expo-router";
import React from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function ExploreScreen() {
  const { user, logout } = useUser();
  const { isDark, colors, toggleTheme } = useTheme();
  const router = useRouter();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: Spacing.xl,
      paddingBottom: Spacing["3xl"],
    },
    header: {
      alignItems: "center",
      marginTop: Spacing["2xl"],
      marginBottom: Spacing["2xl"],
    },
    avatarContainer: {
      marginBottom: Spacing.base,
    },
    name: {
      ...Typography.h1,
      color: colors.text0,
      marginBottom: Spacing.xs,
    },
    subtitle: {
      ...Typography.small,
      color: colors.text2,
    },
    statsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: Spacing.base,
      marginBottom: Spacing["2xl"],
    },
    statCard: {
      flex: 1,
      minWidth: "45%",
      backgroundColor: colors.bg0,
      borderRadius: Radius.md,
      padding: Spacing.lg,
      alignItems: "center",
      gap: Spacing.sm,
      borderWidth: 1,
      borderColor: colors.border0,
    },
    statValue: {
      ...Typography.h1,
      color: colors.text0,
    },
    statLabel: {
      ...Typography.monoSm,
      color: colors.text2,
      textTransform: "uppercase",
    },
    infoSection: {
      marginBottom: Spacing.xl,
    },
    sectionTitle: {
      ...Typography.monoSm,
      color: colors.text1,
      marginBottom: Spacing.base,
      textTransform: "uppercase",
    },
    infoCard: {
      backgroundColor: colors.bg0,
      borderRadius: Radius.md,
      padding: Spacing.lg,
      borderWidth: 1,
      borderColor: colors.border0,
    },
    infoText: {
      ...Typography.body,
      color: colors.text1,
      lineHeight: 24,
    },
    settingsCard: {
      backgroundColor: colors.bg0,
      borderRadius: Radius.md,
      borderWidth: 1,
      borderColor: colors.border0,
      overflow: "hidden",
    },
    settingItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: Spacing.lg,
      gap: Spacing.base,
      borderBottomWidth: 1,
      borderBottomColor: colors.border0,
    },
    settingItemLast: {
      borderBottomWidth: 0,
    },
    settingText: {
      ...Typography.body,
      color: colors.text1,
      flex: 1,
    },
    settingRight: {
      marginLeft: "auto",
    },
    dangerText: {
      color: colors.destructive,
    },
  });

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          logout();
          router.replace("/login");
        },
      },
    ]);
  };

  // Mock profile data - in a real app, this would come from a database or context
  const profileData = {
    name: user?.name || "User",
    totalSessions: 0,
    totalTasks: 0,
    totalNotes: 0,
    streak: 0,
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.bg1 }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <IconSymbol
              name="person.circle.fill"
              size={80}
              color={colors.accent0}
            />
          </View>
          <Text style={[styles.name, { color: colors.text0 }]}>
            {profileData.name}
          </Text>
          <Text style={[styles.subtitle, { color: colors.text2 }]}>
            Byte User
          </Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View
            style={[
              styles.statCard,
              { backgroundColor: colors.bg0, borderColor: colors.border0 },
            ]}
          >
            <IconSymbol name="clock.fill" size={32} color={colors.accent0} />
            <Text style={[styles.statValue, { color: colors.text0 }]}>
              {profileData.totalSessions}
            </Text>
            <Text style={[styles.statLabel, { color: colors.text2 }]}>
              Sessions
            </Text>
          </View>

          <View
            style={[
              styles.statCard,
              { backgroundColor: colors.bg0, borderColor: colors.border0 },
            ]}
          >
            <IconSymbol
              name="checkmark.circle.fill"
              size={32}
              color={colors.accent0}
            />
            <Text style={[styles.statValue, { color: colors.text0 }]}>
              {profileData.totalTasks}
            </Text>
            <Text style={[styles.statLabel, { color: colors.text2 }]}>
              Tasks
            </Text>
          </View>

          <View
            style={[
              styles.statCard,
              { backgroundColor: colors.bg0, borderColor: colors.border0 },
            ]}
          >
            <IconSymbol name="note.text" size={32} color={colors.accent0} />
            <Text style={[styles.statValue, { color: colors.text0 }]}>
              {profileData.totalNotes}
            </Text>
            <Text style={[styles.statLabel, { color: colors.text2 }]}>
              Notes
            </Text>
          </View>

          <View
            style={[
              styles.statCard,
              { backgroundColor: colors.bg0, borderColor: colors.border0 },
            ]}
          >
            <IconSymbol name="flame.fill" size={32} color={colors.accent0} />
            <Text style={[styles.statValue, { color: colors.text0 }]}>
              {profileData.streak}
            </Text>
            <Text style={[styles.statLabel, { color: colors.text2 }]}>
              Day Streak
            </Text>
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={[styles.sectionTitle, { color: colors.text1 }]}>
            ABOUT
          </Text>
          <View
            style={[
              styles.infoCard,
              { backgroundColor: colors.bg0, borderColor: colors.border0 },
            ]}
          >
            <Text style={[styles.infoText, { color: colors.text1 }]}>
              Track your productivity with Byte. Create tasks, take notes, and
              run focused sessions to achieve your goals.
            </Text>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.infoSection}>
          <Text style={[styles.sectionTitle, { color: colors.text1 }]}>
            SETTINGS
          </Text>
          <View
            style={[
              styles.settingsCard,
              { backgroundColor: colors.bg0, borderColor: colors.border0 },
            ]}
          >
            <View
              style={[
                styles.settingItem,
                { borderBottomColor: colors.border0 },
              ]}
            >
              <IconSymbol name="bell.fill" size={20} color={colors.text1} />
              <Text style={[styles.settingText, { color: colors.text1 }]}>
                Notifications
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.settingItem,
                { borderBottomColor: colors.border0 },
              ]}
              onPress={toggleTheme}
              activeOpacity={0.7}
            >
              <IconSymbol name="moon.fill" size={20} color={colors.text1} />
              <Text style={[styles.settingText, { color: colors.text1 }]}>
                Dark Mode
              </Text>
              <View style={styles.settingRight}>
                <Switch
                  value={isDark}
                  onValueChange={toggleTheme}
                  trackColor={{ false: colors.border1, true: colors.accent0 }}
                  thumbColor={colors.bg0}
                />
              </View>
            </TouchableOpacity>
            <View
              style={[
                styles.settingItem,
                { borderBottomColor: colors.border0 },
              ]}
            >
              <IconSymbol
                name="info.circle.fill"
                size={20}
                color={colors.text1}
              />
              <Text style={[styles.settingText, { color: colors.text1 }]}>
                About
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.settingItem, styles.settingItemLast]}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <IconSymbol
                name="arrow.right.square.fill"
                size={20}
                color={colors.destructive}
              />
              <Text style={[styles.settingText, { color: colors.destructive }]}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
