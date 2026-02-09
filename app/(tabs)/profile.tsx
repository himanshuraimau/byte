import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/context/UserContext';
import { Typography, Spacing } from '@/constants/theme';
import { ThemedView } from '@/components/ui/themed-view';
import { ThemedText } from '@/components/ui/themed-text';
import { Button } from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function ProfileScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const { user, logout } = useUser();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg0,
    },
    scrollContent: {
      padding: Spacing.xl,
      paddingTop: 64,
      maxWidth: 400,
      alignSelf: 'center',
      width: '100%',
    },
    title: {
      ...Typography.h1,
      color: colors.text0,
      marginBottom: Spacing['2xl'],
    },
    section: {
      marginBottom: Spacing['2xl'],
    },
    sectionTitle: {
      ...Typography.monoXs,
      color: colors.text1,
      marginBottom: Spacing.sm,
      textTransform: 'uppercase',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: Spacing.lg,
      paddingHorizontal: Spacing.base,
      backgroundColor: colors.bg1,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border0,
      marginBottom: Spacing.sm,
    },
    rowLabel: {
      ...Typography.body,
      color: colors.text0,
    },
    rowValue: {
      ...Typography.body,
      color: colors.text1,
    },
    themeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: Spacing.lg,
      paddingHorizontal: Spacing.base,
      backgroundColor: colors.bg1,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border0,
    },
    themeLabel: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    themeText: {
      ...Typography.body,
      color: colors.text0,
    },
    themeBadge: {
      ...Typography.monoXs,
      color: colors.text1,
      marginTop: 2,
    },
    logoutButton: {
      marginTop: Spacing['2xl'],
    },
  });

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Profile</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Email</Text>
            <Text style={styles.rowValue} numberOfLines={1}>
              {user?.email ?? '—'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <TouchableOpacity
            style={styles.themeRow}
            onPress={toggleTheme}
            activeOpacity={0.8}
          >
            <View style={styles.themeLabel}>
              <IconSymbol
                size={24}
                name="paintbrush.fill"
                color={colors.text0}
              />
              <View>
                <Text style={styles.themeText}>Theme</Text>
                <Text style={styles.themeBadge}>
                  {isDark ? 'Dark' : 'Light'} mode
                </Text>
              </View>
            </View>
            <View
              style={{
                width: 52,
                height: 28,
                borderRadius: 14,
                backgroundColor: isDark ? colors.accent0 : colors.border0,
                justifyContent: 'center',
                paddingHorizontal: 4,
              }}
            >
              <View
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  backgroundColor: colors.bg0,
                  alignSelf: isDark ? 'flex-end' : 'flex-start',
                }}
              />
            </View>
          </TouchableOpacity>
        </View>

        <Button
          title="Log out"
          onPress={handleLogout}
          variant="secondary"
          style={styles.logoutButton}
        />
      </ScrollView>
    </ThemedView>
  );
}
