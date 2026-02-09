import React, { useState } from 'react';
import { TouchableOpacity, View, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { taskSetService } from '@/services/TaskSetService';
import { Checkbox } from '@/components/ui/Checkbox';

interface TaskCheckboxProps {
  taskName: string;
  date: string;
  checked: boolean;
  disabled: boolean;
  taskSetId: string;
  onToggle?: (checked: boolean) => void;
}

export function TaskCheckbox({
  taskName,
  date,
  checked,
  disabled,
  taskSetId,
  onToggle,
}: TaskCheckboxProps) {
  const { colors } = useTheme();
  const [isChecked, setIsChecked] = useState(checked);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    if (disabled || isLoading) return;

    const newChecked = !isChecked;
    setIsChecked(newChecked);
    setIsLoading(true);

    try {
      await taskSetService.updateDailyState(
        taskSetId,
        date,
        taskName,
        newChecked
      );
      onToggle?.(newChecked);
    } catch (error) {
      console.error('Error toggling task:', error);
      setIsChecked(!newChecked); // Revert on error
    } finally {
      setIsLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      minHeight: 48,
      minWidth: 48,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isChecked ? colors.accent1 : colors.bg0,
      opacity: disabled || isLoading ? 0.5 : 1,
    },
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handleToggle}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={colors.accent0} />
      ) : (
        <Checkbox checked={isChecked} disabled={disabled} />
      )}
    </TouchableOpacity>
  );
}
