import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedView } from '@/components/ui/themed-view';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ExploreScreen() {
  // Mock profile data - in a real app, this would come from a database or context
  const profileData = {
    name: 'User',
    totalSessions: 0,
    totalTasks: 0,
    totalNotes: 0,
    streak: 0,
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <IconSymbol name="person.circle.fill" size={80} color={Colors.accent0} />
          </View>
          <Text style={styles.name}>{profileData.name}</Text>
          <Text style={styles.subtitle}>Byte User</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <IconSymbol name="clock.fill" size={32} color={Colors.accent0} />
            <Text style={styles.statValue}>{profileData.totalSessions}</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>

          <View style={styles.statCard}>
            <IconSymbol name="checkmark.circle.fill" size={32} color={Colors.accent0} />
            <Text style={styles.statValue}>{profileData.totalTasks}</Text>
            <Text style={styles.statLabel}>Tasks</Text>
          </View>

          <View style={styles.statCard}>
            <IconSymbol name="note.text" size={32} color={Colors.accent0} />
            <Text style={styles.statValue}>{profileData.totalNotes}</Text>
            <Text style={styles.statLabel}>Notes</Text>
          </View>

          <View style={styles.statCard}>
            <IconSymbol name="flame.fill" size={32} color={Colors.accent0} />
            <Text style={styles.statValue}>{profileData.streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>ABOUT</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              Track your productivity with Byte. Create tasks, take notes, and run focused sessions to achieve your goals.
            </Text>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>SETTINGS</Text>
          <View style={styles.settingsCard}>
            <View style={styles.settingItem}>
              <IconSymbol name="bell.fill" size={20} color={Colors.text1} />
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <View style={styles.settingItem}>
              <IconSymbol name="paintbrush.fill" size={20} color={Colors.text1} />
              <Text style={styles.settingText}>Appearance</Text>
            </View>
            <View style={styles.settingItem}>
              <IconSymbol name="info.circle.fill" size={20} color={Colors.text1} />
              <Text style={styles.settingText}>About</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.xl,
    paddingBottom: Spacing['3xl'],
  },
  header: {
    alignItems: 'center',
    marginTop: Spacing['2xl'],
    marginBottom: Spacing['2xl'],
  },
  avatarContainer: {
    marginBottom: Spacing.base,
  },
  name: {
    ...Typography.h1,
    color: Colors.text0,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.small,
    color: Colors.text2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.base,
    marginBottom: Spacing['2xl'],
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.bg0,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border0,
  },
  statValue: {
    ...Typography.h1,
    color: Colors.text0,
  },
  statLabel: {
    ...Typography.monoSm,
    color: Colors.text2,
    textTransform: 'uppercase',
  },
  infoSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.monoSm,
    color: Colors.text1,
    marginBottom: Spacing.base,
    textTransform: 'uppercase',
  },
  infoCard: {
    backgroundColor: Colors.bg0,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border0,
  },
  infoText: {
    ...Typography.body,
    color: Colors.text1,
    lineHeight: 24,
  },
  settingsCard: {
    backgroundColor: Colors.bg0,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border0,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    gap: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border0,
  },
  settingText: {
    ...Typography.body,
    color: Colors.text1,
  },
});
